"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

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
		<div>{children}</div>
	)
}