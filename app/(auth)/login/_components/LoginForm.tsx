"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { GithubIcon, Loader, Send } from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router = useRouter();
    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();

    const [email, setEmail] = useState("");

    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Successfully logged in with Github!");
                    },
                    onError: (error) => {
                        console.error("Error during Github sign-in:", error);
                        toast.error(`Internal server error.`);
                    },
                },
            });
        });
    }

    function signInWithEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Check your email for the OTP code!");
                        router.push(`/verify-request`);
                    },
                    onError: (error) => {
                        console.error("Error during email sign-in:", error);
                        toast.error(`Error sending OTP. Please try again.`);
                    },
                },
            });
        });
    }

    return (
        <Card>
            <CardHeader className="">
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription className="">
                    Login with your Github or Email Account
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button
                    disabled={githubPending}
                    onClick={signInWithGithub}
                    className="w-full"
                    variant="outline"
                >
                    {githubPending ? (
                        <>
                            <Loader className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <GithubIcon className="size-4" />
                            Sign In with Github
                        </>
                    )}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <Button onClick={signInWithEmail} disabled={emailPending}>
                        {emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <Send className="size-4" />
                                <span>Continue with Email</span>
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
