"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import { Check, Eye, Filter, Leaf, MessageSquare, Package, Plus, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/data/cart-store";
import { useCurrency } from "@/data/currency-store";
import type { AgroProduct } from "@/data/products";
import { getProductWhatsAppUrl, STORE_CATEGORIES } from "@/data/storefront-data";
import { getProductDisplayImage } from "@/lib/product-image-helper";

interface StoreCatalogSectionProps {
  products: AgroProduct[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onQuickView: (product: AgroProduct) => void;
}

export function StoreCatalogSection({
  products,
  selectedCategory,
  onSelectCategory,
  onQuickView,
}: StoreCatalogSectionProps) {
  const { addToCart } = useCart();
  const { currency, formatPrice, convertToRwf } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories = ["All", ...STORE_CATEGORIES.map((c) => c.name)];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be published and active
      if (!product.active || product.status !== "published") return false;

      // Category filter
      if (selectedCategory !== "All" && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Stock filter
      if (onlyInStock && (product.stockStatus === "out_of_stock" || product.stock === 0)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesBrand = product.brand?.toLowerCase().includes(q);
        const matchesActive = product.activeIngredient?.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBrand && !matchesActive && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, onlyInStock, searchQuery]);

  const handleAddToEnquiry = (product: AgroProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      imageUrl: getProductDisplayImage(product),
      packageSize: product.packageSize,
      category: product.category,
      unit: product.unit,
    });
    toast.success(`Added ${product.name} to enquiry list.`);
  };

  return (
    <section id="catalog-section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143422]">
            Products ({filteredProducts.length})
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Prices in ETB · Pickup in Merkato Gojam bernda murtem or WhatsApp delivery
          </p>
        </div>

        {/* Search & Stock Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-stone-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search herbicide, seeds..."
              className="pl-9 h-9 text-xs rounded-xl bg-white border-stone-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`h-9 px-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              onlyInStock
                ? "bg-emerald-50 border-emerald-700 text-emerald-900 font-semibold"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            In-Stock Only
          </button>
        </div>
      </div>

      {/* Category Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200 mb-8 overflow-x-auto">
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#143422] text-white shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white/80"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF8F5] rounded-3xl border border-dashed border-stone-300">
          <Package className="size-10 text-stone-400 mx-auto mb-2" />
          <h4 className="font-serif text-base font-bold text-stone-800">No matching agricultural products found</h4>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Try adjusting your search keywords or reset category filters.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onSelectCategory("All");
              setSearchQuery("");
              setOnlyInStock(false);
            }}
            className="rounded-full text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const imageSrc = getProductDisplayImage(product);
            const isOutOfStock = product.stockStatus === "out_of_stock" || product.stock === 0;
            const isLowStock = product.stockStatus === "low_stock";

            const rwfPrice = product.price ? (convertToRwf(product.price) ?? 0) : null;
            const secondaryFormatted =
              product.showPrice && product.price && rwfPrice
                ? currency === "ETB"
                  ? `~${rwfPrice.toLocaleString("en-US")} RWF`
                  : `~${product.price.toLocaleString("en-US")} ETB`
                : null;

            return (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-4 border border-stone-200/90 hover:border-emerald-700/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Box */}
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#FAF8F5] p-2 flex items-center justify-center mb-3 border border-stone-100">
                    {/* Status Badge */}
                    <span
                      className={`absolute top-2.5 left-2.5 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white ${
                        isOutOfStock ? "bg-rose-700" : isLowStock ? "bg-amber-600" : "bg-[#143422]"
                      }`}
                    >
                      {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                    </span>

                    <button
                      type="button"
                      onClick={() => onQuickView(product)}
                      className="absolute top-2.5 right-2.5 z-10 size-7 rounded-full bg-white/95 backdrop-blur-xs text-stone-700 hover:text-emerald-900 hover:bg-white shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Quick view product specs"
                    >
                      <Eye className="size-3.5" />
                    </button>

                    <div className="relative size-full">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Category & Brand */}
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium mb-1">
                    <span className="font-bold uppercase tracking-wider text-emerald-800">{product.category}</span>
                    <span>{product.brand}</span>
                  </div>

                  {/* Title */}
                  <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    className="font-serif text-sm font-bold text-[#143422] hover:text-emerald-800 transition-colors text-left line-clamp-2 cursor-pointer leading-snug block"
                  >
                    {product.name}
                  </button>

                  {/* Active Ingredient / Short description */}
                  <p className="text-[11px] text-stone-600 mt-1 line-clamp-1">
                    {product.activeIngredient || product.shortDescription}
                  </p>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Package: <span className="font-semibold text-stone-600">{product.packageSize}</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {product.showPrice && product.price !== null ? (
                        <div>
                          <span className="text-sm font-bold text-[#143422]">{formatPrice(product.price)}</span>
                          {secondaryFormatted && (
                            <div className="text-[10px] text-stone-500 font-medium">{secondaryFormatted}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-800 italic">Contact us for price</span>
                      )}
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono">{product.sku}</span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <a
                      href={getProductWhatsAppUrl(product.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 h-8 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                      title="Ask on WhatsApp"
                    >
                      <MessageSquare className="size-3" />
                      <span>WhatsApp</span>
                    </a>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToEnquiry(product)}
                      className="h-8 rounded-full border-stone-300 hover:border-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold text-stone-700 cursor-pointer"
                    >
                      <Plus className="size-3 mr-0.5" />
                      Enquire
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
