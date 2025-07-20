"use client";

import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadedState,
    RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderSteate {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video";
}

export function Uploader() {
    const [fileState, setFileState] = useState<UploaderSteate>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    });

    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

        try {
            //1. Get presigned URL from the server
            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            });

            if (!presignedResponse.ok) {
                toast.error("Failed to get presigned URL");
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));

                return;
            }

            const { presignedUrl, key } = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round(
                            (event.loaded / event.total) * 100
                        );
                        setFileState((prev) => ({
                            ...prev,
                            progress,
                        }));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 100,
                            key,
                        }));
                        toast.success("File uploaded successfully");
                        resolve();
                    } else {
                        reject(new Error("Upload failed"));
                        toast.error("Failed to upload file");
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Upload failed"));
                    toast.error("Failed to upload file");
                };

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });
        } catch {
            toast.error("An error occurred while uploading the file");
            setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true,
            }));
        }
    }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];

                if (
                    fileState.objectUrl &&
                    !fileState.objectUrl.startsWith("http")
                ) {
                    URL.revokeObjectURL(fileState.objectUrl);
                }

                setFileState({
                    file,
                    uploading: false,
                    progress: 0,
                    objectUrl: URL.createObjectURL(file),
                    error: false,
                    id: uuidv4(),
                    isDeleting: false,
                    fileType: "image",
                });

                uploadFile(file);
            }
        },
        [fileState.objectUrl]
    );

    async function handleRemoveFile() {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState((prev) => ({
                ...prev,
                isDeleting: true,
            }));
        } catch {}
    }

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find(
                (rejection) => rejection.errors[0].code === "too-many-files"
            );
            if (tooManyFiles) {
                toast.error(
                    "Too many files selected. Please select only one file."
                );
            }

            const fileSizeToBig = fileRejection.find(
                (rejection) => rejection.errors[0].code === "file-too-large"
            );
            if (fileSizeToBig) {
                toast.error(
                    "File size too large. Please select a file smaller than 5MB."
                );
            }

            const fileTypeNotSupported = fileRejection.find(
                (rejection) => rejection.errors[0].code === "file-invalid-type"
            );
            if (fileTypeNotSupported) {
                toast.error(
                    "File type not supported. Please select an image file."
                );
            }
        }
    }

    function renderContent() {
        if (fileState.uploading) {
            return (
                <RenderUploadingState
                    progress={fileState.progress}
                    file={fileState.file!}
                />
            );
        }

        if (fileState.error) {
            return <RenderErrorState />;
        }

        if (fileState.objectUrl) {
            return <RenderUploadedState previewUrl={fileState.objectUrl} />;
        }

        return <RenderEmptyState isDragActive={isDragActive} />;
    }

    useEffect(() => {
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl);
        }
    }, [fileState.objectUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5mb
        onDropRejected: rejectedFiles,
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
                {renderContent()}
            </CardContent>
        </Card>
    );
}
