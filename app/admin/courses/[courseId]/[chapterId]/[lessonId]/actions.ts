"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zod-schemas";

export async function updateLesson(
    values: LessonSchemaType,
    lessonId: string
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data provided.",
            };
        }

        await prisma.lesson.update({
            where: {
                id: lessonId,
            },
            data: {
                title: result.data.name,
                description: result.data.description,
                thumbnailKey: result.data.thumbnailKey,
                videoKey: result.data.videoKey,
            },
        });

        return {
            status: "success",
            message: "Lesson updated successfully.",
        };
    } catch {
        return {
            status: "error",
            message: "An error occurred while updating the lesson.",
        };
    }
}
