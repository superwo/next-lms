import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseCategories = [
    "Development",
    "Design",
    "Marketing",
    "Business",
    "Finance",
    "Health",
    "Education",
    "Lifestyle",
    "Technology",
    "Photography",
    "Writing",
    "Music",
    "Science",
    "Travel",
    "Food",
    "Other",
] as const;

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
    price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
    duration: z.coerce
        .number()
        .min(1, { message: "Duration must be at least 1" })
        .max(500, { message: "Duration must be at most 500" }),
    level: z.enum(courseLevels),
    category: z.enum(courseCategories, {
        message: "Category is required",
    }),
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

export const chapterSchema = z.object({
    name: z.string().min(3, {
        message: "Chapter name must be at least 3 characters long",
    }),
    courseId: z.uuid({
        message: "Course ID must be a valid UUID",
    }),
});

export const lessonSchema = z.object({
    name: z.string().min(3, {
        message: "Lesson name must be at least 3 characters long",
    }),
    courseId: z.uuid({
        message: "Course ID must be a valid UUID",
    }),
    chapterId: z.uuid({
        message: "Chapter ID must be a valid UUID",
    }),
    description: z
        .string()
        .min(3, {
            message: "Description must be at least 3 characters long",
        })
        .optional(),
    thumbnailKey: z.string().optional(),
    videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

export type ChapterSchemaType = z.infer<typeof chapterSchema>;

export type LessonSchemaType = z.infer<typeof lessonSchema>;
