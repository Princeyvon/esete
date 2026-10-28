"use client";

import { useMemo, useState } from "react";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { AgroProduct } from "@/data/products";
import { useAgroProducts } from "@/data/products-store";

import { ProductListTable } from "./product-list-table";
import { computeDashboardMetrics } from "./products-data";
import { StatCards } from "./stat-cards";
import { StockOverviewChart } from "./stock-overview-chart";
import { StockStatusBreakdown } from "./stock-status-breakdown";

export function EseteDashboardView() {
  // SINGLE DATA SOURCE FOR EVERY NUMBER ON THIS PAGE
  const { products, addProduct, updateProduct, deleteProduct, toggleActive } = useAgroProducts();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute metrics dynamically from the single products array
  const metrics = useMemo(() => computeDashboardMetrics(products), [products]);

  const handleToggleActive = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    toggleActive(productId);
    if (product) {
      toast.success(`"${product.name}" is now ${!product.active ? "Active" : "Hidden"}`);
    }
  };

  const handleAddProduct = (newProduct: Omit<AgroProduct, "id">) => {
    const product = addProduct(newProduct);
    toast.success(`Added "${product.name}" to inventory.`);
  };

  const handleUpdateProduct = (updatedProduct: AgroProduct) => {
    updateProduct(updatedProduct);
    toast.success(`Updated "${updatedProduct.name}" successfully.`);
  };

  const handleDeleteProduct = (product: AgroProduct) => {
    deleteProduct(product.id);
    toast.success(`Deleted "${product.name}" from inventory.`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.info("Inventory data synced with Merkato warehouse.");
    }, 400);
  };

  const handleExport = () => {
    toast.success("Inventory summary exported to Excel / PDF.");
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {/* Vizora-Style Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-foreground">Dashboard</h1>
            <span className="rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              Merkato Shop Live
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <span>Welcome back, Esete Agro • Agricultural Inputs & Crop Protection in ETB</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-3 py-1.5 text-xs shadow-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-foreground">In Stock: {metrics.inStockProducts}</span>
          </div>
          <Button
            onClick={handleExport}
            size="sm"
            className="h-9 gap-1.5 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-medium text-xs px-3.5 shadow-xs"
          >
            <Download className="size-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <StatCards
        totalProducts={metrics.totalProducts}
        publishedProducts={metrics.publishedProducts}
        draftProducts={metrics.draftProducts}
        outOfStockProducts={metrics.outOfStockProducts}
      />

      {/* Middle Grid: Main Chart (Stock Overview) + Right Rail (Stock Status & Low Stock Attention) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left 7/12: Main Chart */}
        <div className="lg:col-span-7 xl:col-span-8">
          <StockOverviewChart data={metrics.categoryStockData} totalAvailableUnits={metrics.totalAvailableUnits} />
        </div>

        {/* Right 5/12: Right Rail Breakdown & Low Stock */}
        <div className="lg:col-span-5 xl:col-span-4">
          <StockStatusBreakdown
            totalProducts={metrics.totalProducts}
            inStockCount={metrics.inStockProducts}
            lowStockCount={metrics.lowStockProducts}
            outOfStockCount={metrics.outOfStockProducts}
            draftCount={metrics.draftProducts}
            lowStockAttention={metrics.lowStockAttention}
          />
        </div>
      </div>

      {/* Bottom Card: Product List Table */}
      <ProductListTable
        products={products}
        onToggleActive={handleToggleActive}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}
