"use client";

import { useId } from "react";

import { PackageCheck } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryStockPoint {
  category: string;
  availableUnits: number;
  skus: number;
}

interface StockOverviewChartProps {
  data: CategoryStockPoint[];
  totalAvailableUnits: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: CategoryStockPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;
    return (
      <div className="rounded-xl border border-border/70 bg-card p-3 shadow-lg">
        <p className="font-semibold text-xs text-foreground uppercase tracking-wider">{item.category}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground text-xs">Available Units:</span>
          <span className="font-bold text-xs text-foreground">{item.availableUnits.toLocaleString()}</span>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">{item.skus} registered agro products</div>
      </div>
    );
  }
  return null;
}

export function StockOverviewChart({ data, totalAvailableUnits }: StockOverviewChartProps) {
  const chartId = useId();
  const gradientId = `stock-gradient-${chartId.replace(/:/g, "")}`;

  return (
    <Card className="flex flex-col rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-3">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2 px-3 pt-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">Stock Overview</CardTitle>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/50 dark:text-emerald-300">
              Live Stock
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Available stock units across all 6 core agro-input categories
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/50 bg-[#E8F6ED]/70 dark:bg-emerald-950/30 px-3.5 py-1.5 text-xs">
          <PackageCheck className="size-3.5 text-[#0B8A5A] dark:text-emerald-400" />
          <span className="text-muted-foreground">Total In-Stock:</span>
          <span className="font-bold text-[#0B3B2C] dark:text-emerald-300">
            {totalAvailableUnits.toLocaleString()} units
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-2 px-3">
        <div className="h-[270px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#10b981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-[11px] font-medium fill-muted-foreground"
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px] fill-muted-foreground"
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="availableUnits"
                name="Available Units"
                stroke="#10b981"
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pills Breakdown */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/40 pt-3 sm:grid-cols-3 lg:grid-cols-6">
          {data.map((item) => (
            <div
              key={item.category}
              className="flex flex-col rounded-xl border border-border/40 bg-[#E8F6ED]/40 dark:bg-emerald-950/20 px-2.5 py-2"
            >
              <span className="truncate text-[11px] font-medium text-muted-foreground">{item.category}</span>
              <div className="mt-0.5 flex items-baseline justify-between">
                <span className="font-bold text-xs text-foreground">
                  {item.availableUnits} <span className="font-normal text-[10px] text-muted-foreground">units</span>
                </span>
                <span className="text-[10px] text-muted-foreground">{item.skus} SKUs</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
