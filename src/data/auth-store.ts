"use client";

import { useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "esete_agro_owner_session_v1";
const AUTH_EVENT = "esete_agro_owner_auth_change";

// Accepted master passwords and quick PINs for the shop owner
const VALID_PASSWORDS = [
  "9398", // Quick 4-digit PIN (last 4 digits of phone +251 939 806 318)
  "Esete@2026",
  "esete2026",
  "admin123",
  "princeyvon",
];

export function getStoredAuth(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.authenticated) {
      // Check expiration if set (default 30 days)
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return false;
      }
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function saveStoredAuth(authenticated: boolean, remember = true) {
  if (typeof window === "undefined") return;
  try {
    if (authenticated) {
      const expiresAt = remember ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000;
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ authenticated: true, expiresAt }));
      // Also set cookie for server-side hints if needed
      document.cookie = `esete_owner_session=1; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      document.cookie = "esete_owner_session=0; path=/; max-age=0; SameSite=Lax";
    }
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: authenticated }));
  } catch (err) {
    console.error("Failed to update auth storage", err);
  }
}

export function useOwnerAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(getStoredAuth());
    setIsLoaded(true);

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === "boolean") {
        setIsAuthenticated(customEvent.detail);
      } else {
        setIsAuthenticated(getStoredAuth());
      }
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const login = (input: string, remember = true): boolean => {
    const trimmed = input.trim();
    if (VALID_PASSWORDS.includes(trimmed)) {
      saveStoredAuth(true, remember);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    saveStoredAuth(false);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoaded,
    login,
    logout,
  };
}
