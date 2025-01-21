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
import { Label } from "@/components/ui/label";
import getUsers from "./getUsers";
import { DynamicPagination } from "../components/DynamicPagination";
import { useSearchParams, useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  username?: string | null;
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
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;
  const router = useRouter();
  const searchParams = useSearchParams();
  // Replace currentPage state with URL params
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  const initialFormData: UserFormData = {
    name: "",
    username: "",
    role: "user",
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  useEffect(() => {
    loadUsers();
  }, [page, searchQuery]);

  const loadUsers = async () => {
    setIsPending(true);
    try {
      const { items, totalItems } = await getUsers(searchQuery, page);
      setUsers(items);
      setTotalCount(totalItems);
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

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", query);
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
    setSearchQuery(query);
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
      loadUsers();
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
      loadUsers();
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
      loadUsers();
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
      loadUsers();
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
          <DialogContent dir="rtl">
            <DialogHeader dir="rtl">
              <DialogTitle dir="rtl">{selectedUser ? "ویرایش اطلاعات کاربر" : "ایجاد کاربر جدید"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>نام</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>نام کاربری</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <Label>نقش</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="جستجوی نام ..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
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

      <div className="mt-6">
        <DynamicPagination
          page={page}
          pageSize={itemsPerPage}
          totalCount={totalCount}
          pageSearchParam="page"
        />
      </div>

    </div>
  );
}