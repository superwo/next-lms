"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schemas";

export async function CreateCourse(
    values: CourseSchemaType
): Promise<ApiResponse> {
    const session = await requireAdmin();

    try {
        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }

        const data = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.smallDescription,
            default_price_data: {
                currency: "usd",
                unit_amount: validation.data.price * 100, // Convert to cents
            },
        });
        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user?.id as string,
                stripePriceId: data.default_price as string,
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
