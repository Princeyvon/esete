"use client";

import { CheckCircle2, MessageSquare, Phone, ShieldCheck, Tag } from "lucide-react";

import { ESETE_AGRO_INFO } from "@/data/storefront-data";

export function StoreValueStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
      <div className="rounded-2xl bg-[#143422] px-6 py-5 text-white shadow-md border border-emerald-900/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-emerald-800/60">
          {/* Column 1: 100% Original Products */}
          <div className="flex items-center gap-3.5 sm:justify-center pt-2 md:pt-0">
            <div className="size-10 rounded-full bg-[#1C462E] text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Original Inputs</h4>
              <p className="text-xs text-emerald-200/80">Certified crop protection &amp; seeds</p>
            </div>
          </div>

          {/* Column 2: Best Price */}
          <div className="flex items-center gap-3.5 sm:justify-center pt-3 md:pt-0 md:px-4">
            <div className="size-10 rounded-full bg-[#1C462E] text-emerald-300 flex items-center justify-center shrink-0">
              <Tag className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Wholesale &amp; Retail Price</h4>
              <p className="text-xs text-emerald-200/80">Merkato Gojam bernda murtem</p>
            </div>
          </div>

          {/* Column 3: Direct WhatsApp & Call */}
          <div className="flex items-center gap-3.5 sm:justify-center pt-3 md:pt-0 md:pl-4">
            <div className="size-10 rounded-full bg-[#1C462E] text-emerald-300 flex items-center justify-center shrink-0">
              <Phone className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct WhatsApp &amp; Call</h4>
              <p className="text-xs text-emerald-200/80">{ESETE_AGRO_INFO.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
