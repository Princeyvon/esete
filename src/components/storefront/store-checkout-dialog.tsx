"use client";

import { useState } from "react";

import { CheckCircle2, Copy, FileText, Leaf, MessageSquare, Phone, ShieldCheck, Truck, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/data/cart-store";
import { useCurrency } from "@/data/currency-store";
import { ESETE_AGRO_INFO } from "@/data/storefront-data";

interface StoreCheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoreCheckoutDialog({ isOpen, onOpenChange }: StoreCheckoutDialogProps) {
  const { items, subtotal, clearCart, totalItems } = useCart();
  const { formatPrice } = useCurrency();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+251 ");
  const [region, setRegion] = useState("Addis Ababa");
  const [customerType, setCustomerType] = useState("Individual Farmer");
  const [notes, setNotes] = useState("");

  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || phone.trim().length < 8) {
      toast.error("Please provide your full name and valid telephone number.");
      return;
    }

    const code = `EA-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setEnquiryId(code);
    setEnquirySent(true);
    toast.success("Enquiry submitted! We will reach out to confirm pricing and availability.");
  };

  const handleResetAndClose = () => {
    setEnquirySent(false);
    clearCart();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl bg-white border border-stone-200">
        {!enquirySent ? (
          <form onSubmit={handleSendEnquiry}>
            <DialogHeader className="p-6 pb-4 bg-[#FAF8F5] border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-[#143422] text-emerald-300 flex items-center justify-center">
                  <FileText className="size-4" />
                </div>
                <div>
                  <DialogTitle className="font-serif text-lg font-bold text-[#143422]">
                    Product Availability &amp; Price Enquiry
                  </DialogTitle>
                  <DialogDescription className="text-xs text-stone-500">
                    Send your product requirements to Esete Agro at Gojam Berenda Merkato.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
              {/* Items summary */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800">{totalItems} products selected</span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {items
                      .map((i) => i.name)
                      .slice(0, 2)
                      .join(", ")}
                    {items.length > 2 && ` +${items.length - 2} more`}
                  </p>
                </div>
                {subtotal > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">Estimated:</span>
                    <div className="text-sm font-bold text-emerald-900">{formatPrice(subtotal)}</div>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="enq-name" className="text-xs font-semibold text-stone-700">
                    Your Full Name *
                  </Label>
                  <Input
                    id="enq-name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Girma Wolde"
                    className="h-9 text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="enq-phone" className="text-xs font-semibold text-stone-700">
                    Phone / WhatsApp Number *
                  </Label>
                  <Input
                    id="enq-phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 911 234 567"
                    className="h-9 text-xs rounded-lg"
                  />
                </div>
              </div>

              {/* Farm Location / Region & Customer Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-stone-700">Farm / Shop Location</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="h-9 text-xs rounded-lg">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Addis Ababa">Addis Ababa (Merkato pickup / dispatch)</SelectItem>
                      <SelectItem value="Oromia">Oromia (East/West Shewa, Arsi, Jimma)</SelectItem>
                      <SelectItem value="Amhara">Amhara (Gojjam, Gondar, Wollo)</SelectItem>
                      <SelectItem value="Sidama / SNNPR">Sidama / SNNPR (Hawassa, Wolaita)</SelectItem>
                      <SelectItem value="Tigray">Tigray</SelectItem>
                      <SelectItem value="Somali / Afar / Other">Other Ethiopian Region</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-stone-700">Customer Category</Label>
                  <Select value={customerType} onValueChange={setCustomerType}>
                    <SelectTrigger className="h-9 text-xs rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual Farmer">Individual Farmer / Grower</SelectItem>
                      <SelectItem value="Agricultural Cooperative">Agricultural Cooperative / Union</SelectItem>
                      <SelectItem value="Commercial Farm">Commercial Farm / Greenhouse</SelectItem>
                      <SelectItem value="Regional Retailer">Regional Retail Shop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <Label htmlFor="enq-notes" className="text-xs font-semibold text-stone-700">
                  Target Crops &amp; Quantities / Additional Questions
                </Label>
                <Input
                  id="enq-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need 10 liters 2,4-D for wheat crop in Arsi"
                  className="h-9 text-xs rounded-lg"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 text-[11px] text-emerald-800 leading-snug">
                <strong>Notice:</strong> Submitting this form does not charge payment. Esete Agro will confirm current
                availability, packaging, and dispatch instructions with you directly.
              </div>
            </div>

            <DialogFooter className="p-4 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-xs text-stone-600 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-[#143422] hover:bg-[#0E2619] text-white px-6 text-xs font-semibold cursor-pointer"
              >
                Submit Enquiry to Shop
              </Button>
            </DialogFooter>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-4">
            <div className="size-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-8" />
            </div>

            <DialogTitle className="font-serif text-2xl font-bold text-[#143422]">Enquiry Received!</DialogTitle>

            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Your inquiry reference is{" "}
              <strong className="font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {enquiryId}
              </strong>
              . Our team at Gojam Berenda Merkato will verify stock and contact you at <strong>{phone}</strong>.
            </p>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-500">Contact Person:</span>
                <span className="font-semibold text-stone-800">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Destination:</span>
                <span className="font-semibold text-stone-800">{region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shop Location:</span>
                <span className="font-semibold text-stone-800">Merkato, Gojam Berenda</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                onClick={() => {
                  const message = encodeURIComponent(
                    `Hello Esete Agro, I submitted enquiry ${enquiryId} for agricultural inputs. Contact: ${fullName} (${phone}).`,
                  );
                  window.open(`https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=${message}`, "_blank");
                }}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-6 py-2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="size-3.5" />
                <span>Confirm on WhatsApp Now</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="rounded-full text-xs px-6 py-2 cursor-pointer"
              >
                Back to Catalogue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
