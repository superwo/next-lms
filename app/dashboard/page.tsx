import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";

export default async function DashboardPage() {
    const [courses, enrolledCourses] = await Promise.all([
        getAllCourses(),
        getEnrolledCourses(),
    ]);
    return (
        <>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Enrolled Courses</h1>
                <p className="text-muted-foreground">
                    Here you can see all the courses you have access to.
                </p>
            </div>

            {enrolledCourses.length === 0 ? (
                <EmptyState
                    title="No Enrolled Courses"
                    description="You are not enrolled in any courses yet."
                    buttonText="Browse Courses"
                    href="/courses"
                />
            ) : (
                <p>The courses you are enrolled in</p>
            )}

            <section className="mt-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Available Courses</h1>
                    <p className="text-muted-foreground">
                        Here you can see all the courses available in the
                        system.
                    </p>
                </div>

                {courses.filter(
                    (course) =>
                        !enrolledCourses.some(
                            ({ Course: enrolled }) => enrolled.id === course.id
                        )
                ).length === 0 ? (
                    <EmptyState
                        title="No Available Courses"
                        description="you have already enrolled in all courses"
                        buttonText="Browse Courses"
                        href="/courses"
                    />
                ) : (
                    <p>alsdfjajksfd jlasdf</p>
                )}
            </section>
        </>
    );
}
