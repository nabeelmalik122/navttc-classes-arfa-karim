import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Dumbbell, Check } from "lucide-react";
import { IronyxLogo } from "@/components/ui/IronyxLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";

function mapRegisterError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "auth/email-already-in-use") return "An account with this email already exists.";
    if (code === "auth/invalid-email") return "Please enter a valid email address.";
    if (code === "auth/weak-password") return "Password is too weak. Use at least 6 characters.";
    if (code === "auth/network-request-failed") return "Network error. Check your connection.";
  }
  return "Account creation failed. Please try again.";
}

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan") || "plan_pro";

  const plans = useGymStore((s) => s.plans);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(planParam);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const validate = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setFormError("");
    if (!fullName.trim()) {
      setNameError("Full name is required.");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Email address is required.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await register(email, password, fullName, "member", selectedPlanId);
      notify.success({
        title: "Account Provisioned",
        message: "Your IRONX performance account is ready.",
      });
      navigate("/member/dashboard", { replace: true });
    } catch (err) {
      const errMsg = mapRegisterError(err);
      setFormError(errMsg);
      notify.error({
        title: "REGISTRATION FAILED",
        message: errMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08080a] text-white font-sans selection:bg-[#dfff00] selection:text-black">
      {/* ── SPLIT LAYOUT ── */}
      <div className="relative z-10 min-h-screen w-full flex flex-col lg:flex-row">

        {/* ── LEFT / MOBILE BANNER: ATHLETE VISUAL PANEL ── */}
        <div className="relative w-full h-[28vh] min-h-[190px] max-h-[250px] lg:h-auto lg:min-h-screen lg:max-h-none lg:w-1/2 bg-black flex flex-col justify-end p-5 sm:p-8 xl:p-12 pb-6 lg:pb-14 overflow-hidden shrink-0">
          <img
            src="/vortex-auth-bg.jpg"
            alt="Athlete training"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] filter brightness-[0.75] contrast-[1.1] saturate-[1.05]"
          />
          {/* Subtle directional depth overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-black/20 lg:from-black lg:via-black/40 lg:to-black/10 pointer-events-none" />
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#08080a] pointer-events-none" />

          {/* Hero Manifesto */}
          <div className="relative z-10 max-w-md">
            <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#dfff00]/40 bg-black/75 backdrop-blur-sm text-[9px] font-bold tracking-[0.2em] text-[#dfff00] uppercase mb-1.5 lg:mb-2.5">
              Athletic Performance Platform
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black uppercase leading-[1.08] font-heading text-white drop-shadow-xl">
              Forge <span className="text-[#dfff00]">Uncompromising</span> Power
            </h2>
            <p className="hidden sm:block text-zinc-300 text-xs xl:text-sm mt-1.5 lg:mt-2.5 leading-relaxed font-sans">
              Biomechanical precision, periodized strength protocols, and elite coaching — under one roof.
            </p>
          </div>
        </div>

        {/* ── RIGHT: FORM PANEL ── */}
        <div className="relative flex-1 flex flex-col min-h-screen justify-between px-4 sm:px-8 lg:px-10 py-5">
          {/* Ambient glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[320px] h-[320px] rounded-full bg-[#dfff00]/[0.05] blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#dfff00]/[0.03] blur-[100px]" />
          </div>

          {/* Top Header */}
          <header className="relative z-20 w-full flex items-center justify-between shrink-0 mb-6 sm:mb-8">
            <Link to="/" className="flex items-center gap-2 lg:hidden group">
              <div className="w-7 h-7 rounded-lg bg-black/80 border border-[#dfff00]/50 flex items-center justify-center text-[#dfff00]">
                <IronyxLogo className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-xs tracking-[0.2em] uppercase text-white font-heading">
                IRONX
              </span>
            </Link>
            <div className="hidden lg:block" />

            {/* Top Right Header Action Button */}
            <div className="flex items-center gap-2.5 ml-auto">
              <span className="hidden sm:inline text-xs text-zinc-400 font-medium">Already have an account?</span>
              <Link
                to="/login"
                className="px-3.5 py-1 rounded-lg border border-zinc-700 hover:border-[#dfff00] bg-black/80 hover:bg-[#dfff00] text-zinc-200 hover:text-black text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </header>

          {/* Form Chamber */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-2 sm:py-4">
            <div className="w-full max-w-sm sm:max-w-md mx-auto">

              {/* Title Header */}
              <div className="flex flex-col items-center text-center mb-4 sm:mb-5">
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wider font-heading">
                  Sign Up
                </h1>
                <p className="text-zinc-400 text-xs mt-1">
                  Create your profile to get started.
                </p>
              </div>

              {/* Glass Card */}
              <div className="bg-black/65 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)]">

                {formError && (
                  <div role="alert" aria-live="assertive" className="w-full mb-3 rounded-lg border border-red-500/50 bg-red-950/80 backdrop-blur-md px-3 py-1.5 text-xs text-red-200 font-mono text-center">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="w-full space-y-3">

                  {/* Membership Tier Selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                      Membership Tier
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {plans.map((p) => {
                        const active = selectedPlanId === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPlanId(p.id)}
                            aria-pressed={active}
                            className={`relative py-1.5 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                              active
                                ? "border-[#dfff00] bg-[#dfff00]/[0.1] shadow-[0_0_12px_rgba(223,255,0,0.18)]"
                                : "border-zinc-700/70 bg-black/40 hover:border-zinc-500"
                            }`}
                          >
                            {active && (
                              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#dfff00] flex items-center justify-center">
                                <Check className="w-2 h-2 text-black" strokeWidth={3} />
                              </span>
                            )}
                            <p className={`text-[10px] font-bold truncate pr-3 ${active ? "text-white" : "text-zinc-300"}`}>
                              {p.name}
                            </p>
                            <p className="text-[10px] text-[#dfff00] font-mono font-bold mt-0.5">
                              ${p.priceMonthly}<span className="text-zinc-500 font-normal">/mo</span>
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label htmlFor="register-name" className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); setNameError(""); setFormError(""); }}
                        aria-invalid={!!nameError}
                        className="w-full bg-black/50 border border-zinc-700 focus:border-[#dfff00] rounded-lg pl-8.5 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#dfff00]/40 transition-all"
                      />
                    </div>
                    {nameError && <p className="text-[10px] text-red-400 font-mono mt-0.5">{nameError}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="register-email" className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); setFormError(""); }}
                        aria-invalid={!!emailError}
                        className="w-full bg-black/50 border border-zinc-700 focus:border-[#dfff00] rounded-lg pl-8.5 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#dfff00]/40 transition-all"
                      />
                    </div>
                    {emailError && <p className="text-[10px] text-red-400 font-mono mt-0.5">{emailError}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label htmlFor="register-password" className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                      Password <span className="text-zinc-500 font-normal normal-case">(min. 6 chars)</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setPasswordError(""); setFormError(""); }}
                        aria-invalid={!!passwordError}
                        className="w-full bg-black/50 border border-zinc-700 focus:border-[#dfff00] rounded-lg pl-8.5 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#dfff00]/40 transition-all"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {passwordError && <p className="text-[10px] text-red-400 font-mono mt-0.5">{passwordError}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    id="register-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-2.5 px-5 rounded-lg bg-[#dfff00] hover:bg-[#eaff4d] text-black font-black tracking-wide text-xs uppercase transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_20px_rgba(223,255,0,0.3)] hover:shadow-[0_4px_25px_rgba(223,255,0,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-heading cursor-pointer"
                  >
                    {!isSubmitting && <UserPlus className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </button>
                </form>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="relative z-10 w-full py-1 text-center text-[9px] text-zinc-500 font-mono tracking-wider shrink-0">
            © 2026 IRONX FITNESS PERFORMANCE PLATFORM • ALL RIGHTS RESERVED
          </footer>
        </div>
      </div>
    </div>
  );
}
