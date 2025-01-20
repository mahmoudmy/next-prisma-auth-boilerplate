'use server'

import prisma from "@/lib/prisma"

interface Data {
	name: string;
	username: string;
	role: string;
}

export default async function updateUser(userId: string, newData: Data) {
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			name: newData.name,
			username: newData.username,
			role: newData.role,
		},
	})
}