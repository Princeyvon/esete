"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import {
  AlertCircle,
  Archive,
  Boxes,
  Building2,
  Camera,
  CheckCircle2,
  Coins,
  Copy,
  Edit2,
  FileEdit,
  Images,
  Package,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrency } from "@/data/currency-store";
import type { AgroProduct } from "@/data/products";

interface ProductDetailsDialogProps {
  product: AgroProduct | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick: (product: AgroProduct) => void;
  onToggleActive: (productId: string) => void;
  onRestockClick?: (product: AgroProduct) => void;
  onDuplicateClick?: (product: AgroProduct) => void;
  onDeleteClick?: (product: AgroProduct) => void;
}

export function ProductDetailsDialog({
  product,
  isOpen,
  onOpenChange,
  onEditClick,
  onToggleActive,
  onRestockClick,
  onDuplicateClick,
  onDeleteClick,
}: ProductDetailsDialogProps) {
  const { currency, rate, formatPrice } = useCurrency();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const productId = product?.id;

  useEffect(() => {
    if (productId) {
      setSelectedImageIndex(0);
    }
  }, [productId]);

  if (!product) return null;

  // Gather all photos (up to 6)
  const productImages: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    productImages.push(...product.images);
  } else if (product.imageUrl) {
    productImages.push(product.imageUrl);
  }

  const activeImage = productImages[selectedImageIndex] || productImages[0];

  const isOutOfStock = product.stockStatus === "out_of_stock" || product.stock === 0;
  const isLowStock = product.stockStatus === "low_stock";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl md:rounded-3xl p-5 md:p-6">
        <DialogHeader className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground">
              {product.sku}
            </span>
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            {product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                <Star className="size-2.5 fill-white text-white" />
                Featured Item
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                product.status === "published"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : product.status === "draft"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              {product.status === "published" && <CheckCircle2 className="size-2.5" />}
              {product.status === "draft" && <FileEdit className="size-2.5" />}
              {product.status === "archived" && <Archive className="size-2.5" />}
              {product.status}
            </span>
          </div>

          <DialogTitle className="text-xl font-bold text-foreground leading-snug pt-1">{product.name}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {product.brand || "Esete Agro"} • {product.packageSize}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Image Gallery Section */}
          <div className="space-y-2">
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-muted/30 border border-border/50">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized={activeImage.startsWith("data:")}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <Package className="size-12 text-muted-foreground/40 mb-2" />
                  <span className="text-xs text-muted-foreground">No image available for this SKU</span>
                </div>
              )}

              {/* In Stock Badge Overlay */}
              <div className="absolute top-3 right-3">
                {isOutOfStock ? (
                  <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-xs">
                    Low Stock: {product.stock} {product.unit}
                  </span>
                ) : (
                  <span className="rounded-full bg-[#0B8A5A] px-3 py-1 text-xs font-bold text-white shadow-xs">
                    {product.stock} {product.unit} In Stock
                  </span>
                )}
              </div>

              {/* Quick Add / Edit Photos Action Button */}
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onEditClick(product);
                }}
                className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl bg-background/90 hover:bg-background backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-foreground border border-border/60 shadow-xs cursor-pointer transition-all hover:scale-105"
              >
                <Camera className="size-3.5 text-emerald-600" />
                <span>{productImages.length > 0 ? "Edit / Add Photos" : "Add Photos"}</span>
              </button>
            </div>

            {/* Thumbnails list if multiple */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative size-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-emerald-600 ring-2 ring-emerald-500/30"
                        : "border-border/60 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      unoptimized={img.startsWith("data:")}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Price Card */}
            <div className="rounded-2xl bg-[#EAF4ED]/70 dark:bg-emerald-950/30 border border-emerald-500/20 p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Catalog Price ({currency})
                </span>
                <span className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-1 block">
                  {formatPrice(product.price, product.showPrice)}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-emerald-600/10">
                {currency === "RWF" ? `Converted at 1 ETB = ${rate} RWF` : "Standard base currency (ETB)"}
              </p>
            </div>

            {/* Inventory Card */}
            <div className="rounded-2xl bg-muted/30 border border-border/50 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Inventory Balance
                  </span>
                  <span className="text-xl font-bold text-foreground mt-1 block">
                    {product.stock} {product.unit}
                  </span>
                </div>
                {onRestockClick && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      onRestockClick(product);
                    }}
                    className="h-8 rounded-xl text-xs font-semibold gap-1.5 border-emerald-600/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer"
                  >
                    <TrendingUp className="size-3" />
                    <span>Restock</span>
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/40">
                <span>
                  Alert Threshold: {product.minThreshold || 10} {product.unit}
                </span>
                <span className={product.active ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
                  {product.active ? "Active in Store" : "Store Hidden"}
                </span>
              </div>
            </div>
          </div>

          {/* Product Specifications Table */}
          <div className="rounded-2xl bg-muted/20 border border-border/50 p-3.5 space-y-2.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Formulation & Packaging</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px] block">Active Ingredient</span>
                <span className="font-semibold text-foreground">{product.activeIngredient || "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Manufacturer / Brand</span>
                <span className="font-semibold text-foreground">{product.brand || "Esete Agro"}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Packaging Spec</span>
                <span className="font-semibold text-foreground">{product.packageSize}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Inventory Unit</span>
                <span className="font-semibold text-foreground">{product.unit}</span>
              </div>
            </div>
          </div>

          {/* Description & Usage */}
          {(product.shortDescription || product.fullDescription || product.description) && (
            <div className="rounded-2xl bg-muted/20 border border-border/50 p-3.5 space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Application & Usage Guidelines
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {product.fullDescription || product.shortDescription || product.description}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2 border-t border-border/40 flex-col sm:flex-row justify-between items-stretch sm:items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onToggleActive(product.id)}
              className={`h-9 rounded-xl text-xs gap-1.5 font-semibold cursor-pointer ${
                product.active
                  ? "border-emerald-600/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{product.active ? "Active in Store" : "Hidden"}</span>
            </Button>

            {onDuplicateClick && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onDuplicateClick(product);
                }}
                className="h-9 rounded-xl text-xs gap-1.5 border-border/60 hover:bg-muted cursor-pointer"
                title="Duplicate SKU"
              >
                <Copy className="size-3.5" />
                <span>Clone</span>
              </Button>
            )}

            {onDeleteClick && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onDeleteClick(product);
                }}
                className="h-9 rounded-xl text-xs gap-1.5 border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                title="Delete SKU"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 rounded-xl text-xs cursor-pointer"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEditClick(product);
              }}
              className="h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white text-xs font-semibold px-4 gap-1.5 shadow-xs cursor-pointer"
            >
              <Edit2 className="size-3.5" />
              <span>Edit Product & Photos</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
