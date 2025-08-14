"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { DeleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCourseRoute() {
    const [pending, startTransition] = useTransition();
    const { courseId } = useParams<{ courseId: string }>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                DeleteCourse(courseId)
            );

            if (error) {
                toast.error("An error occurred while deleting the course");
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                router.push("/admin/courses");
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    }
    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>
                        Are you sure you want to delete this course?
                    </CardTitle>
                    <CardDescription>
                        This action cannot be undone. All course content will be
                        permanently deleted.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Link
                        className={buttonVariants({ variant: "outline" })}
                        href="/admin/courses"
                    >
                        Cancel
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={onSubmit}
                        disabled={pending}
                    >
                        {pending ? (
                            <>
                                <Loader2 className="animate-spin size-4" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" />
                                Delete Course
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
