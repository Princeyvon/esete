"use client";

import { useState } from "react";

import { Clock, Compass, ExternalLink, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ESETE_AGRO_INFO } from "@/data/storefront-data";

interface StoreContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoreContactDialog({ isOpen, onOpenChange }: StoreContactDialogProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      toast.error("Please enter your name and phone or email.");
      return;
    }
    setIsSent(true);
    toast.success("Thank you! Your inquiry has been sent to Esete Agro shop managers.");
  };

  const handleReset = () => {
    setIsSent(false);
    setName("");
    setContact("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl bg-white border border-stone-200">
        <DialogHeader className="p-6 pb-4 bg-[#FAF8F5] border-b border-stone-200">
          <DialogTitle className="font-serif text-xl font-bold text-[#143422]">Location &amp; Contact</DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Esete Agro physical store in Merkato Gojam bernda murtem and direct farmer customer service.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Store Location Preview Image */}
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-stone-200 shadow-inner group">
            <img
              src="/src/assets/images/esete_store_location_1793222670361.jpg"
              alt="Esete Agro Shop at Merkato Gojam bernda murtem"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Physical Storefront
                </span>
                <p className="font-semibold text-xs text-white">Merkato Gojam bernda murtem</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Merkato+Gojam+Berenda+Addis+Ababa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow transition-colors flex items-center gap-1"
              >
                <MapPin className="size-3" />
                <span>Open Maps</span>
              </a>
            </div>
          </div>

          {/* Physical Address & Contact Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-700">
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold">Exact Location</strong>
                <span>{ESETE_AGRO_INFO.location}</span>
                <span className="block text-[10px] text-stone-500 mt-0.5">
                  Gojam Berenda Murtem area, near regional parcel transport
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="size-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold">Telephone &amp; WhatsApp</strong>
                <span>{ESETE_AGRO_INFO.phone}</span>
                <span className="block text-[10px] text-stone-500 mt-0.5">
                  Direct call or instant WhatsApp response
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="size-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold">Email &amp; Inquiries</strong>
                <span>{ESETE_AGRO_INFO.email}</span>
                <span className="block text-[10px] text-stone-500 mt-0.5">Official store correspondence</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="size-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold">Opening Hours</strong>
                <span>{ESETE_AGRO_INFO.hours}</span>
                <span className="block text-[10px] text-stone-500 mt-0.5">Sunday: Regional bulk dispatch only</span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action Button */}
          <Button
            type="button"
            onClick={() => {
              window.open(
                `https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=Hello%20Esete%20Agro,%20I%20am%20inquiring%20about%20products%20at%20your%20Merkato%20Gojam%20bernda%20murtem%20shop.`,
                "_blank",
              );
            }}
            className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="size-4" />
            <span>Chat Directly on WhatsApp ({ESETE_AGRO_INFO.phone})</span>
          </Button>

          {/* Scroll to On-Page Location Section */}
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                const el = document.getElementById("location-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143422] hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
            >
              <Compass className="size-3.5 text-emerald-700" />
              <span>View Storefront Details &amp; Directions →</span>
            </button>
          </div>

          {/* Inquiry Form */}
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-stone-200">
              <span className="text-xs font-bold text-stone-800 block">Send Us a Product Inquiry</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="contact-name" className="text-[11px] font-semibold text-stone-600">
                    Your Name *
                  </Label>
                  <Input
                    id="contact-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dawit Bekele"
                    className="h-8 text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contact-info" className="text-[11px] font-semibold text-stone-600">
                    Phone Number or Email *
                  </Label>
                  <Input
                    id="contact-info"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+251 9... or email"
                    className="h-8 text-xs rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="contact-msg" className="text-[11px] font-semibold text-stone-600">
                  Message / Required Chemical &amp; Quantity
                </Label>
                <Textarea
                  id="contact-msg"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire about bulk herbicide liters, fertilizer bags, or regional delivery dispatch..."
                  className="text-xs rounded-lg resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-xs">
                  Close
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-[#143422] hover:bg-[#0E2619] text-white text-xs px-5 cursor-pointer"
                >
                  <Send className="size-3 mr-1" />
                  Send Inquiry
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 text-center space-y-2">
              <span className="text-xs font-bold text-emerald-900 block">Inquiry Submitted!</span>
              <p className="text-[11px] text-emerald-800">
                Our shop staff at Gojam Berenda Merkato will review your request and get back to you promptly.
              </p>
              <Button type="button" onClick={handleReset} variant="outline" className="text-xs rounded-full mt-2">
                Close Window
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
