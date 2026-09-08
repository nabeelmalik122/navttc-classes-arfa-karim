import React, { useState } from "react";
import { User, Mail, Phone, Heart, Save, Target, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";

export default function MemberSettingsPage() {
  const { user, updateProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [fitnessGoal, setFitnessGoal] = useState(user?.metadata?.fitnessGoal || "");
  const [emergencyName, setEmergencyName] = useState(user?.metadata?.emergencyContact?.name || "");
  const [emergencyPhone, setEmergencyPhone] = useState(user?.metadata?.emergencyContact?.phone || "");
  const [emergencyRelation, setEmergencyRelation] = useState(user?.metadata?.emergencyContact?.relation || "Spouse");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      notify.warning({
        title: "VALIDATION REQUIRED",
        message: "Athlete display name cannot be empty.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        metadata: {
          ...user?.metadata,
          fitnessGoal: fitnessGoal.trim(),
          emergencyContact: {
            name: emergencyName.trim(),
            phone: emergencyPhone.trim(),
            relation: emergencyRelation
          }
        }
      });
      notify.success({
        title: "PROFILE UPDATED",
        message: "Your athlete profile and settings have been saved.",
      });
    } catch (error) {
      notify.error({
        title: "UPDATE FAILED",
        message: "Failed to update profile parameters.",
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
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">ATHLETE IDENTITY & PREFERENCES</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Settings & Athlete Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Manage personal identity, emergency medical contacts, and performance training objectives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-[10px] font-mono">
              VERIFIED ATHLETE STANDING
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Main Settings Form */}
      <SectionReveal delay={0.05}>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: General Identity */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-5">
            <div className="border-b border-[#1f1f26] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase font-heading">
                  General Identity & Contact
                </h2>
                <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                  Your primary athlete credentials recognized across facility turnstiles.
                </p>
              </div>
              <User className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="display-name" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Athlete Display Name *
                </label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  icon={<User className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                  required
                />
              </div>

              <div>
                <label htmlFor="email-address" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Registered Email (Locked)
                </label>
                <Input
                  id="email-address"
                  disabled
                  value={user?.email || ""}
                  icon={<Mail className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a]/60 border-[#1f1f26] text-[#71717a] min-h-[44px] cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="mobile-phone" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Mobile Contact Phone
                </label>
                <Input
                  id="mobile-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  icon={<Phone className="w-4 h-4 text-[#71717a]" />}
                  placeholder="+1 (555) 000-0000"
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>

              <div>
                <label htmlFor="fitness-goal" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Primary Athletic Focus
                </label>
                <Input
                  id="fitness-goal"
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  icon={<Target className="w-4 h-4 text-[#71717a]" />}
                  placeholder="e.g. Olympic Weightlifting & Power"
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Emergency Medical Contact */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-5">
            <div className="border-b border-[#1f1f26] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase font-heading">
                  Emergency Medical Contact
                </h2>
                <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                  Designated emergency liaison for training floor incidents.
                </p>
              </div>
              <Heart className="w-4 h-4 text-rose-400" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label htmlFor="emergency-name" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Contact Name
                </label>
                <Input
                  id="emergency-name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  icon={<Heart className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>

              <div>
                <label htmlFor="emergency-relation" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Relationship
                </label>
                <select
                  id="emergency-relation"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full rounded-xl border border-[#1f1f26] bg-[#08080a] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#dfff00] font-mono min-h-[44px]"
                >
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Parent">Parent / Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Physician">Personal Physician</option>
                  <option value="Colleague">Colleague / Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="emergency-phone" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Emergency Phone
                </label>
                <Input
                  id="emergency-phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="volt"
              size="lg"
              disabled={isSaving}
              className="min-h-[44px] gap-2 font-bold w-full sm:w-auto"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {isSaving ? "Saving..." : "Save Profile Changes"}
            </Button>
          </div>
        </form>
      </SectionReveal>
    </div>
  );
}
