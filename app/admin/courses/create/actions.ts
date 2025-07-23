"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schemas";

export async function CreateCourse(
    data: CourseSchemaType
): Promise<ApiResponse> {
    const session = await requireAdmin();

    try {
        const validation = courseSchema.safeParse(data);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }

        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user?.id as string,
            },
        });

        return {
            status: "success",
            message: "Course created successfully",
        };
    } catch (error) {
        console.error("Error creating course:", error);
        return {
            status: "error",
            message: "Failed to create course",
        };
    }
}
