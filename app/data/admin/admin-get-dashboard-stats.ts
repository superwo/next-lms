import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
    await requireAdmin();

    const [totalSignups, totalCustomers, totalCourses, totalLessons] =
        await Promise.all([
            // total signups
            prisma.user.count(),
            // total customers
            prisma.user.count({
                where: {
                    enrollments: {
                        some: {},
                    },
                },
            }),
            // total courses
            prisma.course.count(),
            // total lessons
            prisma.lesson.count(),
        ]);

    return {
        totalSignups,
        totalCustomers,
        totalCourses,
        totalLessons,
    };
}
