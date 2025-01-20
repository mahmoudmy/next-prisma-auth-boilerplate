"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useState } from "react"
import { Sidebar } from "./components/sidebar"
import { Navbar } from "./components/navbar"
import { cn } from "@/lib/utils"
import LoadingScreen from "./components/loading"
import { User } from "better-auth"

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const router = useRouter()

	const {
		data: session,
		isPending, //loading state
		error //error object
	} = authClient.useSession()

	if (isPending) {
		return (
			<div>
				<LoadingScreen />
			</div>
		)
	}

	if (!session) {
		return router.push('/login')
	}

	return (
		<div className="relative flex min-h-screen" dir="rtl">
			{/* Sidebar for mobile */}
			<div
				className={cn(
					"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden",
					isSidebarOpen ? "block" : "hidden"
				)}
				onClick={() => setIsSidebarOpen(false)}
			/>
			<div
				className={cn(
					"fixed top-0 bottom-0 right-0 z-50 w-72 bg-background md:hidden",
					isSidebarOpen ? "translate-x-0" : "translate-x-full"
				)}
			>
				<Sidebar isCollapsed={false} />
			</div>

			{/* Sidebar for desktop */}
			<div
				className={cn(
					"hidden md:block",
					isSidebarCollapsed ? "w-[80px]" : "w-72"
				)}
			>
				<Sidebar isCollapsed={isSidebarCollapsed} />
			</div>

			{/* Main content */}
			<div className="flex-1">
				<Navbar user={session?.user as User} onMenuClick={() => setIsSidebarOpen(true)} />
				<main className="p-6">{children}</main>
			</div>
		</div>
	);
}


