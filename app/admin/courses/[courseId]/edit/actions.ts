"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schemas";
import { revalidatePath } from "next/cache";

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

export async function reorderLessons(
    chapterId: string,
    lessons: { id: string; position: number }[],
    courseId: string
): Promise<ApiResponse> {
    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons provided to reorder",
            };
        }

        const updates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: { id: lesson.id, chapterId },
                data: { position: lesson.position },
            })
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to reorder lessons",
        };
    }
}
