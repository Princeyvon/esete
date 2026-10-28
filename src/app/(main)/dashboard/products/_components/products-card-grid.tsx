"use client";

import { useState } from "react";

import Image from "next/image";

import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Copy,
  Edit2,
  Eye,
  FileEdit,
  Images,
  Package,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/data/currency-store";
import type { AgroProduct } from "@/data/products";

interface ProductsCardGridProps {
  products: AgroProduct[];
  onViewClick?: (product: AgroProduct) => void;
  onEditClick: (product: AgroProduct) => void;
  onDeleteClick: (product: AgroProduct) => void;
  onToggleActive: (productId: string) => void;
  onRestockClick?: (product: AgroProduct) => void;
  onDuplicateClick?: (product: AgroProduct) => void;
}

export function ProductsCardGrid({
  products,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onToggleActive,
  onRestockClick,
  onDuplicateClick,
}: ProductsCardGridProps) {
  const { formatPrice } = useCurrency();
  const [activeImageIndex, setActiveImageIndex] = useState<{ [productId: string]: number }>({});

  const handleNextImage = (productId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % max,
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        // Collect product images (up to 6)
        const productImages: string[] = [];
        if (Array.isArray(product.images) && product.images.length > 0) {
          productImages.push(...product.images);
        } else if (product.imageUrl) {
          productImages.push(product.imageUrl);
        }

        const currentIndex = activeImageIndex[product.id] || 0;
        const currentImage = productImages[currentIndex] || "";
        const hasMultipleImages = productImages.length > 1;

        // Stock status badge formatting
        const isOutOfStock = product.stockStatus === "out_of_stock" || product.stock === 0;
        const isLowStock = product.stockStatus === "low_stock";

        return (
          <Card
            key={product.id}
            className={`flex flex-col justify-between overflow-hidden rounded-2xl border transition-all hover:shadow-md ${
              product.active ? "border-border/60 bg-card" : "border-border/40 bg-muted/20 opacity-80"
            }`}
          >
            <div>
              {/* Product Image & Top Badges */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted/30">
                <button
                  type="button"
                  onClick={() => onViewClick?.(product)}
                  className="absolute inset-0 z-0 h-full w-full cursor-pointer border-0 bg-transparent text-left"
                  aria-label={`View details for ${product.name}`}
                />
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105 pointer-events-none"
                    referrerPolicy="no-referrer"
                    unoptimized={currentImage.startsWith("data:")}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-muted/40 p-4 text-center">
                    <Package className="size-10 text-muted-foreground/40 mb-1" />
                    <span className="text-[11px] text-muted-foreground">No image added</span>
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
                  <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      <Star className="size-2.5 fill-white text-white" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Stock Level Tag (Top Right) */}
                <div className="absolute top-2.5 right-2.5">
                  {isOutOfStock ? (
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Low: {product.stock} {product.unit}
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#0B8A5A] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {product.stock} {product.unit}
                    </span>
                  )}
                </div>

                {/* Multiple Images Indicator & Gallery Cycler */}
                {hasMultipleImages && (
                  <button
                    type="button"
                    onClick={(e) => handleNextImage(product.id, productImages.length, e)}
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white cursor-pointer hover:bg-black/80 transition-colors shadow-xs z-10"
                    title="Click to cycle next photo"
                  >
                    <Images className="size-3" />
                    <span>
                      {currentIndex + 1}/{productImages.length}
                    </span>
                  </button>
                )}
              </div>

              {/* Card Body */}
              <CardHeader className="p-3.5 pb-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-mono text-[11px] font-semibold text-foreground/80">{product.sku}</span>
                  <span className="truncate max-w-[120px]">{product.brand || "Esete Agro"}</span>
                </div>

                <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                  <button
                    type="button"
                    onClick={() => onViewClick?.(product)}
                    className="cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-left font-bold"
                  >
                    {product.name}
                  </button>
                </h3>

                {product.activeIngredient && (
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 italic">
                    {product.activeIngredient}
                  </p>
                )}
              </CardHeader>

              <CardContent className="p-3.5 pt-0 space-y-2.5">
                {/* Package Size & Catalog Status */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                  <span className="text-muted-foreground text-[11px]">{product.packageSize}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold capitalize ${
                      product.status === "published"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : product.status === "draft"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {product.status === "published" && <CheckCircle2 className="size-3" />}
                    {product.status === "draft" && <FileEdit className="size-3" />}
                    {product.status === "archived" && <Archive className="size-3" />}
                    {product.status}
                  </span>
                </div>

                {/* Price & Restock Row */}
                <div className="rounded-xl bg-[#EAF4ED]/60 dark:bg-emerald-950/30 p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Price</span>
                    <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 block">
                      {formatPrice(product.price, product.showPrice)}
                    </span>
                  </div>
                  {onRestockClick && (
                    <button
                      type="button"
                      onClick={() => onRestockClick(product)}
                      className="inline-flex items-center gap-1 rounded-lg bg-background border border-border/60 hover:border-emerald-500/60 px-2 py-1 text-[11px] font-semibold text-foreground hover:text-emerald-800 dark:hover:text-emerald-300 shadow-2xs cursor-pointer transition-colors"
                      title="Quick restock warehouse balance"
                    >
                      <TrendingUp className="size-3 text-emerald-600" />
                      <span>Restock</span>
                    </button>
                  )}
                </div>
              </CardContent>
            </div>

            {/* Card Footer: Active toggle and action buttons */}
            <CardFooter className="p-3 pt-2 flex items-center justify-between border-t border-border/50 bg-muted/10">
              <div className="flex items-center gap-2">
                <Switch
                  checked={product.active}
                  onCheckedChange={() => onToggleActive(product.id)}
                  aria-label={`Toggle active for ${product.name}`}
                  className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                />
                <span
                  className={`text-[11px] font-semibold ${
                    product.active ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                  }`}
                >
                  {product.active ? "Active" : "Hidden"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {onViewClick && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onViewClick(product)}
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border-border/60 cursor-pointer"
                    title="View Product Specs"
                  >
                    <Eye className="size-3.5" />
                  </Button>
                )}
                {onDuplicateClick && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onDuplicateClick(product)}
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border-border/60 cursor-pointer"
                    title="Duplicate SKU"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onEditClick(product)}
                  className="size-7 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-600/30 cursor-pointer"
                  title="Edit Product"
                >
                  <Edit2 className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onDeleteClick(product)}
                  className="size-7 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
