import { adminGetCourse } from "@/app/data/admin/admin-get-course";

type Params = Promise<{ courseId: string }>;

export default async function EditCoursePage({ params }: { params: Params }) {
    const { courseId } = await params;
    const data = await adminGetCourse(courseId);
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course:{" "}
                <span className="text-primary underline">{data.title}</span>
            </h1>
        </div>
    );
}
