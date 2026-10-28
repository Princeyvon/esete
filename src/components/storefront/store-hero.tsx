"use client";

import Image from "next/image";

import { ArrowRight, CheckCircle2, Leaf, MessageSquare, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { ESETE_AGRO_INFO } from "@/data/storefront-data";

interface StoreHeroProps {
  onShopNowClick: () => void;
  onOpenContact: () => void;
}

export function StoreHero({ onShopNowClick, onOpenContact }: StoreHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F7F4EE] border-b border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#245D38]">
              <Leaf className="size-3.5 text-emerald-700" />
              <span>Esete Agro · Agricultural Inputs</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#143422] leading-[1.12]">
              Quality products <br />
              <span className="italic font-normal text-[#245D38]">for better farming 🌿</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-lg text-sm sm:text-base text-stone-600 leading-relaxed">
              Certified herbicides, insecticides, fungicides, granular fertilizers, and seeds. Supplying farmers from
              our shop in Merkato Gojam bernda murtem, Addis Ababa.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onShopNowClick}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#143422] px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#0E2619] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>Explore Products</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=Hello%20Esete%20Agro,%20I%20would%20like%20to%20inquire%20about%20agricultural%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 hover:border-emerald-700 transition-all cursor-pointer"
              >
                <MessageSquare className="size-4 text-emerald-700" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Right Hero Visual Composition featuring Clean Modern Minimal Aesthetic */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[560px] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 bg-[#F4F1EA] group">
              <img
                src="/src/assets/images/esete_hero_minimal_1793222668899.jpg"
                alt="Esete Agro Clean Minimal Agricultural Essentials"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Overlay highlight badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-200/80 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1">
                    <Leaf className="size-3 text-emerald-600" /> Esete Agro Certified Inputs
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-stone-800">
                    Herbicides · Insecticides · Fungicides · Fertilizers · Sprayers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onShopNowClick}
                  className="text-xs font-bold text-[#143422] hover:text-emerald-700 underline underline-offset-2 shrink-0 cursor-pointer ml-2"
                >
                  Explore →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
