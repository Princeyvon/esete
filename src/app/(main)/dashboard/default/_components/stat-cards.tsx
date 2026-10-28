import { AlertTriangle, ArrowUpRight, Boxes, CheckCircle2, ChevronRight, FileEdit } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardsProps {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  outOfStockProducts: number;
}

export function StatCards({ totalProducts, publishedProducts, draftProducts, outOfStockProducts }: StatCardsProps) {
  const publishedPct = Math.round((publishedProducts / totalProducts) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Total Products */}
      <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs hover:shadow-md transition-all p-5">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Total Products</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              <Boxes className="size-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold tracking-tight text-foreground">{totalProducts}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6ED] px-2 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/50 dark:text-emerald-300">
              <ArrowUpRight className="size-3" />6 Cats
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
            <span>Merkato Central Branch</span>
            <ChevronRight className="size-4 text-muted-foreground/60" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Published Products */}
      <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs hover:shadow-md transition-all p-5">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">
              Published Products
            </span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="size-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold tracking-tight text-foreground">{publishedProducts}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6ED] px-2 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/50 dark:text-emerald-300">
              <ArrowUpRight className="size-3" />
              {publishedPct}%
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
            <span>Active on store catalog</span>
            <ChevronRight className="size-4 text-muted-foreground/60" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Draft Products */}
      <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs hover:shadow-md transition-all p-5">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Draft Products</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <FileEdit className="size-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold tracking-tight text-foreground">{draftProducts}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              Review
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
            <span>Pending specs & pricing</span>
            <ChevronRight className="size-4 text-muted-foreground/60" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Out of Stock */}
      <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs hover:shadow-md transition-all p-5">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Out of Stock</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertTriangle className="size-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {outOfStockProducts}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              Zero Units
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
            <span>Supplier reorder required</span>
            <ChevronRight className="size-4 text-muted-foreground/60" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
