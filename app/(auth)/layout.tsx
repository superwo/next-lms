import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/public/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link
                href="/"
                className={buttonVariants({
                    variant: "outline",
                    className: "absolute left-4 top-4",
                })}
            >
                <ArrowLeft className="size-4" />
                Back
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    className="flex items-center gap-2 self-center font-medium"
                    href="/"
                >
                    <Image
                        src={Logo}
                        alt="Next LMS Logo"
                        width={44}
                        height={44}
                    />
                    Next LMS
                </Link>
                {children}
                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <span className="hover:text-primary hover:underline">
                        Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="hover:text-primary hover:underline">
                        Privacy Policy
                    </span>
                    .
                </div>
            </div>
        </div>
    );
}
