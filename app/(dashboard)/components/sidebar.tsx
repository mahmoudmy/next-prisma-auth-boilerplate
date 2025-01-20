import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle,
  BarChart3,
  FileText,
  Mail
} from "lucide-react";
import { NavLink } from "./nav-link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

export function Sidebar({ className, isCollapsed }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: "داشبورد", href: "/dashboard" },
    { icon: Users, label: "کاربران", href: "/users" },
    { icon: BarChart3, label: "گزارش‌ها", href: "/reports" },
    { icon: FileText, label: "اسناد", href: "/documents" },
    { icon: Mail, label: "پیام‌ها", href: "/messages" },
    { icon: Settings, label: "تنظیمات", href: "/settings" },
    { icon: HelpCircle, label: "راهنما", href: "/help" },
  ];

  return (
    <div className={cn("pb-12 border-l", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className={cn(
              "mb-4 px-2 text-xl font-semibold tracking-tight",
              isCollapsed && "text-center"
            )}>
              {!isCollapsed && "سیستم مدیریت"}
            </h2>
            <ScrollArea className="h-[calc(100vh-8rem)] px-1">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <NavLink
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}