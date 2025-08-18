import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollmentStats() {
    await requireAdmin();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const enrollments = await prisma.enrollment.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo,
            },
        },
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const last30Days: { date: string; enrollments: number }[] = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];

        last30Days.push({
            date: dateString,
            enrollments: 0,
        });
    }

    enrollments.forEach((enrollment) => {
        const dateString = enrollment.createdAt.toISOString().split("T")[0];
        const index = last30Days.findIndex((d) => d.date === dateString);
        if (index !== -1) {
            last30Days[index].enrollments += 1;
        }
    });

    return last30Days;
}
