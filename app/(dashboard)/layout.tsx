"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import LoadingScreen from "./components/loading"

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const router = useRouter()

	const {
		data: session,
		isPending, //loading state
		error //error object
	} = authClient.useSession()

	useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [isPending, session, router])

  if (isPending) {
    return <LoadingScreen />
  }

  if (!session) {
    return null // Return null instead of redirecting directly
  }

	return (
		<SidebarProvider>
			<AppSidebar
				side="right"
				user={{
					...session.user,
					image: session.user.image || undefined, // Convert null to undefined
					email: session.user.email || undefined
				}}
			/>
			<SidebarInset>
				{/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-mr-1" />
						<Separator orientation="vertical" className="ml-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Building Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header> */}
				<div className="flex flex-1 flex-col gap-4 p-4">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}


