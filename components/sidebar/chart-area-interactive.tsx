"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

function getRandomEnrollments(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const dummyEnrollmentsData = [
    { date: "2024-01-01", enrollments: getRandomEnrollments(80, 120) },
    { date: "2024-01-15", enrollments: getRandomEnrollments(80, 120) },
    { date: "2024-02-01", enrollments: getRandomEnrollments(100, 140) },
    { date: "2024-02-15", enrollments: getRandomEnrollments(100, 140) },
    { date: "2024-03-01", enrollments: getRandomEnrollments(120, 160) },
    { date: "2024-03-15", enrollments: getRandomEnrollments(120, 160) },
    { date: "2024-04-01", enrollments: getRandomEnrollments(140, 180) },
    { date: "2024-04-15", enrollments: getRandomEnrollments(140, 180) },
    { date: "2024-05-01", enrollments: getRandomEnrollments(160, 200) },
    { date: "2024-05-15", enrollments: getRandomEnrollments(160, 200) },
    { date: "2024-06-01", enrollments: getRandomEnrollments(180, 220) },
    { date: "2024-06-15", enrollments: getRandomEnrollments(180, 220) },
    { date: "2024-07-01", enrollments: getRandomEnrollments(200, 240) },
    { date: "2024-07-15", enrollments: getRandomEnrollments(200, 240) },
    { date: "2024-08-01", enrollments: getRandomEnrollments(220, 260) },
    { date: "2024-08-15", enrollments: getRandomEnrollments(220, 260) },
    { date: "2024-09-01", enrollments: getRandomEnrollments(240, 280) },
    { date: "2024-09-15", enrollments: getRandomEnrollments(240, 280) },
    { date: "2024-10-01", enrollments: getRandomEnrollments(260, 300) },
    { date: "2024-10-15", enrollments: getRandomEnrollments(260, 300) },
    { date: "2024-11-01", enrollments: getRandomEnrollments(280, 320) },
    { date: "2024-11-15", enrollments: getRandomEnrollments(280, 320) },
    { date: "2024-12-01", enrollments: getRandomEnrollments(300, 340) },
    { date: "2024-12-15", enrollments: getRandomEnrollments(260, 320) },
];

const chartConfig = {
    enrollments: {
        label: "Enrollments",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Total Enrollments</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Total Enrollments for the last 30 days: 1200
                    </span>
                    <span className="@[540px]/card:hidden">
                        Last 30 days: 1200
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    className="aspect-auto h-[250px] w-full"
                    config={chartConfig}
                >
                    <BarChart
                        data={dummyEnrollmentsData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={"preserveStartEnd"}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                            }
                                        );
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey={"enrollments"}
                            fill="var(--color-enrollments)"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
