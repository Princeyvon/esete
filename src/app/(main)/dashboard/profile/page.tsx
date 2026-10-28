"use client";

import { Suspense, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  Eye,
  FolderTree,
  Globe,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  RotateCcw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  User,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAgroCategories } from "@/data/categories-store";
import { useCurrency } from "@/data/currency-store";
import { useAgroProducts } from "@/data/products-store";
import { useUserProfile } from "@/data/user-store";

type TabId = "all" | "general" | "security" | "permissions" | "activity";

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "all", label: "Full View (All)", icon: Sparkles },
  { id: "general", label: "Profile Information", icon: User },
  { id: "security", label: "Security & Access", icon: Shield, badge: "2FA" },
  { id: "permissions", label: "Role & Permissions", icon: KeyRound, badge: "Admin" },
  { id: "activity", label: "Activity Log", icon: Clock, badge: "Live" },
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "all";

  const { profile, updateProfile, resetProfile } = useUserProfile();
  const { products } = useAgroProducts();
  const { categories } = useAgroCategories();
  const { currency, rate } = useCurrency();

  // Active Tab State - Default to "all" so the user sees everything immediately
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabId;
    if (tabParam && ["all", "general", "security", "permissions", "activity"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Profile Form State
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [avatar, setAvatar] = useState(profile.avatar);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [twoFactor, setTwoFactor] = useState(profile.twoFactorEnabled);

  // Sync state if profile changes externally
  const handleResetForm = () => {
    setName(profile.name);
    setUsername(profile.username);
    setEmail(profile.email);
    setPhone(profile.phone);
    setWhatsapp(profile.whatsapp);
    setRole(profile.role);
    setBio(profile.bio);
    setAddress(profile.address);
    setCity(profile.city);
    setAvatar(profile.avatar);
    toast.info("Profile form reset to saved values.");
  };

  // Avatar upload handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setAvatar(dataUrl);
          updateProfile({ avatar: dataUrl });
          toast.success("Profile photo updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save General Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }
    if (!email.trim()) {
      toast.error("Email address is required.");
      return;
    }

    updateProfile({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      role: role.trim(),
      bio: bio.trim(),
      address: address.trim(),
      city: city.trim(),
      avatar,
      twoFactorEnabled: twoFactor,
    });

    toast.success("Profile updated successfully!");
  };

  // Change Password Workflow
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!currentPassword) {
      errors.push("Current password is required.");
    }
    if (!newPassword || newPassword.length < 8) {
      errors.push("New password must be at least 8 characters long.");
    }
    if (newPassword !== confirmPassword) {
      errors.push("New password and confirm password do not match.");
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      toast.error("Please fix password validation errors.");
      return;
    }

    setPasswordErrors([]);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password changed securely! All active sessions re-authenticated.");
  };

  // 2FA Toggle Workflow
  const handleToggle2FA = (checked: boolean) => {
    setTwoFactor(checked);
    updateProfile({ twoFactorEnabled: checked });
    if (checked) {
      toast.success("Two-Factor Authentication (2FA) is now ENABLED for your account.");
    } else {
      toast.warning("Two-Factor Authentication has been disabled.");
    }
  };

  const handleCopyContact = () => {
    navigator.clipboard.writeText(`${name} | ${role} at Esete Agro | Phone: ${phone} | Email: ${email}`);
    toast.success("Contact card copied to clipboard!");
  };

  // Calculate initials
  const initials = useMemo(() => {
    if (!name) return "YP";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  const showGeneral = activeTab === "all" || activeTab === "general";
  const showSecurity = activeTab === "all" || activeTab === "security";
  const showPermissions = activeTab === "all" || activeTab === "permissions";
  const showActivity = activeTab === "all" || activeTab === "activity";

  return (
    <div className="@container/main flex flex-col gap-5 md:gap-6">
      {/* Profile Banner & Hero Card */}
      <Card className="overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-gradient-to-br from-[#0B3B2C] via-[#0E4735] to-[#12533F] text-white shadow-sm">
        <div className="relative p-5 sm:p-6 md:p-8">
          <div className="absolute right-0 top-0 size-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5">
              {/* Avatar with Camera Upload Overlay */}
              <div className="relative group shrink-0">
                <Avatar className="size-20 md:size-24 rounded-2xl border-2 border-emerald-400/40 shadow-md">
                  <AvatarImage src={avatar || undefined} alt={name} className="object-cover" />
                  <AvatarFallback className="rounded-2xl bg-[#07281E] text-emerald-300 font-bold text-xl md:text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="profile-avatar-upload"
                  className="absolute -bottom-1.5 -right-1.5 flex size-8 cursor-pointer items-center justify-center rounded-xl bg-emerald-500 text-[#0B3B2C] shadow-md hover:bg-emerald-400 transition-colors"
                  title="Upload profile photo"
                >
                  <Camera className="size-4" />
                  <input
                    id="profile-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Identity details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-bold text-xl md:text-2xl tracking-tight text-white">{name}</h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                    <ShieldCheck className="size-3" />
                    Verified Owner
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#A8C5B8] flex items-center gap-2">
                  <span>@{username}</span>
                  <span>•</span>
                  <span>{role}</span>
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#D1E6DC]">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-3 text-emerald-400" />
                    <span>Esete Agro Shop</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-emerald-400" />
                    <span>Merkato Gojam bernda murtem, Addis Ababa</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3 text-emerald-400" />
                    <span>Member since {profile.joinedDate}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyContact}
                className="h-8 gap-1.5 rounded-xl border-emerald-400/30 bg-[#0B3B2C]/70 text-xs text-white hover:bg-[#12533F] hover:text-white cursor-pointer"
              >
                <Copy className="size-3.5" />
                <span>Copy Contact</span>
              </Button>
              <Link href="/dashboard/settings">
                <Button
                  type="button"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B3B2C] font-semibold text-xs shadow-xs cursor-pointer"
                >
                  <Building2 className="size-3.5" />
                  <span>Shop Settings</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-emerald-700/40 pt-4 sm:grid-cols-4">
            <div className="rounded-xl bg-[#0B3326]/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#8EB8A5] block">Products Under Care</span>
              <span className="text-lg font-bold text-white mt-0.5 block">{products.length} SKUs</span>
            </div>
            <div className="rounded-xl bg-[#0B3326]/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#8EB8A5] block">Agro Classifications</span>
              <span className="text-lg font-bold text-white mt-0.5 block">{categories.length} Categories</span>
            </div>
            <div className="rounded-xl bg-[#0B3326]/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#8EB8A5] block">Active Currency</span>
              <span className="text-lg font-bold text-emerald-300 mt-0.5 block">
                {currency} (1:{rate})
              </span>
            </div>
            <div className="rounded-xl bg-[#0B3326]/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#8EB8A5] block">Security Protection</span>
              <span className="text-lg font-bold text-emerald-300 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                2FA {twoFactor ? "Active" : "Off"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Fail-Safe Interactive Navigation Bar (Guaranteed to work without Radix UI styling bugs) */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/30 p-1.5 border border-border/60">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#0B3B2C] text-white shadow-xs"
                  : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/40"
              }`}
            >
              <Icon className={`size-3.5 ${isSelected ? "text-emerald-300" : "text-muted-foreground"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isSelected ? "bg-emerald-500/30 text-emerald-200" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Personal & Professional Info */}
      {showGeneral && (
        <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
          <CardHeader className="pb-3 px-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                <User className="size-4" />
              </span>
              <CardTitle className="text-lg font-bold text-foreground">Personal & Professional Info</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Update your personal credentials, public contact information, and agronomic bio.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-2 pb-2">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="prof-name" className="text-xs font-semibold">
                    Full Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="prof-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prof-username" className="text-xs font-semibold">
                    Username
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      @
                    </span>
                    <Input
                      id="prof-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-9 pl-7 text-xs rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="prof-email" className="text-xs font-semibold flex items-center gap-1.5">
                    <Mail className="size-3 text-muted-foreground" />
                    <span>
                      Email Address <span className="text-rose-500">*</span>
                    </span>
                  </Label>
                  <Input
                    id="prof-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prof-role" className="text-xs font-semibold">
                    Official Role & Title
                  </Label>
                  <Input
                    id="prof-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="prof-phone" className="text-xs font-semibold flex items-center gap-1.5">
                    <Phone className="size-3 text-muted-foreground" />
                    <span>Direct Phone Number</span>
                  </Label>
                  <Input
                    id="prof-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prof-whatsapp" className="text-xs font-semibold flex items-center gap-1.5">
                    <Smartphone className="size-3 text-emerald-600" />
                    <span>WhatsApp Business Number</span>
                  </Label>
                  <Input
                    id="prof-whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="prof-city" className="text-xs font-semibold flex items-center gap-1.5">
                    <Globe className="size-3 text-muted-foreground" />
                    <span>City & Region</span>
                  </Label>
                  <Input
                    id="prof-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prof-address" className="text-xs font-semibold flex items-center gap-1.5">
                    <MapPin className="size-3 text-muted-foreground" />
                    <span>Physical Shop Location</span>
                  </Label>
                  <Input
                    id="prof-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Bio / Agronomic Specialty */}
              <div className="space-y-1">
                <Label htmlFor="prof-bio" className="text-xs font-semibold">
                  Professional Agronomic Bio & Specialty
                </Label>
                <Textarea
                  id="prof-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="text-xs rounded-xl resize-none h-24"
                  placeholder="Brief description of your expertise, certifications, and shop background..."
                />
                <p className="text-[11px] text-muted-foreground">
                  This bio is shared with institutional agronomists and regional farmer cooperatives.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetForm}
                  className="h-9 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset Changes</span>
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  className="h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-semibold text-xs px-5 gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="size-3.5" />
                  <span>Save Profile Changes</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* SECTION 2: Security & Access Workflows */}
      {showSecurity && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Change Password Card */}
          <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
            <CardHeader className="pb-3 px-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Lock className="size-4" />
                </span>
                <CardTitle className="text-lg font-bold text-foreground">Change Password</CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Update your dashboard login password. Minimum 8 characters.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-2 pb-2">
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="curr-pass" className="text-xs font-semibold">
                    Current Password
                  </Label>
                  <Input
                    id="curr-pass"
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="new-pass" className="text-xs font-semibold">
                    New Password
                  </Label>
                  <Input
                    id="new-pass"
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="conf-pass" className="text-xs font-semibold">
                    Confirm New Password
                  </Label>
                  <Input
                    id="conf-pass"
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                {passwordErrors.length > 0 && (
                  <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-2.5 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400 space-y-1">
                    {passwordErrors.map((err, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <AlertCircle className="size-3 shrink-0" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-2 h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-semibold text-xs gap-1.5 shadow-xs cursor-pointer"
                >
                  <KeyRound className="size-3.5" />
                  <span>Update Password</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication & Sessions */}
          <div className="space-y-5">
            <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
              <CardHeader className="pb-3 px-2 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                      <ShieldCheck className="size-4" />
                    </span>
                    <CardTitle className="text-lg font-bold text-foreground">Two-Factor Auth (2FA)</CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={twoFactor ? "border-emerald-500 text-emerald-600 font-bold" : "border-muted-foreground"}
                  >
                    {twoFactor ? "2FA Enabled" : "2FA Disabled"}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Protect your administrative account with verification codes sent via SMS or Authenticator.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-2 pb-2 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-muted/20">
                  <div className="space-y-0.5">
                    <Label htmlFor="2fa-toggle" className="text-xs font-bold cursor-pointer text-foreground">
                      Require 2FA at Sign-in
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Codes sent to +251 939 806 318</p>
                  </div>
                  <Switch
                    id="2fa-toggle"
                    checked={twoFactor}
                    onCheckedChange={handleToggle2FA}
                    className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
              <CardHeader className="pb-3 px-2 pt-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Laptop className="size-4" />
                  </span>
                  <CardTitle className="text-lg font-bold text-foreground">Active Sessions</CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Devices currently authenticated to manage Esete Agro.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-2 pb-2 space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-3">
                    <Laptop className="size-5 text-emerald-700 dark:text-emerald-400" />
                    <div>
                      <p className="font-bold text-xs text-foreground">Current Web Session (Linux / Chrome)</p>
                      <p className="text-[11px] text-muted-foreground">Addis Ababa, Ethiopia • Active Now</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    This Device
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Smartphone className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-bold text-xs text-foreground">Mobile Dashboard (Android / Merkato)</p>
                      <p className="text-[11px] text-muted-foreground">Addis Ababa, Ethiopia • 2 hours ago</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success("Mobile session terminated.")}
                    className="h-7 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 cursor-pointer"
                  >
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* SECTION 3: Role & Permissions Workflows */}
      {showPermissions && (
        <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
          <CardHeader className="pb-3 px-2 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                    <KeyRound className="size-4" />
                  </span>
                  <CardTitle className="text-lg font-bold text-foreground">Shop Owner Authority & Privileges</CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Assigned administrative role: <strong className="text-foreground">{role}</strong> at Esete Agro.
                </CardDescription>
              </div>
              <Badge className="bg-[#0B3B2C] text-white">Full Super-Admin</Badge>
            </div>
          </CardHeader>

          <CardContent className="px-2 pb-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Package className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Catalog & Inventory Management</span>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Full authority to create, edit, delete, and restock agro-chemicals, fertilizers, seeds, and
                    sprayers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Coins className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Multi-Currency & Exchange Rate Control</span>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Configure base ETB prices, define manual conversion rate for RWF, and switch active display
                    currency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <FolderTree className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Category Architecture</span>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Add, rename, reorder, or toggle public store visibility for herbicide, insecticide, and seed groups.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <MessageSquare className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Customer Inquiries & WhatsApp Orders</span>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Direct receipt of farm order quotes, unpriced product inquiries, and bulk cooperative negotiations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 4: Activity Log & Audit Trail */}
      {showActivity && (
        <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
          <CardHeader className="pb-3 px-2 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Clock className="size-4" />
                  </span>
                  <CardTitle className="text-lg font-bold text-foreground">Recent Admin Activity</CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Audit log of recent administrative actions and inventory modifications by {name}.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast.info("Audit log refreshed.")}
                className="h-8 text-xs rounded-xl cursor-pointer"
              >
                <RotateCcw className="size-3 mr-1" />
                Refresh Log
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-2 pb-2">
            <div className="relative border-l-2 border-emerald-500/30 pl-4 ml-3 space-y-5 my-2">
              <div className="relative">
                <span className="absolute -left-[23px] top-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">Configured Currency Settings</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Just now</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Set manual exchange rate for RWF (1 ETB = {rate} RWF) and enabled multi-currency catalog tags.
                  </p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[23px] top-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">Updated Product Catalog</span>
                    <span className="text-[10px] text-muted-foreground font-mono">15 mins ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enabled card grid view and added multi-image preview support for {products.length} agro-chemical
                    SKUs.
                  </p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[23px] top-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">Inventory Audit Completed</span>
                    <span className="text-[10px] text-muted-foreground font-mono">1 hour ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Verified Merkato Gojam Berenda warehouse stock levels (19 In Stock, 4 Low Stock, 2 Out of Stock).
                  </p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[23px] top-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">Session Authenticated</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Today at 08:30 AM</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Logged in to Esete Agro Admin from Addis Ababa, Ethiopia with Two-Factor Verification.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
