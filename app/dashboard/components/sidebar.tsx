"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, Boxes, LayoutDashboard, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Boxes,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ className, open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-96 bg-background transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-auto lg:w-auto",
        open ? "translate-x-0" : "-translate-x-full",
        className,
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="px-3 py-4 lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <nav className="grid items-start gap-2">
                {sidebarNavItems.map((item, index) => (
                  <Link key={index} href={item.href}>
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent" : "transparent",
                      )}
                    >
                      <item.icon className="ml-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

