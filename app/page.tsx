"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

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
        <div className="p-24">
            <h1>Hello World</h1>
            <ThemeToggle />
            {session ? (
                <div>
                    <p>{session.user.name}</p>
                    <Button onClick={signOut}>Logout</Button>
                </div>
            ) : (
                <Button>Login</Button>
            )}
        </div>
    );
}
