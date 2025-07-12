"use client";

import { useState, useTransition } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function VerifyRequestPage() {
    const [otp, setOtp] = useState("");

    const [emailPending, startTransition] = useTransition();
    const params = useSearchParams();
    const email = params.get("email") || "";
    const router = useRouter();
    const isOtpCompleted = otp.length === 6;

    function verifyOtp() {
        startTransition(async () => {
            await authClient.signIn.emailOtp({
                email,
                otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("OTP verified successfully!");
                        router.push("/");
                    },
                    onError: (error) => {
                        console.error("Error verifying OTP:", error);
                        toast.error("Invalid OTP. Please try again.");
                    },
                },
            });
        });
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">
                    Please Check Your Email
                </CardTitle>
                <CardDescription>
                    We have sent you an OTP code to verify your email address.
                    Please enter the code to continue.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        maxLength={6}
                        className="gap-2"
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">
                        Enter the OTP sent to your email
                    </p>
                </div>
                <Button
                    disabled={emailPending || !isOtpCompleted}
                    onClick={verifyOtp}
                    className="w-full"
                >
                    {emailPending ? (
                        <>
                            <Loader className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <span>Verify OTP</span>
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
