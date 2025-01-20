import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Menu,
  Search,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onMenuClick: () => void;
  user: {
    id: string;
    name: string;
    username: string;
  }
}

export function Navbar({ user, onMenuClick }: NavbarProps) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 mr-4 md:mr-8">
          <h1 className="text-xl font-bold">پنل مدیریت</h1>
        </div>

        <div className="flex items-center gap-4 mr-auto">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="جستجو..."
                className="w-[200px] pr-8 md:w-[300px]"
              />
            </div>
          </form>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>پروفایل</DropdownMenuItem>
              <DropdownMenuItem>تنظیمات</DropdownMenuItem>
              <DropdownMenuItem>خروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}