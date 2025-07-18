"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "./RenderState";

export function Uploader() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Handle file upload logic here
        console.log(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });
    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed transition-colors duration-200 w-full h-64",
                isDragActive
                    ? "border-primary bg-primary/10 border-solid"
                    : "border-border hover:border-primary"
            )}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                <RenderEmptyState isDragActive={isDragActive} />
            </CardContent>
        </Card>
    );
}
