"use server"

import prisma from "@/lib/prisma"

const itemsPerPage = 10

export default async function getUsers(searchQuery: string, page: number) {
	const items = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			banned: true,
			createdAt: true
		},
		where: {
			...(searchQuery ? { name: { contains: searchQuery } } : {})
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: itemsPerPage,
		skip: (page - 1) * itemsPerPage
	})

	const totalItems = await prisma.user.count({
		where: {
			...(searchQuery ? { name: { contains: searchQuery } } : {})
		},
	})

	return {items, totalItems}
}