"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";

export function RichTextEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4",
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
