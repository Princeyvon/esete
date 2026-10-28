"use client";

import { Clock, ExternalLink, MapPin, MessageSquare, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ESETE_AGRO_INFO } from "@/data/storefront-data";

interface StoreLocationSectionProps {
  onOpenContact?: () => void;
}

export function StoreLocationSection({ onOpenContact }: StoreLocationSectionProps) {
  return (
    <section id="location-section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-[#F7F4EE] border border-stone-200/90 p-6 sm:p-10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Clean Modern Storefront Photo */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-stone-200/80 bg-white">
              <img
                src="/src/assets/images/esete_store_location_1793222670361.jpg"
                alt="Esete Agro shop at Merkato Gojam bernda murtem"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right: Minimal Location & Contact Details */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#245D38]">
                Storefront &amp; Pickup
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143422] mt-1">Visit Us in Merkato</h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                Come to our shop for in-person advice, wholesale bulk collection, or same-day regional parcel dispatch.
              </p>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200/70">
                <MapPin className="size-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Location</strong>
                  <span>{ESETE_AGRO_INFO.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200/70">
                <Clock className="size-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Working Hours</strong>
                  <span>{ESETE_AGRO_INFO.hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200/70">
                <Phone className="size-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Call &amp; WhatsApp</strong>
                  <span>{ESETE_AGRO_INFO.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=Hello%20Esete%20Agro,%20I%20am%20inquiring%20about%20products%20at%20your%20Merkato%20Gojam%20bernda%20murtem%20shop.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#143422] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#0E2619] transition-all cursor-pointer"
              >
                <MessageSquare className="size-3.5 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Merkato+Gojam+Berenda+Addis+Ababa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 transition-all cursor-pointer"
              >
                <span>Google Maps</span>
                <ExternalLink className="size-3 text-stone-400" />
              </a>

              {onOpenContact && (
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-3 py-2 cursor-pointer ml-auto"
                >
                  Send Inquiry Form &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
