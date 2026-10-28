"use client";

import { useState } from "react";

import Image from "next/image";

import {
  AlertTriangle,
  Check,
  ExternalLink,
  Leaf,
  MessageSquare,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/data/cart-store";
import { useCurrency } from "@/data/currency-store";
import type { AgroProduct } from "@/data/products";
import { getProductWhatsAppUrl } from "@/data/storefront-data";
import { getProductAllImages, getProductDisplayImage } from "@/lib/product-image-helper";

interface StoreQuickViewDialogProps {
  product: AgroProduct | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoreQuickViewDialog({ product, isOpen, onOpenChange }: StoreQuickViewDialogProps) {
  const { addToCart } = useCart();
  const { currency, formatPrice, convertToRwf } = useCurrency();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const images = getProductAllImages(product);
  const activeImage = images[selectedImageIndex] || getProductDisplayImage(product);

  const isOutOfStock = product.stockStatus === "out_of_stock" || product.stock === 0;
  const isLowStock = product.stockStatus === "low_stock";

  const rwfPrice = product.price ? (convertToRwf(product.price * quantity) ?? 0) : null;
  const secondaryFormatted =
    product.showPrice && product.price && rwfPrice
      ? currency === "ETB"
        ? `~${rwfPrice.toLocaleString("en-US")} RWF`
        : `~${(product.price * quantity).toLocaleString("en-US")} ETB`
      : null;

  const handleAddToEnquiry = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price ?? 0,
        imageUrl: getProductDisplayImage(product),
        packageSize: product.packageSize,
        category: product.category,
        unit: product.unit,
      },
      quantity,
    );
    toast.success(`Added ${quantity} × ${product.name} to enquiry list.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl bg-white border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="bg-[#FAF8F5] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/80">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-white border border-stone-200/60 shadow-xs flex items-center justify-center">
              <Image src={activeImage} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
              <span
                className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white ${
                  isOutOfStock ? "bg-rose-700" : isLowStock ? "bg-amber-600" : "bg-[#143422]"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
              </span>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative size-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-emerald-700 shadow-xs"
                        : "border-stone-200 hover:border-stone-400 opacity-70"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumb ${idx + 1}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-700" />
                100% Original Sealed
              </span>
              <span className="font-mono text-stone-600">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Right Column: Product Details & WhatsApp Enquiry */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  {product.category}
                </span>
                <span className="text-xs font-semibold text-stone-600">{product.brand}</span>
              </div>

              {/* Title */}
              <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-[#143422] mt-1 leading-snug">
                {product.name}
              </DialogTitle>

              {/* Active Ingredient */}
              {product.activeIngredient && (
                <div className="mt-1 text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-800">Active Constituent:</span> {product.activeIngredient}
                </div>
              )}

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                {product.showPrice && product.price !== null ? (
                  <>
                    <span className="text-2xl font-bold text-[#143422]">{formatPrice(product.price * quantity)}</span>
                    {secondaryFormatted && <span className="text-xs text-stone-500">{secondaryFormatted}</span>}
                  </>
                ) : (
                  <span className="text-sm font-semibold text-emerald-800 italic">
                    Contact us for current market price
                  </span>
                )}
              </div>

              {/* Package size & stock */}
              <div className="mt-2 flex items-center justify-between text-xs text-stone-600">
                <span>
                  Package: <strong className="text-stone-800">{product.packageSize}</strong>
                </span>
                <span>
                  Stock:{" "}
                  <strong className="text-stone-800">
                    {product.stock} {product.unit}
                  </strong>
                </span>
              </div>

              {/* Description */}
              <DialogDescription className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                {product.fullDescription || product.description || product.shortDescription}
              </DialogDescription>

              {/* Safety notice for regulated chemicals */}
              <div className="mt-3 p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-start gap-1.5 text-[11px] text-amber-900">
                <AlertTriangle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Follow product label application rates and wear required PPE.</span>
              </div>
            </div>

            {/* Stepper, WhatsApp Action & Add to Enquiry */}
            <div className="pt-4 border-t border-stone-200 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="size-7 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="size-7 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <a
                  href={getProductWhatsAppUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="size-4" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddToEnquiry}
                className="w-full rounded-full border-stone-300 text-stone-700 hover:border-emerald-700 hover:bg-emerald-50 text-xs font-semibold"
              >
                <Plus className="size-3.5 mr-1" />
                Add {quantity} to Enquiry List
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
