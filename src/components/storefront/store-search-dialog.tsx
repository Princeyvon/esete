"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import { ArrowRight, Package, Search, X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/data/currency-store";
import type { AgroProduct } from "@/data/products";
import { getProductDisplayImage } from "@/lib/product-image-helper";

interface StoreSearchDialogProps {
  products: AgroProduct[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProduct: (product: AgroProduct) => void;
}

export function StoreSearchDialog({ products, isOpen, onOpenChange, onSelectProduct }: StoreSearchDialogProps) {
  const [query, setQuery] = useState("");
  const { formatPrice } = useCurrency();

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.active && p.status === "published");
  }, [products]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeProducts.slice(0, 5);

    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.activeIngredient && p.activeIngredient.toLowerCase().includes(q)) ||
        p.shortDescription.toLowerCase().includes(q),
    );
  }, [activeProducts, query]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl bg-white border border-stone-200">
        <DialogHeader className="p-4 bg-[#FAF8F5] border-b border-stone-200">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agricultural chemical, brand, active ingredient..."
              className="pl-10 pr-9 h-11 text-sm bg-white rounded-xl border-stone-300 focus-visible:ring-emerald-700"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
            {query ? `Catalogue Search Results (${results.length})` : "Popular Agricultural Inputs"}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              No agricultural inputs found matching &quot;{query}&quot;. Try searching &quot;2,4-D&quot;,
              &quot;Roundup&quot;, &quot;Urea&quot;, or &quot;Mancozeb&quot;.
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct(product);
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image
                        src={getProductDisplayImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h5 className="font-serif text-xs font-bold text-stone-800 group-hover:text-emerald-900 line-clamp-1">
                        {product.name}
                      </h5>
                      <span className="text-[10px] text-stone-500">
                        {product.category} · {product.packageSize}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-900 block">
                      {product.showPrice && product.price !== null ? formatPrice(product.price) : "Price on Enquiry"}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                      View <ArrowRight className="size-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
