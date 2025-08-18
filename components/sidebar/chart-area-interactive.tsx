"use client";

import * as React from "react";
import { BarChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Card,
    CardAction,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const dummyEnrollmentsData = [
  { date: "2024-01-01", enrollments: 80 },
  { date: "2024-01-15", enrollments: 95 },
  { date: "2024-02-01", enrollments: 110 },
  { date: "2024-02-15", enrollments: 120 },
  { date: "2024-03-01", enrollments: 130 },
  { date: "2024-03-15", enrollments: 140 },
  { date: "2024-04-01", enrollments: 150 },
  { date: "2024-04-15", enrollments: 160 },
  { date: "2024-05-01", enrollments: 170 },
  { date: "2024-05-15", enrollments: 180 },
  { date: "2024-06-01", enrollments: 190 },
  { date: "2024-06-15", enrollments: 200 },
  { date: "2024-07-01", enrollments: 210 },
  { date: "2024-07-15", enrollments: 220 },
  { date: "2024-08-01", enrollments: 230 },
  { date: "2024-08-15", enrollments: 240 },
  { date: "2024-09-01", enrollments: 250 },
  { date: "2024-09-15", enrollments: 260 },
  { date: "2024-10-01", enrollments: 270 },
  { date: "2024-10-15", enrollments: 280 },
  { date: "2024-11-01", enrollments: 290 },
  { date: "2024-11-15", enrollments: 300 },
  { date: "2024-12-01", enrollments: 310 },
  { date: "2024-12-15", enrollments: 320 },
];

const chartConfig = {
    enrollments: {
        label: "Enrollments",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState("90d");

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d");
        }
    }, [isMobile]);

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
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
