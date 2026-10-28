"use client";

import { useState } from "react";

import { ArrowRightLeft, Check, Coins } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type Currency, useCurrency } from "@/data/currency-store";

export function CurrencySwitcher() {
  const { currency, rate, setCurrency, setEtbToRwfRate } = useCurrency();
  const [tempRate, setTempRate] = useState(rate.toString());
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempRate(rate.toString());
    }
  };

  const handleSelectCurrency = (target: Currency) => {
    setCurrency(target);
    toast.success(`Currency switched to ${target}.`);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number.parseFloat(tempRate);
    if (Number.isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid positive conversion rate.");
      return;
    }
    setEtbToRwfRate(parsed);
    toast.success(`Conversion rate updated: 1 ETB = ${parsed} RWF.`);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-xl border-border/60 bg-background/80 px-2.5 text-xs font-semibold shadow-2xs hover:bg-accent hover:text-accent-foreground"
          aria-label="Currency and exchange rate settings"
        >
          <Coins className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold">{currency}</span>
          <span className="text-[11px] font-normal text-muted-foreground hidden sm:inline">(1:{rate})</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl p-4 shadow-lg border-border/60">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
            <div>
              <h4 className="text-sm font-bold text-foreground">Currency & Exchange Rate</h4>
              <p className="text-xs text-muted-foreground">Display prices in ETB or RWF</p>
            </div>
            <span className="rounded-full bg-[#E8F6ED] px-2 py-0.5 text-[11px] font-bold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              Active: {currency}
            </span>
          </div>

          {/* Currency Toggle Buttons */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Select Display Currency</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectCurrency("ETB")}
                className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-colors cursor-pointer ${
                  currency === "ETB"
                    ? "border-emerald-600 bg-emerald-50 font-semibold text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-border/60 bg-muted/30 text-foreground hover:bg-muted/60"
                }`}
              >
                <div>
                  <div className="font-bold text-sm">ETB</div>
                  <div className="text-[11px] text-muted-foreground">Ethiopian Birr</div>
                </div>
                {currency === "ETB" && <Check className="size-4 text-emerald-600 dark:text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => handleSelectCurrency("RWF")}
                className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-colors cursor-pointer ${
                  currency === "RWF"
                    ? "border-emerald-600 bg-emerald-50 font-semibold text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-border/60 bg-muted/30 text-foreground hover:bg-muted/60"
                }`}
              >
                <div>
                  <div className="font-bold text-sm">RWF</div>
                  <div className="text-[11px] text-muted-foreground">Rwandan Franc</div>
                </div>
                {currency === "RWF" && <Check className="size-4 text-emerald-600 dark:text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Manual Conversion Rate Configuration */}
          <form onSubmit={handleSaveRate} className="space-y-2.5 rounded-xl bg-muted/30 p-3 border border-border/50">
            <div className="flex items-center justify-between">
              <Label htmlFor="rate-input" className="text-xs font-semibold text-foreground">
                Manual Conversion Rate
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono">1 ETB = {rate} RWF</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">1 ETB =</span>
              <Input
                id="rate-input"
                type="number"
                step="0.01"
                min="0.1"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                placeholder="10.5"
                className="h-8 rounded-lg text-xs"
              />
              <span className="text-xs font-medium text-muted-foreground">RWF</span>
              <Button
                type="submit"
                size="sm"
                className="h-8 rounded-lg px-2.5 text-xs bg-[#0B3B2C] hover:bg-[#134636] text-white"
              >
                Save
              </Button>
            </div>

            {/* Quick Conversion Preview */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
              <span>Sample: 1,000 ETB</span>
              <ArrowRightLeft className="size-3 text-emerald-600" />
              <span className="font-semibold text-foreground">
                {Math.round(1000 * (Number.parseFloat(tempRate) || rate)).toLocaleString()} RWF
              </span>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
