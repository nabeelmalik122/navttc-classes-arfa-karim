import React, { useState } from "react";
import { Award, ShieldCheck, User, Phone, Save, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";

export default function TrainerSettingsPage() {
  const { user, updateProfile } = useAuthStore();

  const [savedSettings, setSavedSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("ironyx-trainer-profile-settings");
      return saved ? JSON.parse(saved) : {
        title: "Director of High Performance & Barbell Biomechanics",
        bio: "Former national powerlifting champion with 12+ years optimizing human kinematics, neuromuscular efficiency, and barbell mastery.",
        phone: "+1 (555) 723-9090",
        weeklyHours: "35"
      };
    } catch {
      return {
        title: "Director of High Performance & Barbell Biomechanics",
        bio: "Former national powerlifting champion with 12+ years optimizing human kinematics, neuromuscular efficiency, and barbell mastery.",
        phone: "+1 (555) 723-9090",
        weeklyHours: "35"
      };
    }
  });

  const [title, setTitle] = useState(savedSettings.title);
  const [bio, setBio] = useState(savedSettings.bio);
  const [phone, setPhone] = useState(user?.phoneNumber || savedSettings.phone);
  const [weeklyHours, setWeeklyHours] = useState(savedSettings.weeklyHours);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (phone.trim() !== user?.phoneNumber) {
        await updateProfile({ phoneNumber: phone.trim() });
      }
      const updated = { title, bio, phone, weeklyHours };
      localStorage.setItem("ironyx-trainer-profile-settings", JSON.stringify(updated));
      setSavedSettings(updated);
      notify.success({
        title: "PROFILE SAVED",
        message: "Coach profile and bio parameters saved locally on this device.",
      });
    } catch (err) {
      notify.error({
        title: "SAVE FAILED",
        message: "Failed to save coach profile parameters.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">COACH DOSSIER & PROFILE</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Master Coach Settings & Bio
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Update public bio, verified coaching accreditations, and direct athlete contact details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-[10px] font-mono">
              ACTIVE FACULTY ROSTER
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Main Settings Form */}
      <SectionReveal delay={0.05}>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Coaching Identity */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-5">
            <div className="border-b border-[#1f1f26] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase font-heading">
                  Coaching Identity & Contact
                </h2>
                <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                  Public athlete-facing credentials displayed across classes and private roster bookings.
                </p>
              </div>
              <Award className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="coach-name" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Coach Display Name (Locked)
                </label>
                <Input
                  id="coach-name"
                  disabled
                  value={user?.displayName || "Alex 'Titan' Thorne"}
                  icon={<User className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a]/60 border-[#1f1f26] text-[#71717a] min-h-[44px] cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="coach-phone" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Direct Floor Phone
                </label>
                <Input
                  id="coach-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="coach-title" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Official Coaching Title *
              </label>
              <Input
                id="coach-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                required
              />
            </div>

            <div>
              <label htmlFor="coach-bio" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Public Bio & Training Philosophy
              </label>
              <textarea
                id="coach-bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Detail your periodization philosophy and coaching background..."
                className="w-full rounded-xl border border-[#1f1f26] bg-[#08080a] p-3 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#dfff00] font-mono leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Floor Availability Target */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-5">
            <div className="border-b border-[#1f1f26] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase font-heading">
                  Floor Allocation Targets
                </h2>
                <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                  Weekly coaching floor capacity target for schedule matrix balancing.
                </p>
              </div>
              <Clock className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>

            <div className="max-w-xs">
              <label htmlFor="weekly-hours" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Target Weekly Floor Hours
              </label>
              <Input
                id="weekly-hours"
                type="number"
                min="10"
                max="60"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
              />
            </div>
          </div>

          {/* Section 3: Credentials Ledger */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-4">
            <div className="border-b border-[#1f1f26] pb-3 flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Faculty Standing & Security
              </h2>
              <ShieldCheck className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#08080a] border border-[#1f1f26]">
                <span className="text-[#71717a] block text-[10px] uppercase">COACH ID</span>
                <span className="text-white font-bold truncate block">{user?.uid || "—"}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#08080a] border border-[#1f1f26]">
                <span className="text-[#71717a] block text-[10px] uppercase">Registered Email</span>
                <span className="text-white font-bold block truncate">{user?.email || "—"}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="volt"
              size="lg"
              className="min-h-[44px] gap-2 font-bold w-full sm:w-auto"
              isLoading={isSaving}
              disabled={isSaving}
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {isSaving ? "Saving..." : "Save Coach Profile"}
            </Button>
          </div>
        </form>
      </SectionReveal>
    </div>
  );
}
