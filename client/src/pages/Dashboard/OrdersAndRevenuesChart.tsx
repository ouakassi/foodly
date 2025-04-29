"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
const chartData = [
  { date: "2024-04-01", orders: 222, revenue: 150 },
  { date: "2024-04-02", orders: 97, revenue: 180 },
  { date: "2024-04-03", orders: 167, revenue: 120 },
  { date: "2024-04-04", orders: 242, revenue: 260 },
  { date: "2024-04-05", orders: 373, revenue: 290 },
  { date: "2024-04-06", orders: 301, revenue: 340 },
  { date: "2024-04-07", orders: 245, revenue: 180 },
  { date: "2024-04-08", orders: 409, revenue: 320 },
  { date: "2024-04-09", orders: 59, revenue: 110 },
  { date: "2024-04-10", orders: 261, revenue: 190 },
  { date: "2024-04-11", orders: 327, revenue: 350 },
  { date: "2024-04-12", orders: 292, revenue: 210 },
  { date: "2024-04-13", orders: 342, revenue: 380 },
  { date: "2024-04-14", orders: 137, revenue: 220 },
  { date: "2024-04-15", orders: 120, revenue: 170 },
  { date: "2024-04-16", orders: 138, revenue: 190 },
  { date: "2024-04-17", orders: 446, revenue: 360 },
  { date: "2024-04-18", orders: 364, revenue: 410 },
  { date: "2024-04-19", orders: 243, revenue: 180 },
  { date: "2024-04-20", orders: 89, revenue: 150 },
  { date: "2024-04-21", orders: 137, revenue: 200 },
  { date: "2024-04-22", orders: 224, revenue: 170 },
  { date: "2024-04-23", orders: 138, revenue: 230 },
  { date: "2024-04-24", orders: 387, revenue: 290 },
  { date: "2024-04-25", orders: 215, revenue: 250 },
  { date: "2024-04-26", orders: 75, revenue: 130 },
  { date: "2024-04-27", orders: 383, revenue: 420 },
  { date: "2024-04-28", orders: 122, revenue: 180 },
  { date: "2024-04-29", orders: 315, revenue: 240 },
  { date: "2024-04-30", orders: 454, revenue: 380 },
  { date: "2024-05-01", orders: 165, revenue: 220 },
  { date: "2024-05-02", orders: 293, revenue: 310 },
  { date: "2024-05-03", orders: 247, revenue: 190 },
  { date: "2024-05-04", orders: 385, revenue: 420 },
  { date: "2024-05-05", orders: 481, revenue: 390 },
  { date: "2024-05-06", orders: 498, revenue: 520 },
  { date: "2024-05-07", orders: 388, revenue: 300 },
  { date: "2024-05-08", orders: 149, revenue: 210 },
  { date: "2024-05-09", orders: 227, revenue: 180 },
  { date: "2024-05-10", orders: 293, revenue: 330 },
  { date: "2024-05-11", orders: 335, revenue: 270 },
  { date: "2024-05-12", orders: 197, revenue: 240 },
  { date: "2024-05-13", orders: 197, revenue: 160 },
  { date: "2024-05-14", orders: 448, revenue: 490 },
  { date: "2024-05-15", orders: 473, revenue: 380 },
  { date: "2024-05-16", orders: 338, revenue: 400 },
  { date: "2024-05-17", orders: 499, revenue: 420 },
  { date: "2024-05-18", orders: 315, revenue: 350 },
  { date: "2024-05-19", orders: 235, revenue: 180 },
  { date: "2024-05-20", orders: 177, revenue: 230 },
  { date: "2024-05-21", orders: 82, revenue: 140 },
  { date: "2024-05-22", orders: 81, revenue: 120 },
  { date: "2024-05-23", orders: 252, revenue: 290 },
  { date: "2024-05-24", orders: 294, revenue: 220 },
  { date: "2024-05-25", orders: 201, revenue: 250 },
  { date: "2024-05-26", orders: 213, revenue: 170 },
  { date: "2024-05-27", orders: 420, revenue: 460 },
  { date: "2024-05-28", orders: 233, revenue: 190 },
  { date: "2024-05-29", orders: 78, revenue: 130 },
  { date: "2024-05-30", orders: 340, revenue: 280 },
  { date: "2024-05-31", orders: 178, revenue: 230 },
  { date: "2024-06-01", orders: 178, revenue: 200 },
  { date: "2024-06-02", orders: 470, revenue: 410 },
  { date: "2024-06-03", orders: 103, revenue: 160 },
  { date: "2024-06-04", orders: 439, revenue: 380 },
  { date: "2024-06-05", orders: 88, revenue: 140 },
  { date: "2024-06-06", orders: 294, revenue: 250 },
  { date: "2024-06-07", orders: 323, revenue: 370 },
  { date: "2024-06-08", orders: 385, revenue: 320 },
  { date: "2024-06-09", orders: 438, revenue: 480 },
  { date: "2024-06-10", orders: 155, revenue: 200 },
  { date: "2024-06-11", orders: 92, revenue: 150 },
  { date: "2024-06-12", orders: 492, revenue: 420 },
  { date: "2024-06-13", orders: 81, revenue: 130 },
  { date: "2024-06-14", orders: 426, revenue: 380 },
  { date: "2024-06-15", orders: 307, revenue: 350 },
  { date: "2024-06-16", orders: 371, revenue: 310 },
  { date: "2024-06-17", orders: 475, revenue: 520 },
  { date: "2024-06-18", orders: 107, revenue: 170 },
  { date: "2024-06-19", orders: 341, revenue: 290 },
  { date: "2024-06-20", orders: 408, revenue: 450 },
  { date: "2024-06-21", orders: 169, revenue: 210 },
  { date: "2024-06-22", orders: 317, revenue: 270 },
  { date: "2024-06-23", orders: 480, revenue: 530 },
  { date: "2024-06-24", orders: 132, revenue: 180 },
  { date: "2024-06-25", orders: 141, revenue: 190 },
  { date: "2024-06-26", orders: 434, revenue: 380 },
  { date: "2024-06-27", orders: 448, revenue: 490 },
  { date: "2024-06-28", orders: 149, revenue: 200 },
  { date: "2024-06-29", orders: 103, revenue: 160 },
  { date: "2024-06-30", orders: 446, revenue: 400 },
];

export function OrdersAndRevenuesChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("orders");

  const chartConfig = {
    views: {
      label: activeChart,
    },
    orders: {
      label: "Orders",
      color: "var(--color-5)",
    },
    revenue: {
      label: "Revenue",
      color: "#fd8c099e",
    },
  } satisfies ChartConfig;

  const total = React.useMemo(
    () => ({
      orders: chartData.reduce((acc, curr) => acc + curr.orders, 0),
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            {activeChart.slice(0, 1).toLocaleUpperCase() +
              activeChart.slice(1, activeChart.length)}{" "}
            Chart{" "}
          </CardTitle>
          <CardDescription>
            Showing total {activeChart} for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["orders", "revenue"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
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
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default OrdersAndRevenuesChart;
