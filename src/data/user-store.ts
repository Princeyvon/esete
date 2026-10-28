"use client";

import { useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  whatsapp: string;
  role: string;
  avatar: string;
  bio: string;
  address: string;
  city: string;
  shopName: string;
  twoFactorEnabled: boolean;
  joinedDate: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "1",
  name: "Yvon Prince",
  username: "princeyvon",
  email: "princeyvon30@gmail.com",
  phone: "+251 939 806 318",
  whatsapp: "+251 939 806 318",
  role: "Shop Owner & Lead Agronomist",
  avatar: "",
  bio: "Licensed agro-chemicals distributor and crop protection consultant in Merkato, Addis Ababa. Specializing in weed control, pesticide formulations, and certified seed supply.",
  address: "Merkato, Gojam Berenda",
  city: "Addis Ababa, Ethiopia",
  shopName: "Esete Agro",
  twoFactorEnabled: true,
  joinedDate: "January 2024",
};

const STORAGE_KEY = "esete_agro_user_profile_v1";
const SYNC_EVENT = "esete_agro_user_sync";

export function getStoredUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return DEFAULT_USER_PROFILE;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_USER_PROFILE, ...parsed };
  } catch (err) {
    console.error("Failed to load user profile", err);
    return DEFAULT_USER_PROFILE;
  }
}

export function saveStoredUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: profile }));
  } catch (err) {
    console.error("Failed to save user profile", err);
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProfile(getStoredUserProfile());
    setIsLoaded(true);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        setProfile(getStoredUserProfile());
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const updateProfile = (updates: Partial<UserProfile>): UserProfile => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveStoredUserProfile(updated);
    return updated;
  };

  const resetProfile = () => {
    setProfile(DEFAULT_USER_PROFILE);
    saveStoredUserProfile(DEFAULT_USER_PROFILE);
  };

  return {
    profile,
    isLoaded,
    updateProfile,
    resetProfile,
  };
}
