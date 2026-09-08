import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { notify } from "@/lib/notify";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Membership Inquiry",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notify.info({
      title: "SUBMISSION NOT CONNECTED",
      message: "Thanks. Your message is prepared, but online submission is not currently connected.",
    });
  };

  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* Harmonized Header */}
      <SectionReveal className="max-w-3xl space-y-4">
        <div>
          <Badge variant="volt" className="font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            GLOBAL CONCIERGE
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight font-heading leading-[1.08]">
          CONNECT WITH IRONX HEADQUARTERS.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
          Book private tours, consult with head performance coaches, or coordinate international corporate memberships.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 lg:p-10 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-heading">
              Send an Athletic Inquiry
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#08080a] border border-[#1f1f26] text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#a1a1aa] mx-auto" aria-hidden="true" />
                <h4 className="text-xl font-bold text-white uppercase font-heading">Message Prepared</h4>
                <p className="text-sm text-[#a1a1aa] max-w-md mx-auto leading-relaxed">
                  Thanks, {formData.fullName}. Your message is prepared, but online submission is not currently connected. To reach IRONX concierge directly, please email concierge@ironx.fitness.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Reset Form
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5" htmlFor="contact-full-name">
                      Full Name
                    </label>
                    <Input
                      id="contact-full-name"
                      required
                      placeholder="Marcus Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-[#121217] border-[#1f1f26] focus:border-[#dfff00] h-11"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5" htmlFor="contact-email">
                      Email Address
                    </label>
                    <Input
                      id="contact-email"
                      required
                      type="email"
                      placeholder="athlete@ironx.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#121217] border-[#1f1f26] focus:border-[#dfff00] h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5" htmlFor="contact-phone">
                      Phone (Optional)
                    </label>
                    <Input
                      id="contact-phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#121217] border-[#1f1f26] focus:border-[#dfff00] h-11"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5" htmlFor="contact-subject">
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 rounded-xl border border-[#1f1f26] bg-[#121217] px-4 text-sm text-[#f4f4f5] focus:outline-none focus:border-[#dfff00] transition-colors"
                    >
                      <option>Membership Inquiry</option>
                      <option>Private 1-on-1 Coaching</option>
                      <option>Corporate Athlete Programs</option>
                      <option>Facility Tour Scheduling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Describe your current athletic goals or facility requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-[#1f1f26] bg-[#121217] px-4 py-3 text-sm text-[#f4f4f5] placeholder:text-[#71717a] focus:border-[#dfff00] focus:outline-none focus:ring-1 focus:ring-[#dfff00] transition-all"
                  />
                </div>

                <Button type="submit" variant="volt" size="lg" className="w-full min-h-[48px] gap-2">
                  <Send className="w-4 h-4" aria-hidden="true" /> Submit Inquiry
                </Button>
              </form>
            )}
          </div>

          {/* Location & Facility Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-white uppercase font-heading">
                Flagship Facility Details
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#dfff00] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">IRONX Athletic Headquarters</p>
                    <p className="text-[#a1a1aa] text-xs mt-0.5">Armour Colony, Nowshera, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#dfff00] shrink-0 mt-1" aria-hidden="true" />
                  <div className="flex flex-col gap-1.5">
                    <a
                      href="tel:+923079009095"
                      className="text-[#f4f4f5] font-mono text-xs hover:text-white transition-colors"
                    >
                      +92 307 9009095
                    </a>
                    <a
                      href="https://wa.me/923079009095"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/25 hover:bg-[#25D366]/20 transition-colors font-medium text-[11px] w-fit cursor-pointer"
                    >
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#dfff00] shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:maliknabeelkhattak@gmail432.com"
                    className="text-[#f4f4f5] font-mono text-xs hover:text-white transition-colors break-all"
                  >
                    maliknabeelkhattak@gmail432.com
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#dfff00] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">Training Hours</p>
                    <p className="text-[#a1a1aa] text-xs mt-0.5 font-mono">24/7 Digital Pass Access</p>
                    <p className="text-[#71717a] text-xs font-mono">Coached Hours: 05:00 - 22:00 Daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
