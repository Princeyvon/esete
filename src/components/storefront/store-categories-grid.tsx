"use client";

import Image from "next/image";

import { ArrowRight, Leaf } from "lucide-react";

import { STORE_CATEGORIES } from "@/data/storefront-data";

interface StoreCategoriesGridProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
}

export function StoreCategoriesGrid({ onSelectCategory, selectedCategory = "All" }: StoreCategoriesGridProps) {
  return (
    <section id="categories-section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Clean Minimal Title */}
      <div className="flex flex-col items-center text-center mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143422]">Product Categories</h2>
        <p className="text-xs text-stone-500 mt-1">Select a category to filter the catalog below</p>
      </div>

      {/* 6 Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {STORE_CATEGORIES.map((category) => {
          const isSelected = selectedCategory.toLowerCase() === category.name.toLowerCase();

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={`group flex flex-col items-center rounded-2xl p-4 text-center transition-all cursor-pointer border ${
                isSelected
                  ? "bg-white border-emerald-700 shadow-md ring-2 ring-emerald-600/20"
                  : "bg-[#F9F7F2] hover:bg-white border-stone-200/90 hover:border-emerald-600/40 hover:shadow-md"
              }`}
            >
              {/* Product Thumbnail Container */}
              <div className="relative size-24 sm:size-28 rounded-xl overflow-hidden bg-white mb-3 shadow-2xs border border-stone-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title */}
              <h3 className="font-serif text-sm font-bold text-[#143422] group-hover:text-emerald-800 transition-colors">
                {category.name}
              </h3>

              {/* Subtitle from poster */}
              <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{category.subtitle}</p>

              {/* Action */}
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 group-hover:text-emerald-800 transition-colors mt-2">
                <span>View Products</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
