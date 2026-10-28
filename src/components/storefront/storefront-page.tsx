"use client";

import { useState } from "react";

import { useCart } from "@/data/cart-store";
import type { AgroProduct } from "@/data/products";
import { useAgroProducts } from "@/data/products-store";

import { OwnerAccessDialog } from "./owner-access-dialog";
import { StoreCartDrawer } from "./store-cart-drawer";
import { StoreCatalogSection } from "./store-catalog-section";
import { StoreCategoriesGrid } from "./store-categories-grid";
import { StoreCheckoutDialog } from "./store-checkout-dialog";
import { StoreContactDialog } from "./store-contact-dialog";
import { StoreFooter } from "./store-footer";
import { StoreHeader } from "./store-header";
import { StoreHero } from "./store-hero";
import { StoreLocationSection } from "./store-location-section";
import { StoreQuickViewDialog } from "./store-quick-view-dialog";
import { StoreSearchDialog } from "./store-search-dialog";
import { StoreValueStrip } from "./store-value-strip";

export function StorefrontPage() {
  const { products } = useAgroProducts();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dialog States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOwnerAccessOpen, setIsOwnerAccessOpen] = useState(false);

  // Quick View Product
  const [quickViewProduct, setQuickViewProduct] = useState<AgroProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleOpenQuickView = (product: AgroProduct) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleShopNow = () => {
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* 1. Esete Agro Header with Announcement & WhatsApp Quick Link */}
      <StoreHeader
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onSelectCategory={handleCategorySelect}
      />

      <main>
        {/* 1. Clean Minimal Hero Section */}
        <StoreHero onShopNowClick={handleShopNow} onOpenContact={() => setIsContactOpen(true)} />

        {/* 2. Value Proposition Strip */}
        <StoreValueStrip />

        {/* 3. 6 Category Tiles */}
        <StoreCategoriesGrid onSelectCategory={handleCategorySelect} selectedCategory={selectedCategory} />

        {/* 4. Complete Agricultural Catalog */}
        <StoreCatalogSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onQuickView={handleOpenQuickView}
        />

        {/* 5. Minimal Store Location & Contact Section */}
        <StoreLocationSection onOpenContact={() => setIsContactOpen(true)} />
      </main>

      {/* 9. Footer with Chemical Safety Notice & Contact Information */}
      <StoreFooter
        onOpenContact={() => setIsContactOpen(true)}
        onSelectCategory={handleCategorySelect}
        onOpenOwnerAccess={() => setIsOwnerAccessOpen(true)}
      />

      {/* Slide-over Enquiry List Drawer */}
      <StoreCartDrawer
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Availability & Price Enquiry Dialog */}
      <StoreCheckoutDialog isOpen={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />

      {/* Quick View Technical Specs Dialog */}
      <StoreQuickViewDialog product={quickViewProduct} isOpen={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />

      {/* Catalog Search Modal */}
      <StoreSearchDialog
        products={products}
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onSelectProduct={handleOpenQuickView}
      />

      {/* Contact & Store Location Dialog */}
      <StoreContactDialog isOpen={isContactOpen} onOpenChange={setIsContactOpen} />

      {/* Disguised Owner Access Dialog */}
      <OwnerAccessDialog isOpen={isOwnerAccessOpen} onOpenChange={setIsOwnerAccessOpen} />
    </div>
  );
}
