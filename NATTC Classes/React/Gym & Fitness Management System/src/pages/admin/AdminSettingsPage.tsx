import React, { useState } from "react";
import { Settings, Save, ShieldAlert, Database, Lock, Building, MapPin, Mail, Sliders } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { notify } from "@/lib/notify";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("ironyx-facility-settings");
      return saved ? JSON.parse(saved) : {
        gymName: "IRONX Athletic Performance Sanctuary",
        address: "Not configured",
        supportEmail: "Not configured",
        capacityAlert: "90"
      };
    } catch {
      return {
        gymName: "IRONX Athletic Performance Sanctuary",
        address: "Not configured",
        supportEmail: "Not configured",
        capacityAlert: "90"
      };
    }
  });

  const [gymName, setGymName] = useState(settings.gymName);
  const [address, setAddress] = useState(settings.address);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [capacityAlert, setCapacityAlert] = useState(settings.capacityAlert);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = { gymName, address, supportEmail, capacityAlert };
      localStorage.setItem("ironyx-facility-settings", JSON.stringify(updated));
      setSettings(updated);
      notify.success({
        title: "PARAMETERS SAVED",
        message: "Facility parameters saved locally on this device.",
      });
    } catch (e) {
      notify.error({
        title: "SAVE FAILED",
        message: "Failed to save facility parameters.",
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
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">SYSTEM CONFIGURATION</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Facility & System Parameters
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Global facility metadata, turnstile capacity thresholds, and operational dispatch parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              ROOT CONFIGURATION ACTIVE
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Main Settings Form */}
      <SectionReveal delay={0.05}>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Sanctuary Identity */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-5">
            <div className="border-b border-[#1f1f26] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase font-heading">
                  Sanctuary Identity & Metadata
                </h2>
                <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                  Public brand identity and physical address referenced on official booking receipts.
                </p>
              </div>
              <Building className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>

            <div>
              <label htmlFor="facility-name" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Facility Name *
              </label>
              <Input
                id="facility-name"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="physical-address" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Physical Address
                </label>
                <Input
                  id="physical-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  icon={<MapPin className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>

              <div>
                <label htmlFor="support-email" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Concierge Inbound Email
                </label>
                <Input
                  id="support-email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4 text-[#71717a]" />}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Operations & Capacity Control */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-5">
            <div className="border-b border-[#1f1f26] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase font-heading">
                  Turnstile Operations & Capacity Throttle
                </h2>
                <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                  Threshold limit where arena turnstiles throttle access to preserve safety buffers.
                </p>
              </div>
              <Sliders className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>

            <div className="max-w-xs">
              <label htmlFor="capacity-throttle" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Turnstile Throttle Threshold (%)
              </label>
              <Input
                id="capacity-throttle"
                type="number"
                min="50"
                max="100"
                value={capacityAlert}
                onChange={(e) => setCapacityAlert(e.target.value)}
                className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
              />
              <span className="text-[10px] text-[#71717a] font-mono mt-1 block">
                Triggers visual warning in console when arena exceeds {capacityAlert}% load.
              </span>
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
              {isSaving ? "Saving..." : "Save Facility Parameters"}
            </Button>
          </div>
        </form>
      </SectionReveal>
    </div>
  );
}
