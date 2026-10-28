import Link from "next/link";

import { AlertTriangle, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { AgroProduct } from "./products-data";

interface StockStatusBreakdownProps {
  totalProducts: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  draftCount: number;
  lowStockAttention: AgroProduct[];
}

export function StockStatusBreakdown({
  totalProducts,
  inStockCount,
  lowStockCount,
  outOfStockCount,
  draftCount,
  lowStockAttention,
}: StockStatusBreakdownProps) {
  const inStockPct = ((inStockCount / totalProducts) * 100).toFixed(1);
  const lowStockPct = ((lowStockCount / totalProducts) * 100).toFixed(1);
  const outOfStockPct = ((outOfStockCount / totalProducts) * 100).toFixed(1);
  const draftPct = ((draftCount / totalProducts) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-4">
      {/* Stock Status Breakdown Card */}
      <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-3">
        <CardHeader className="pb-3 px-3 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-foreground">Stock Status</CardTitle>
            <span className="rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              {totalProducts} Total Items
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Inventory availability & catalog readiness breakdown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-3 pb-3">
          {/* Segment Progress Bar */}
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/60 p-0.5 border border-border/40">
            <div
              style={{ width: `${inStockPct}%` }}
              className="bg-emerald-500 rounded-l-full transition-all"
              title={`In Stock: ${inStockCount} (${inStockPct}%)`}
            />
            <div
              style={{ width: `${lowStockPct}%` }}
              className="bg-amber-500 transition-all"
              title={`Low Stock: ${lowStockCount} (${lowStockPct}%)`}
            />
            <div
              style={{ width: `${outOfStockPct}%` }}
              className="bg-rose-500 transition-all"
              title={`Out of Stock: ${outOfStockCount} (${outOfStockPct}%)`}
            />
            <div
              style={{ width: `${draftPct}%` }}
              className="bg-slate-400 dark:bg-slate-600 rounded-r-full transition-all"
              title={`Draft: ${draftCount} (${draftPct}%)`}
            />
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-2 pt-1 text-xs">
            {/* In Stock */}
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-[#E8F6ED]/40 dark:bg-emerald-950/20 p-2.5 transition-colors">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-foreground">In Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{inStockCount}</span>
                <span className="w-12 text-right text-muted-foreground">{inStockPct}%</span>
              </div>
            </div>

            {/* Low Stock */}
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-amber-50/40 dark:bg-amber-950/20 p-2.5 transition-colors">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-foreground">Low Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-600 dark:text-amber-400">{lowStockCount}</span>
                <span className="w-12 text-right text-muted-foreground">{lowStockPct}%</span>
              </div>
            </div>

            {/* Out of Stock */}
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-rose-50/40 dark:bg-rose-950/20 p-2.5 transition-colors">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-rose-500" />
                <span className="font-semibold text-foreground">Out of Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-600 dark:text-rose-400">{outOfStockCount}</span>
                <span className="w-12 text-right text-muted-foreground">{outOfStockPct}%</span>
              </div>
            </div>

            {/* Draft */}
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 p-2.5 transition-colors">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                <span className="font-semibold text-foreground">Draft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-muted-foreground">{draftCount}</span>
                <span className="w-12 text-right text-muted-foreground">{draftPct}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Attention List */}
      <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 border-l-4 border-l-amber-500 shadow-xs p-2 sm:p-3">
        <CardHeader className="pb-3 px-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-base font-bold text-foreground">Low Stock Attention</CardTitle>
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              {lowStockAttention.length} Items
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Units below threshold — action recommended
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pb-3">
          {lowStockAttention.map((product) => (
            <div
              key={product.id}
              className="flex items-start justify-between rounded-xl border border-amber-500/20 bg-amber-50/40 p-2.5 dark:bg-amber-950/20 text-xs"
            >
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-foreground truncate">{product.name}</p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="font-mono">{product.sku}</span>
                  <span>•</span>
                  <span>{product.category}</span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-amber-700 dark:text-amber-400 text-xs">
                  {product.stock} {product.unit} left
                </span>
                <span className="text-[10px] text-muted-foreground">Min: {product.minThreshold}</span>
              </div>
            </div>
          ))}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full mt-2 justify-center gap-1.5 text-xs rounded-xl border-dashed border-border/60 hover:bg-[#E8F6ED] hover:text-[#0B8A5A]"
          >
            <Link href="/dashboard/products">
              <span>View All Inventory</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
