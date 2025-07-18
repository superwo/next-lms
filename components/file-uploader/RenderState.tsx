import { cn } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon
                    className={cn(
                        "size-6 text-muted-foreground",
                        isDragActive && "text-primary"
                    )}
                />
            </div>
            <p className="text-base font-semibold text-foreground">
                Drop your files here or{" "}
                <span className="text-primary font-bold cursor-pointer">
                    Click to upload
                </span>
            </p>
        </div>
    );
}
