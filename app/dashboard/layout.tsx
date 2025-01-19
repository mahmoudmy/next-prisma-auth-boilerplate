import { authClient } from "@/lib/auth-client" // import the auth client
import { useRouter } from "next/router"
 
export function DashboardLayout(){

    const router = useRouter()
 
    const { 
        data: session, 
        isPending, //loading state
        error //error object
    } = authClient.useSession() 
 
    if(isPending) {
        return(
            <span>Loading ...</span>
        )
    }

    if(!session) {
        router.push('/login')
    }

    return(
        <div>داشبورد</div>
    )
}