"use client";

import { Lock, MapPin, MessageSquare, Phone, ShieldCheck } from "lucide-react";

import { ESETE_AGRO_INFO, STORE_CATEGORIES } from "@/data/storefront-data";

interface StoreFooterProps {
  onOpenContact: () => void;
  onSelectCategory: (category: string) => void;
  onOpenOwnerAccess: () => void;
}

export function StoreFooter({ onOpenContact, onSelectCategory, onOpenOwnerAccess }: StoreFooterProps) {
  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    const element = document.getElementById("catalog-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#143422] text-[#E4EDE7] pt-12 pb-8 border-t border-emerald-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-emerald-800/60">
          {/* Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-[#1C462E] text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="size-4" />
              </div>
              <span className="font-sans text-xl font-black tracking-wider text-white">ESETE AGRO</span>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                · Agricultural Inputs
              </span>
            </div>

            <p className="text-xs text-emerald-200/80 max-w-md">{ESETE_AGRO_INFO.tagline}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-200/90 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3 text-emerald-400" />
                <span>{ESETE_AGRO_INFO.location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="size-3 text-emerald-400" />
                <span>{ESETE_AGRO_INFO.phone}</span>
              </span>
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {STORE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className="px-3 py-1.5 rounded-full bg-[#1C462E] text-emerald-200 hover:text-white hover:bg-[#245D38] text-xs transition-colors cursor-pointer"
              >
                {cat.name}
              </button>
            ))}

            <a
              href={`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=Hello%20Esete%20Agro,%20I%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageSquare className="size-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Minimal Bottom Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/70">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Esete Agro. All rights reserved.</span>
            {/* Disguised owner trigger */}
            <button
              type="button"
              onClick={onOpenOwnerAccess}
              className="text-emerald-300/20 hover:text-emerald-200 p-1 cursor-pointer transition-colors"
              title="Staff Access"
              aria-label="Staff Access"
            >
              <Lock className="size-2.5 opacity-40 hover:opacity-100" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-300/80">
            <span>100% Original Products</span>
            <span>•</span>
            <span>Merkato Gojam bernda murtem</span>
            <span>•</span>
            <span>Ethiopia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
