"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Ban, Edit, Search, UserPlus, UserCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import updateUser from "./update";
import TablePending from "../components/TablePending";

interface User {
  id: string;
  name: string;
  username?: string;
  role?: string | null;
  createdAt: Date;
  banned?: boolean | null;
}

interface UserFormData {
  name: string;
  username: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const initialFormData: UserFormData = {
    name: "",
    username: "",
    role: "user",
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  useEffect(() => {
    loadUsers(currentPage)
  }, [currentPage, searchQuery])

  const loadUsers = async (page: number) => {
    setIsPending(true);
    if (searchQuery.length > 0) {
      setCurrentPage(1)
    }
    try {
      const response = await authClient.admin.listUsers({
        query: {
          searchField: "name",
          searchOperator: "contains",
          searchValue: searchQuery,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });
      if (response.data) {
        setUsers(response.data.users);
      } else {
        throw new Error('Error in getting user data')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "خطا در بارگذاری کاربران",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleCreateUser = async () => {
    setIsLoading(true)
    try {
      await authClient.admin.createUser({
        name: formData.name,
        email: formData.username + '@calibro.ir',
        password: formData.username,
        role: formData.role,
        data: {
          username: formData.username,
        }
      });
      toast({
        title: "Success",
        description: "اطلاعات کاربر ثبت شد",
      });
      setIsDialogOpen(false);
      setFormData(initialFormData);
      loadUsers(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "خطا در ایجاد کاربر",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  };

  const handleUpdateUser = async () => {
    setIsLoading(true)
    if (!selectedUser) return
    try {
      await updateUser(selectedUser?.id, formData)
      toast({
        title: "Success",
        description: "اطلاعات کاربر بروزرسانی شد",
      });
      setIsDialogOpen(false);
      setFormData(initialFormData);
      loadUsers(currentPage);
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "خطا در ویرایش کاربر",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await authClient.admin.banUser({
        userId,
        banReason: "Administrative action",
      });
      toast({
        title: "Success",
        description: "کاربر مسدود شد!",
      });
      loadUsers(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "خطا در مسدودسازی کاربر",
        variant: "destructive",
      });
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await authClient.admin.unbanUser({
        userId,
      });
      toast({
        title: "Success",
        description: "کاربر مسدود شد!",
      });
      loadUsers(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "خطا در فعالسازی کاربر",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedUser(null);
              setFormData(initialFormData);
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              افزودن کاربر
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser ? "ویرایش اطلاعات کاربر" : "ایجاد کاربر جدید"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">نام</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">نام کاربری</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">نقش</label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">کاربر</SelectItem>
                    <SelectItem value="admin">مدیر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                disabled={isLoading}
                onClick={selectedUser ? handleUpdateUser : handleCreateUser}
              >
                {selectedUser ? "بروزرسانی اطلاعات کاربر" : "ایجاد کاربر"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="جستجوی نام ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>نام کاربری</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>تاریخ ایجاد</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          {isPending ?
            <TablePending cols={6} />
            :
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                  <TableCell>
                    {user.banned ? (
                      <span className="text-red-500 font-medium">مسدود</span>
                    ) : (
                      <span className="text-green-500 font-medium">فعال</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({
                            name: user.name,
                            username: user.username || '',
                            role: user.role || 'user',
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => user.banned ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                      >
                        {user.banned ? (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <Ban className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          }
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          قبلی
        </Button>
        <span className="text-sm text-gray-600">
          صفحه {currentPage}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={users.length < itemsPerPage}
        >
          بعدی
        </Button>
      </div>
    </div>
  );
}