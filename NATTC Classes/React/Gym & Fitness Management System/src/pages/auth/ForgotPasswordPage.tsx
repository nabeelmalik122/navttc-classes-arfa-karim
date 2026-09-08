import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle2, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IronyxLogo } from "@/components/ui/IronyxLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";

function mapForgotError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "auth/invalid-email") return "Please enter a valid email address.";
    if (code === "auth/too-many-requests") return "Too many requests. Please wait a moment and try again.";
    if (code === "auth/network-request-failed") return "Network connection failed. Please check your connection.";
  }
  return "Unable to process password reset request. Please try again.";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { isDemoMode, resetPassword } = useAuthStore();

  const validate = () => {
    setEmailError("");
    setFormError("");
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email address is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    if (!validate()) return;

    setIsSending(true);
    setFormError("");

    try {
      if (isDemoMode) {
        setSent(true);
        notify.info({
          title: "RESET REQUEST RECEIVED",
          message: "Sandbox mode: no real reset email is sent in demo.",
        });
      } else {
        await resetPassword(email.trim());
        setSent(true);
        notify.success({
          title: "RESET REQUEST RECEIVED",
          message: "If an account exists, reset instructions have been dispatched.",
        });
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        const code = (err as { code: string }).code;
        if (code === "auth/user-not-found") {
          setSent(true);
          notify.success({
            title: "RESET REQUEST RECEIVED",
            message: "If an account exists, reset instructions have been dispatched.",
          });
          return;
        }
      }
      const errMsg = mapForgotError(err);
      setFormError(errMsg);
      notify.error({
        title: "REQUEST FAILED",
        message: errMsg,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#08080a] text-white overflow-x-hidden font-sans selection:bg-[#dfff00] selection:text-black">
      {/* ── 4K ULTRA HD ATHLETIC BACKGROUND (CRYSTAL CLEAR VISIBILITY) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/vortex-auth-bg.jpg"
          alt="Athlete workout background"
          className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.08] saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a]/90 via-transparent to-[#08080a]/60" />
      </div>

      {/* ── TOP NAVIGATION HEADER ── */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-[#dfff00] opacity-30 blur-sm group-hover:opacity-60 transition-opacity" />
            <div className="relative w-9 h-9 rounded-lg bg-black/80 border border-[#dfff00]/50 flex items-center justify-center text-[#dfff00]">
              <IronyxLogo className="w-5 h-5" />
            </div>
          </div>
          <span className="font-black text-sm sm:text-base tracking-[0.22em] uppercase text-white font-heading">
            IRONX <span className="text-[#dfff00]">FITNESS</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="px-4 py-1.5 rounded-lg border border-zinc-700 hover:border-[#dfff00] bg-black/70 hover:bg-[#dfff00] text-zinc-200 hover:text-black text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </header>

      {/* ── CENTER CHAMBER ── */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md mx-auto flex flex-col items-center bg-black/75 backdrop-blur-xl border border-white/10 p-7 sm:p-9 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          {/* Gym Shield Emblem */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121217] border border-[#1f1f26] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dfff00]" />
            <span className="text-[8px] font-black tracking-widest text-white uppercase font-heading">IRONX</span>
            <span className="text-zinc-600 text-[8px] font-mono">/</span>
            <span className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase">ACCESS PROTOCOL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wider font-heading text-center mb-2 drop-shadow-md">
            RESET PASSWORD
          </h1>
          <p className="text-xs text-zinc-400 font-mono text-center mb-6">
            Enter your account email to receive reset instructions.
          </p>

          {sent ? (
            <div className="text-center space-y-5 py-2 w-full" aria-live="polite">
              <CheckCircle2 className="w-12 h-12 text-[#dfff00] mx-auto drop-shadow-[0_0_15px_rgba(223,255,0,0.5)]" />
              <div>
                <p className="text-sm text-white font-bold font-heading uppercase tracking-wide">Request Received</p>
                <p className="text-xs text-zinc-400 font-mono mt-2 leading-relaxed">
                  If an account exists for <strong className="text-[#dfff00]">{email.trim()}</strong>, you will receive password reset instructions.
                </p>
              </div>
              <Link to="/login" className="block pt-2">
                <Button variant="volt" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="w-full space-y-5">
              {formError && (
                <div role="alert" aria-live="assertive" className="rounded-xl border border-red-500/50 bg-red-950/80 backdrop-blur-md px-4 py-2.5 text-xs text-red-200 font-mono text-center shadow-lg">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="block text-xs font-semibold text-zinc-300 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); setFormError(""); }}
                    className="w-full bg-black/50 border-b-2 border-zinc-500 focus:border-[#dfff00] focus:bg-black/70 transition-all px-3 py-2.5 text-sm text-white placeholder-zinc-400 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {emailError && <p className="text-[11px] text-red-400 font-mono mt-1">{emailError}</p>}
              </div>

              <button
                id="forgot-submit"
                type="submit"
                disabled={isSending}
                className="w-full mt-4 py-3.5 px-6 rounded-md bg-white hover:bg-[#dfff00] text-black font-black tracking-widest text-sm uppercase transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_25px_rgba(255,255,255,0.25)] hover:shadow-[0_4px_30px_rgba(223,255,0,0.5)] flex items-center justify-center gap-2 cursor-pointer font-heading disabled:opacity-50"
              >
                {!isSending && <Send className="w-4 h-4" />}
                {isSending ? "SENDING..." : "SEND RESET LINK"}
              </button>

              <div className="pt-2 text-center">
                <Link to="/login" className="text-xs text-zinc-400 hover:text-white transition-colors underline underline-offset-4">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 w-full py-3 text-center text-[9px] text-zinc-500 font-mono tracking-wider">
        © 2026 IRONX FITNESS PERFORMANCE PLATFORM • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
