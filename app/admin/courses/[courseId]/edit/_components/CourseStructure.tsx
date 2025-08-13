"use client";

import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
    DndContext,
    DraggableSyntheticListeners,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ChevronDown,
    ChevronRight,
    FileText,
    GripVertical,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";

interface iAppProps {
    data: AdminCourseSingularType;
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
        type: "chapter" | "lesson";
        chapterId?: string; // only relevant for lessons
    };
}

export function CourseStructure({ data }: iAppProps) {
    const initialItems =
        data.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            order: chapter.position,
            isOpen: true, // default chapters to open
            lessons: chapter.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                order: lesson.position,
            })),
        })) || [];
    const [items, setItems] = useState(initialItems);

    console.log(items);

    useEffect(() => {
        setItems((prevItems) => {
            const updatedItems =
                data.chapters.map((chapter) => ({
                    id: chapter.id,
                    title: chapter.title,
                    order: chapter.position,
                    isOpen:
                        prevItems.find((item) => item.id === chapter.id)
                            ?.isOpen ?? true,
                    lessons: chapter.lessons.map((lesson) => ({
                        id: lesson.id,
                        title: lesson.title,
                        order: lesson.position,
                    })),
                })) || [];

            return updatedItems;
        });
    }, [data]);

    function SortableItem({
        children,
        id,
        className,
        data,
    }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id, data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={cn(
                    "touch-none",
                    className,
                    isDragging ? "z-10" : ""
                )}
            >
                {children(listeners)}
            </div>
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;
        const activeType = active.data.current?.type as "chapter" | "lesson";
        const overType = over.data.current?.type as "chapter" | "lesson";
        const courseId = data.id;

        if (activeType === "chapter") {
            let targetChapterId = null;
            if (overType === "chapter") {
                targetChapterId = overId;
            } else if (overType === "lesson") {
                targetChapterId = over.data.current?.chapterId ?? null;
            }

            if (!targetChapterId) {
                toast.error(
                    "Could not determine target chapter for reordering"
                );
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex(
                (item) => item.id === targetChapterId
            );

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Invalid drag operation");
                return;
            }

            const reordedLocalChapters = arrayMove(items, oldIndex, newIndex);
            const updatedChaptersForState = reordedLocalChapters.map(
                (chapter, index) => ({
                    ...chapter,
                    order: index + 1, // update order based on new index
                })
            );
            const previousItems = [...items];
            setItems(updatedChaptersForState);

            if (courseId) {
                const chaptersToUpdate = updatedChaptersForState.map(
                    (chapter) => ({
                        id: chapter.id,
                        position: chapter.order,
                    })
                );
                const reorderChapterPromise = () =>
                    reorderChapters(courseId, chaptersToUpdate);
                toast.promise(reorderChapterPromise(), {
                    loading: "Reordering chapters...",
                    success: (result) => {
                        if (result.status === "success") {
                            return result.message;
                        }
                        throw new Error(result.message);
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder chapters";
                    },
                });
            }
            return;
        }

        if (activeType === "lesson" && overType === "lesson") {
            const chapterId = active.data.current?.chapterId;
            const overChapterId = over.data.current?.chapterId;

            if (!chapterId || chapterId !== overChapterId) {
                toast.error(
                    "Could not determine chapter for lesson reordering"
                );
                return;
            }

            const chapterIndex = items.findIndex(
                (chapter) => chapter.id === chapterId
            );

            if (chapterIndex === -1) {
                toast.error("Invalid chapter for lesson reordering");
                return;
            }

            const chapterToUpdate = items[chapterIndex];
            const oldLessonIndex = chapterToUpdate.lessons.findIndex(
                (lesson) => lesson.id === activeId
            );
            const newLessonIndex = chapterToUpdate.lessons.findIndex(
                (lesson) => lesson.id === overId
            );

            if (oldLessonIndex === -1 || newLessonIndex === -1) {
                toast.error("Invalid lesson drag operation");
                return;
            }

            const reorderedLessons = arrayMove(
                chapterToUpdate.lessons,
                oldLessonIndex,
                newLessonIndex
            );
            const updatedLessonsForState = reorderedLessons.map(
                (lesson, index) => ({
                    ...lesson,
                    order: index + 1, // update order based on new index
                })
            );

            const newItems = [...items];

            newItems[chapterIndex] = {
                ...chapterToUpdate,
                lessons: updatedLessonsForState,
            };

            const previousItems = [...items];
            setItems(newItems);

            if (courseId) {
                const lessonsToUpdate = updatedLessonsForState.map(
                    (lesson) => ({
                        id: lesson.id,
                        position: lesson.order,
                    })
                );
                const reorderLessonPromise = () =>
                    reorderLessons(chapterId, lessonsToUpdate, courseId);
                toast.promise(reorderLessonPromise(), {
                    loading: "Reordering lessons...",
                    success: (result) => {
                        if (result.status === "success") {
                            return result.message;
                        }
                        throw new Error(result.message);
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder lessons";
                    },
                });
            }

            return;
        }
    }

    function toggleChapter(chapterId: string) {
        setItems((prevItems) =>
            prevItems.map((chapter) =>
                chapter.id === chapterId
                    ? { ...chapter, isOpen: !chapter.isOpen }
                    : chapter
            )
        );
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Course Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <SortableContext
                        strategy={verticalListSortingStrategy}
                        items={items}
                    >
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                data={{ type: "chapter" }}
                            >
                                {(listeners) => (
                                    <Card>
                                        <Collapsible
                                            open={item.isOpen}
                                            onOpenChange={() =>
                                                toggleChapter(item.id)
                                            }
                                        >
                                            <div className="flex items-center justify-between p-3 border-b border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant={"ghost"}
                                                        size={"icon"}
                                                        {...listeners}
                                                    >
                                                        <GripVertical className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="flex items-center"
                                                        >
                                                            {item.isOpen ? (
                                                                <ChevronDown className="size-4" />
                                                            ) : (
                                                                <ChevronRight className="size-4" />
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <p className="cursor-pointer hover:text-primary pl-2">
                                                        {item.title}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant={"outline"}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                            <CollapsibleContent>
                                                <div className="p-1">
                                                    <SortableContext
                                                        items={item.lessons.map(
                                                            (lesson) =>
                                                                lesson.id
                                                        )}
                                                        strategy={
                                                            verticalListSortingStrategy
                                                        }
                                                    >
                                                        {item.lessons.map(
                                                            (lesson) => (
                                                                <SortableItem
                                                                    key={
                                                                        lesson.id
                                                                    }
                                                                    id={
                                                                        lesson.id
                                                                    }
                                                                    data={{
                                                                        type: "lesson",
                                                                        chapterId:
                                                                            item.id,
                                                                    }}
                                                                >
                                                                    {(
                                                                        lessonListeners
                                                                    ) => (
                                                                        <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <Button
                                                                                    variant={
                                                                                        "ghost"
                                                                                    }
                                                                                    size={
                                                                                        "icon"
                                                                                    }
                                                                                    {...lessonListeners}
                                                                                >
                                                                                    <GripVertical className="size-4" />
                                                                                </Button>
                                                                                <FileText className="size-4" />
                                                                                <Link
                                                                                    href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                                                                >
                                                                                    {
                                                                                        lesson.title
                                                                                    }
                                                                                </Link>
                                                                            </div>
                                                                            <Button
                                                                                variant={
                                                                                    "outline"
                                                                                }
                                                                                size={
                                                                                    "icon"
                                                                                }
                                                                            >
                                                                                <Trash2 className="size-4" />
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            )
                                                        )}
                                                    </SortableContext>
                                                    <div className="p-2">
                                                        <Button
                                                            variant={"outline"}
                                                            className="w-full"
                                                        >
                                                            Create New Lesson
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}
