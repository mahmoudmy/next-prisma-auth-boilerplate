import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin, customSession, username } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        username(),
        admin(),
        // customSession(async ({ user, session }) => {
        //     const theUser = prisma.user.findUnique({
        //         where: { id: session.userId },
        //         select: { role: true, username: true }
        //     });
        //     return {
        //         user: {
        //             ...user,
        //             ...theUser
        //         },
        //         session
        //     };
        // }),
    ]
});