import { adminClient, customSessionClient, usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import type { auth } from "@/lib/auth"; // Import the auth instance as a type

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your auth server
    plugins: [ 
        usernameClient() ,
        adminClient(),
        // customSessionClient<typeof auth>()
    ] 
})