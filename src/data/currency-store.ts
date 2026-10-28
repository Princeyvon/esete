"use client";

import { useEffect, useState } from "react";

export type Currency = "ETB" | "RWF";

export interface CurrencyConfig {
  currency: Currency;
  etbToRwfRate: number; // 1 ETB = X RWF
}

const STORAGE_KEY = "esete_agro_currency_settings_v1";
const SYNC_EVENT = "esete_agro_currency_sync";

export const DEFAULT_CURRENCY_CONFIG: CurrencyConfig = {
  currency: "ETB",
  etbToRwfRate: 10.5, // 1 ETB ≈ 10.5 RWF
};

export function getStoredCurrencyConfig(): CurrencyConfig {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENCY_CONFIG;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CURRENCY_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      currency: parsed.currency === "RWF" ? "RWF" : "ETB",
      etbToRwfRate: typeof parsed.etbToRwfRate === "number" && parsed.etbToRwfRate > 0 ? parsed.etbToRwfRate : 10.5,
    };
  } catch (err) {
    console.error("Failed to read currency settings", err);
    return DEFAULT_CURRENCY_CONFIG;
  }
}

export function saveStoredCurrencyConfig(config: CurrencyConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: config }));
  } catch (err) {
    console.error("Failed to save currency settings", err);
  }
}

export function formatProductPrice(
  priceInEtb: number | null | undefined,
  showPrice = true,
  currency: Currency = "ETB",
  rate = 10.5,
): string {
  if (!showPrice || priceInEtb === null || priceInEtb === undefined) {
    return "Contact us for price";
  }

  if (currency === "RWF") {
    const converted = Math.round(priceInEtb * rate);
    return `RWF ${converted.toLocaleString("en-US")}`;
  }

  return `ETB ${priceInEtb.toLocaleString("en-US")}`;
}

export function useCurrency() {
  const [config, setConfig] = useState<CurrencyConfig>(DEFAULT_CURRENCY_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setConfig(getStoredCurrencyConfig());
    setIsLoaded(true);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<CurrencyConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getStoredCurrencyConfig());
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const setCurrency = (currency: Currency) => {
    const updated: CurrencyConfig = { ...config, currency };
    setConfig(updated);
    saveStoredCurrencyConfig(updated);
  };

  const setEtbToRwfRate = (etbToRwfRate: number) => {
    const safeRate = Number.isNaN(etbToRwfRate) || etbToRwfRate <= 0 ? 10.5 : etbToRwfRate;
    const updated: CurrencyConfig = { ...config, etbToRwfRate: safeRate };
    setConfig(updated);
    saveStoredCurrencyConfig(updated);
  };

  const formatPrice = (priceInEtb: number | null | undefined, showPrice = true): string => {
    return formatProductPrice(priceInEtb, showPrice, config.currency, config.etbToRwfRate);
  };

  const convertToRwf = (priceInEtb: number | null | undefined): number | null => {
    if (priceInEtb === null || priceInEtb === undefined) return null;
    return Math.round(priceInEtb * config.etbToRwfRate);
  };

  return {
    currency: config.currency,
    rate: config.etbToRwfRate,
    isLoaded,
    setCurrency,
    setEtbToRwfRate,
    formatPrice,
    convertToRwf,
  };
}
