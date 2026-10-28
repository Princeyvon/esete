"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  Globe,
  KeyRound,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
  Sprout,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { type Currency, useCurrency } from "@/data/currency-store";
import { useUserProfile } from "@/data/user-store";

export default function SettingsPage() {
  const { currency, rate, setCurrency, setEtbToRwfRate } = useCurrency();
  const { profile, updateProfile } = useUserProfile();

  // Shop Information State
  const [shopName, setShopName] = useState("Esete Agro");
  const [phone, setPhone] = useState("+251 939 806 318");
  const [whatsapp, setWhatsapp] = useState("+251 939 806 318");
  const [address, setAddress] = useState("Merkato Gojam bernda murtem, Addis Ababa");
  const [tagline, setTagline] = useState("Your Trusted Partner in High-Quality Agricultural Inputs & Crop Protection");
  const [city, setCity] = useState("Addis Ababa, Ethiopia");
  const [businessType, setBusinessType] = useState("Agro-Chemical & Farm Inputs Retailer");

  // Currency & Rate Configuration State
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("ETB");
  const [manualRate, setManualRate] = useState("10.5");

  useEffect(() => {
    setSelectedCurrency(currency);
    setManualRate(rate.toString());
  }, [currency, rate]);

  // Owner Account Basics State
  const [ownerName, setOwnerName] = useState(profile.name);
  const [ownerEmail, setOwnerEmail] = useState(profile.email);
  const [ownerRole, setOwnerRole] = useState(profile.role);

  useEffect(() => {
    if (profile.name) setOwnerName(profile.name);
    if (profile.email) setOwnerEmail(profile.email);
    if (profile.role) setOwnerRole(profile.role);
  }, [profile]);

  // Notification Preferences
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [priceInquiries, setPriceInquiries] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // Save currency and manual exchange rate
    const parsedRate = Number.parseFloat(manualRate);
    if (Number.isNaN(parsedRate) || parsedRate <= 0) {
      toast.error("Please enter a valid positive exchange rate.");
      return;
    }
    setCurrency(selectedCurrency);
    setEtbToRwfRate(parsedRate);

    // Save owner profile changes
    updateProfile({
      name: ownerName.trim(),
      email: ownerEmail.trim(),
      role: ownerRole.trim(),
    });

    toast.success("Shop settings, profile, and currency exchange rate saved successfully!");
  };

  const currentRateNumber = Number.parseFloat(manualRate) || rate;

  return (
    <div className="@container/main flex flex-col gap-5 md:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-foreground">Shop Settings</h1>
            <span className="rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              Active Store
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Manage your shop profile in Gojam Berenda, multi-currency pricing (ETB / RWF), and owner credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            onClick={handleSaveSettings}
            size="sm"
            className="h-9 gap-1.5 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-medium text-xs px-3.5 shadow-xs"
          >
            <Save className="size-3.5" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: Shop Profile & Currency (7/12) */}
        <div className="flex flex-col gap-5 lg:col-span-7 xl:col-span-8">
          {/* Currency & Conversion Rate Configuration Card */}
          <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
            <CardHeader className="pb-3 px-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Coins className="size-4" />
                  </span>
                  <CardTitle className="text-lg font-bold text-foreground">Currency & Exchange Rate</CardTitle>
                </div>
                <Badge variant="outline" className="border-emerald-600/30 text-emerald-700 dark:text-emerald-300">
                  Dual Currency
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Set primary pricing currency (ETB or RWF) and manually define the exchange rate across catalog and
                dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-2 pb-2">
              {/* Primary Currency Switcher */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Display Currency</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency("ETB")}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all text-left ${
                      selectedCurrency === "ETB"
                        ? "border-emerald-600 bg-[#E8F6ED]/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500"
                        : "border-border/60 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">ETB (Ethiopian Birr)</div>
                      <div className="text-[11px] text-muted-foreground">Default base currency for Merkato shop</div>
                    </div>
                    {selectedCurrency === "ETB" && (
                      <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCurrency("RWF")}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all text-left ${
                      selectedCurrency === "RWF"
                        ? "border-emerald-600 bg-[#E8F6ED]/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500"
                        : "border-border/60 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">RWF (Rwandan Franc)</div>
                      <div className="text-[11px] text-muted-foreground">Auto-converts using manual exchange rate</div>
                    </div>
                    {selectedCurrency === "RWF" && (
                      <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Manual Conversion Rate Input */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="manual-rate" className="text-xs font-semibold text-foreground">
                    Manual Conversion Rate (1 ETB in RWF)
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">1 ETB = {currentRateNumber} RWF</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">1 ETB =</span>
                  <Input
                    id="manual-rate"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={manualRate}
                    onChange={(e) => setManualRate(e.target.value)}
                    className="h-9 text-xs font-semibold rounded-xl max-w-44"
                  />
                  <span className="text-xs font-semibold text-muted-foreground">RWF</span>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setManualRate("10.5")}
                      className="h-8 text-[11px] rounded-lg px-2"
                    >
                      Preset: 10.5
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setManualRate("11.0")}
                      className="h-8 text-[11px] rounded-lg px-2"
                    >
                      Preset: 11.0
                    </Button>
                  </div>
                </div>

                {/* Conversion Preview Table */}
                <div className="pt-2 border-t border-border/40">
                  <p className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <ArrowRightLeft className="size-3 text-emerald-600" />
                    <span>Live Sample Price Conversion:</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-background/80 p-2 border border-border/40">
                      <span className="text-muted-foreground text-[10px] block">Small Item</span>
                      <span className="font-bold">ETB 500</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold block text-[11px]">
                        ≈ RWF {Math.round(500 * currentRateNumber).toLocaleString()}
                      </span>
                    </div>
                    <div className="rounded-xl bg-background/80 p-2 border border-border/40">
                      <span className="text-muted-foreground text-[10px] block">Standard Chemical</span>
                      <span className="font-bold">ETB 1,850</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold block text-[11px]">
                        ≈ RWF {Math.round(1850 * currentRateNumber).toLocaleString()}
                      </span>
                    </div>
                    <div className="rounded-xl bg-background/80 p-2 border border-border/40">
                      <span className="text-muted-foreground text-[10px] block">Knapsack Sprayer</span>
                      <span className="font-bold">ETB 4,500</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold block text-[11px]">
                        ≈ RWF {Math.round(4500 * currentRateNumber).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shop Information Card */}
          <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
            <CardHeader className="pb-3 px-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Building2 className="size-4" />
                </span>
                <CardTitle className="text-lg font-bold text-foreground">Shop Information</CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Public profile and contact channels displayed on customer invoices and inquiries.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-2 pb-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="shop-name" className="text-xs">
                    Shop Name
                  </Label>
                  <Input
                    id="shop-name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="business-type" className="text-xs">
                    Business Classification
                  </Label>
                  <Input
                    id="business-type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="tagline" className="text-xs">
                  Shop Tagline / Slogan
                </Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="address" className="text-xs flex items-center gap-1.5">
                  <MapPin className="size-3 text-muted-foreground" />
                  <span>Physical Shop Location</span>
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Located in the agro-commercial hub of Merkato Gojam bernda murtem, Addis Ababa.
                </p>
              </div>

              {/* Phone & WhatsApp Contacts */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs flex items-center gap-1.5">
                    <Phone className="size-3 text-muted-foreground" />
                    <span>Customer Hotline (Phone)</span>
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="whatsapp" className="text-xs flex items-center gap-1.5">
                    <Smartphone className="size-3 text-emerald-600" />
                    <span>WhatsApp Order Number</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Alerts Card */}
          <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
            <CardHeader className="pb-3 px-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                  <MessageSquare className="size-4" />
                </span>
                <CardTitle className="text-lg font-bold text-foreground">Operational Alerts</CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Automated alerts for low stock threshold breaches and customer inquiries.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 px-2 pb-2">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold">Low Stock Threshold Warnings</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Highlight SKUs when remaining units fall below safety threshold.
                  </p>
                </div>
                <Switch
                  checked={lowStockAlerts}
                  onCheckedChange={setLowStockAlerts}
                  className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold">WhatsApp Order Inquiries</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Forward incoming "Contact us for price" inquiries to +251 939 806 318.
                  </p>
                </div>
                <Switch
                  checked={whatsappNotifications}
                  onCheckedChange={setWhatsappNotifications}
                  className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold">Price Inquiries Logging</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Keep a history of unpriced catalog clicks from regional farmers.
                  </p>
                </div>
                <Switch
                  checked={priceInquiries}
                  onCheckedChange={setPriceInquiries}
                  className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Owner Account Basics (5/12) */}
        <div className="flex flex-col gap-5 lg:col-span-5 xl:col-span-4">
          <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
            <CardHeader className="pb-3 px-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                  <User className="size-4" />
                </span>
                <CardTitle className="text-lg font-bold text-foreground">Owner Account</CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Primary administrator profile for Esete Agro dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-2 pb-2">
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-[#E8F6ED]/40 dark:bg-emerald-950/20 p-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#0B3B2C] text-emerald-300 font-bold text-sm">
                  EA
                </div>
                <div>
                  <p className="font-bold text-xs text-foreground">{ownerName}</p>
                  <p className="text-[11px] text-muted-foreground">{ownerEmail}</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="size-3" />
                    Verified Admin
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="owner-name" className="text-xs">
                  Full Name
                </Label>
                <Input
                  id="owner-name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="owner-email" className="text-xs flex items-center gap-1.5">
                  <Mail className="size-3 text-muted-foreground" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="owner-email"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="owner-role" className="text-xs">
                  Role & Permissions
                </Label>
                <Input
                  id="owner-role"
                  value={ownerRole}
                  onChange={(e) => setOwnerRole(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2 h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-medium text-xs gap-1.5 shadow-xs"
              >
                <Save className="size-3.5" />
                <span>Save Profile Changes</span>
              </Button>

              <div className="space-y-1.5 pt-1 border-t border-border/40">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Profile Workflows
                </p>
                <Link
                  href="/dashboard/profile?tab=security"
                  className="flex items-center justify-between p-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-xs"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    <span>Security & 2FA</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">Manage &rarr;</span>
                </Link>
                <Link
                  href="/dashboard/profile?tab=permissions"
                  className="flex items-center justify-between p-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-xs"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <KeyRound className="size-3.5 text-emerald-600" />
                    <span>Roles & Permissions</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">View &rarr;</span>
                </Link>
                <Link
                  href="/dashboard/profile?tab=activity"
                  className="flex items-center justify-between p-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-xs"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Clock className="size-3.5 text-emerald-600" />
                    <span>Activity & Audit Log</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">Audit &rarr;</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
