"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Header from "./components/header"
import Sidebar from "./components/sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const router = useRouter()

  const {
	  data: session,
	  isPending, //loading state
	  error //error object
  } = authClient.useSession()

  if (isPending) {
	  return (
		  <span>Loading ...</span>
	  )
  }

  if (!session) {
	  router.push('/login')
  } 

  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 p-6">
          <Button variant="outline" size="icon" className="mb-4 lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          {children}
        </main>
      </div>
    </div>
  )
}


