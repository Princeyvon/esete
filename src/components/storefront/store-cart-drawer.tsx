"use client";

import Image from "next/image";

import { ArrowRight, Leaf, MessageSquare, Minus, Package, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/data/cart-store";
import { useCurrency } from "@/data/currency-store";
import { ESETE_AGRO_INFO } from "@/data/storefront-data";

interface StoreCartDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToCheckout: () => void;
}

export function StoreCartDrawer({ isOpen, onOpenChange, onProceedToCheckout }: StoreCartDrawerProps) {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { currency, formatPrice, convertToRwf } = useCurrency();

  const rwfSubtotal = convertToRwf(subtotal) ?? 0;
  const secondaryFormatted =
    currency === "ETB" ? `~${rwfSubtotal.toLocaleString("en-US")} RWF` : `~${subtotal.toLocaleString("en-US")} ETB`;

  const handleSendWhatsAppEnquiry = () => {
    if (items.length === 0) return;
    const itemListText = items
      .map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity} ${item.unit || "units"})`)
      .join("\n");

    const message = encodeURIComponent(
      `Hello Esete Agro,\nI would like to inquire about the following products:\n\n${itemListText}\n\nAre these items currently in stock at Gojam Berenda, and what are the current prices?`,
    );

    window.open(`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0 bg-[#FAF8F5] border-l border-stone-200"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-stone-200/80 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-[#143422] text-emerald-300 flex items-center justify-center">
                <Package className="size-4" />
              </div>
              <SheetTitle className="font-serif text-lg font-bold text-[#143422]">Your Enquiry List</SheetTitle>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900">
              {totalItems} {totalItems === 1 ? "product" : "products"}
            </span>
          </div>

          <SheetDescription className="text-xs text-stone-500 pt-1">
            Review your selected farm inputs and ask about current stock and wholesale pricing.
          </SheetDescription>
        </SheetHeader>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="size-16 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-400 mb-3">
                <Package className="size-8" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-800">Your enquiry list is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mt-1 mb-4">
                Browse our herbicides, insecticides, fungicides, fertilizers, and seeds to add items here.
              </p>
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full bg-[#143422] hover:bg-[#0E2619] text-white text-xs px-6 py-2 cursor-pointer"
              >
                Browse Catalogue
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-stone-200/90 shadow-2xs"
              >
                {/* Thumbnail */}
                <div className="relative size-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-5 text-stone-400" />
                    </div>
                  )}
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-serif text-xs font-bold text-[#143422] line-clamp-1">{item.name}</h5>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-600 cursor-pointer p-0.5"
                      title="Remove item"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  {item.packageSize && <p className="text-[10px] text-stone-500">{item.packageSize}</p>}

                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold text-xs text-emerald-900">
                      {item.price > 0 ? formatPrice(item.price * item.quantity) : "Price on enquiry"}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg bg-stone-50 px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="size-5 rounded flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="text-xs font-bold px-1 text-stone-800">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="size-5 rounded flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with WhatsApp Send & Submit Actions */}
        {items.length > 0 && (
          <SheetFooter className="p-6 bg-white border-t border-stone-200/90 flex flex-col gap-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Total Items for Enquiry:</span>
                <span className="font-semibold text-stone-800">{totalItems} units</span>
              </div>
              {subtotal > 0 && (
                <div className="flex items-center justify-between text-sm font-bold text-[#143422] pt-1.5 border-t border-stone-100">
                  <span>Estimated Total (ETB):</span>
                  <div className="text-right">
                    <div>{formatPrice(subtotal)}</div>
                    <div className="text-[10px] font-normal text-stone-500">{secondaryFormatted}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Multi-Item Enquiry Button */}
            <Button
              type="button"
              onClick={handleSendWhatsAppEnquiry}
              className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="size-4" />
              <span>Send Enquiry via WhatsApp</span>
            </Button>

            {/* Alternative Submit Enquiry Form */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onProceedToCheckout();
              }}
              className="w-full rounded-full border-stone-300 text-stone-700 text-xs font-semibold py-2.5"
            >
              <span>Submit Online Request Form</span>
              <ArrowRight className="size-3.5 ml-1" />
            </Button>

            <button
              type="button"
              onClick={clearCart}
              className="text-[11px] text-stone-400 hover:text-stone-700 underline text-center cursor-pointer pt-1"
            >
              Clear enquiry list
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
