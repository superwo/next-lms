import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetRecentCourses() {
    // fake delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await requireAdmin();
    const data = await prisma.course.findMany({
        orderBy: {
            updatedAt: "desc",
        },
        take: 2,
        select: {
            id: true,
            title: true,
            smallDescription: true,
            slug: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
        },
    });

    return data;
}
