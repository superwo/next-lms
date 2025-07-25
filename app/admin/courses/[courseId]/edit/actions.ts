"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schemas";

export async function EditCourse(
    data: CourseSchemaType,
    courseId: string
): Promise<ApiResponse> {
    const user = await requireAdmin();

    try {
        const result = courseSchema.safeParse(data);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user?.user?.id as string,
            },
            data: {
                ...result.data,
            },
        });

        return {
            status: "success",
            message: "Course updated successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to update course",
        };
    }
}
