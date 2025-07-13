"use client";

import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureProps {
    title: string;
    description: string;
    icon: string;
}

const features: FeatureProps[] = [
    {
        title: "Comprehensive Courses",
        description:
            "Explore a wide range of subjects with in-depth courses designed by experts.",
        icon: "📚",
    },
    {
        title: "Interactive Learning",
        description:
            "Engage with interactive content, quizzes, and assignments to enhance your understanding.",
        icon: "🖥️",
    },
    {
        title: "Progress Tracking",
        description:
            "Monitor your learning journey with detailed progress tracking and analytics.",
        icon: "📈",
    },
    {
        title: "Community Support",
        description:
            "Join a vibrant community of learners and educators for support and collaboration.",
        icon: "🤝",
    },
];

export default function Home() {
    const router = useRouter();

    async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("Successfully logged out!");
                },
            },
        });
    }

    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant="outline">
                        The Future of Online Education
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Elevate your Learning Experience
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                        Discover a new way to learn and grow with our platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link
                            className={buttonVariants({
                                size: "lg",
                            })}
                            href="/courses"
                        >
                            Explore Courses
                        </Link>
                        <Link
                            className={buttonVariants({
                                size: "lg",
                                variant: "outline",
                            })}
                            href="/login"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow duration-300"
                    >
                        <CardHeader className="">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
