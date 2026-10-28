"use client";

import { useState } from "react";

import Link from "next/link";

import {
  ChevronDown,
  ExternalLink,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/data/cart-store";
import { useCurrency } from "@/data/currency-store";
import { ESETE_AGRO_INFO, STORE_CATEGORIES } from "@/data/storefront-data";

interface StoreHeaderProps {
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenContact: () => void;
  onSelectCategory?: (category: string) => void;
}

export function StoreHeader({ onOpenCart, onOpenSearch, onOpenContact, onSelectCategory }: StoreHeaderProps) {
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    const element = document.getElementById("catalog-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5] text-stone-800 shadow-xs border-b border-stone-200/80">
      {/* Top Announcement Bar */}
      <div className="bg-[#143422] text-[#E2ECE5] px-4 py-2 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Leaf className="size-3.5 text-emerald-400" />
              <span>{ESETE_AGRO_INFO.tagline}</span>
            </span>
            <span className="hidden md:inline text-emerald-600/70">|</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-200/90 font-normal">
              <MapPin className="size-3.5 text-emerald-400" />
              <span>{ESETE_AGRO_INFO.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Direct WhatsApp Call link */}
            <a
              href={`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=Hello%20Esete%20Agro,%20I%20have%20an%20inquiry%20about%20your%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 font-semibold text-emerald-300 hover:text-white transition-colors"
            >
              <Phone className="size-3" />
              <span>{ESETE_AGRO_INFO.phone}</span>
            </a>

            {/* Currency Switcher */}
            <div className="flex items-center gap-1.5 bg-[#0F281A] px-2 py-0.5 rounded-full border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Currency:</span>
              <button
                type="button"
                onClick={() => setCurrency("ETB")}
                className={`px-1.5 py-0.2 rounded font-bold cursor-pointer transition-colors ${
                  currency === "ETB" ? "bg-emerald-600 text-white" : "text-emerald-300/80 hover:text-white"
                }`}
              >
                ETB
              </button>
              <button
                type="button"
                onClick={() => setCurrency("RWF")}
                className={`px-1.5 py-0.2 rounded font-bold cursor-pointer transition-colors ${
                  currency === "RWF" ? "bg-emerald-600 text-white" : "text-emerald-300/80 hover:text-white"
                }`}
              >
                RWF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        {/* Logo: ESETE AGRO */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="size-10 rounded-xl bg-[#143422] text-emerald-300 flex items-center justify-center shadow-xs group-hover:bg-[#0E2719] transition-colors">
            <Leaf className="size-5.5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xl sm:text-2xl font-black tracking-wider text-[#143422] leading-none">
              ESETE AGRO
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#2F6D44] uppercase mt-0.5">
              Agricultural Inputs
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#143422] transition-colors cursor-pointer outline-none">
              <span>Categories</span>
              <ChevronDown className="size-3.5 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60 p-2 rounded-xl bg-white shadow-xl border-stone-200">
              <DropdownMenuLabel className="text-xs text-stone-500 font-semibold px-2 py-1">
                Agricultural Departments
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STORE_CATEGORIES.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="cursor-pointer text-xs py-2 px-2.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-900"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-stone-900">{cat.name}</span>
                    <span className="text-[10px] text-stone-500">{cat.subtitle}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleScrollTo("catalog-section")}
                className="cursor-pointer text-xs font-semibold py-2 px-2.5 rounded-lg text-emerald-800 hover:bg-emerald-50"
              >
                Browse Full Catalog →
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => handleScrollTo("catalog-section")}
            className="hover:text-[#143422] transition-colors cursor-pointer"
          >
            Products
          </button>

          <button
            type="button"
            onClick={() => handleScrollTo("location-section")}
            className="hover:text-[#143422] transition-colors cursor-pointer"
          >
            Location &amp; Visit
          </button>
        </nav>

        {/* Right Action Icons & WhatsApp */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct WhatsApp Call Action (Prominent) */}
          <a
            href={`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=Hello%20Esete%20Agro,%20I%20would%20like%20to%20inquire%20about%20agricultural%20products.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquare className="size-3.5" />
            <span>Ask on WhatsApp</span>
          </a>

          {/* Search Trigger */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onOpenSearch}
            className="size-9 rounded-full text-stone-700 hover:text-[#143422] hover:bg-emerald-50 cursor-pointer"
            aria-label="Search catalog"
          >
            <Search className="size-4.5" />
          </Button>

          {/* Enquiry List / Cart Drawer Trigger */}
          <Button
            type="button"
            onClick={onOpenCart}
            variant="outline"
            className="relative flex items-center gap-1.5 h-9 px-3 rounded-full border-stone-300 hover:border-emerald-700 hover:bg-emerald-50/60 text-[#143422] cursor-pointer"
            aria-label={`Enquiry list with ${totalItems} items`}
          >
            <Package className="size-4" />
            <span className="hidden sm:inline text-xs font-semibold">Enquiry List</span>
            {totalItems > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#143422] text-white text-[11px] font-bold">
                {totalItems}
              </span>
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden size-9 rounded-full text-stone-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              type="button"
              onClick={() => handleScrollTo("categories-section")}
              className="text-left py-2 text-stone-800 hover:text-emerald-800 font-semibold"
            >
              Shop by Category
            </button>
            <div className="grid grid-cols-2 gap-2 pl-2">
              {STORE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className="text-left text-xs py-1 text-stone-600 hover:text-emerald-800"
                >
                  • {cat.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleScrollTo("catalog-section")}
              className="text-left py-2 text-stone-800 hover:text-emerald-800 font-semibold"
            >
              All Products
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo("location-section")}
              className="text-left py-2 text-stone-800 hover:text-emerald-800 font-semibold"
            >
              Shop Location &amp; Visit
            </button>

            <a
              href={`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=Hello%20Esete%20Agro,%20I%20have%20an%20inquiry%20about%20your%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs"
            >
              <MessageSquare className="size-4" />
              <span>Chat on WhatsApp (+251 939 806 318)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
