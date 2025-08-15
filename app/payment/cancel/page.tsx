import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px]">
                <CardContent>
                    <div className="flex w-full justify-center">
                        <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">
                            Payment Cancelled
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground tracking-tight">
                            No worries, you can try again later or contact
                            support if you have any questions.
                        </p>
                        <Link
                            href="/"
                            className={buttonVariants({
                                className: "mt-5 w-full",
                            })}
                        >
                            <ArrowLeft className="size-4" />
                            Go back to Homepage
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
