import { z } from "zod";

const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100),
    description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters long" }),
    fileKey: z
        .string()
        .min(1, { message: "File key must be at least 1 character long" }),
    price: z.number().min(1, { message: "Price must be at least 1" }),
    duration: z
        .number()
        .min(1, { message: "Duration must be at least 1" })
        .max(500, { message: "Duration must be at most 500" }),
    level: z.enum(courseLevels),
    category: z.string(),
    smallDescription: z
        .string()
        .min(3, {
            message: "Small description must be at least 3 characters long",
        })
        .max(200, {
            message: "Small description must be at most 200 characters long",
        }),
    slug: z
        .string()
        .min(3, { message: "Slug must be at least 3 characters long" })
        .max(50, { message: "Slug must be at most 50 characters long" }),
    status: z.enum(courseStatus, { message: "Status is required" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
