import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface NavLinkProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed: boolean;
}

export function NavLink({ icon: Icon, label, href, isCollapsed }: NavLinkProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        isCollapsed ? "px-2" : "px-4",
      )}
      asChild
    >
      <Link href={href} className="flex items-center gap-2">
        <Icon className={cn("h-5 w-5", isCollapsed && "mx-auto")} />
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </Button>
  );
}