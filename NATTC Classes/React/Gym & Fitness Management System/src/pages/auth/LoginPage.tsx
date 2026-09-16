import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IronyxLogo } from "@/components/ui/IronyxLogo";
import { Mail, Lock, Eye, EyeOff, Shield, Award, User, ArrowRight, LogIn, ChevronDown, Dumbbell } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";
import type { UserRole } from "@/types";

function mapAuthError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    if (
      code === "auth/invalid-credential" ||
      code === "auth/wrong-password" ||
      code === "auth/user-not-found"
    ) return "Invalid credentials. Check your email and password.";
    if (code === "auth/user-disabled") return "This account has been suspended.";
    if (code === "auth/too-many-requests") return "Too many failed attempts. Try again later.";
    if (code === "auth/network-request-failed") return "Network error. Check your connection.";
    if (code === "auth/popup-closed-by-user") return "Sign-in cancelled. The Google sign-in window was closed.";
    if (code === "auth/popup-blocked") return "Popup blocked. Please allow popups for this site and try again.";
    if (code === "auth/account-exists-with-different-credential") return "An account already exists with this email using another sign-in method. Please sign in with your email and password.";
    if (code === "auth/operation-not-allowed") return "Google Sign-In is not currently enabled for this project. Please contact administration.";
    if (code === "auth/unauthorized-domain") return "This domain is not authorized for Google Sign-In. Please contact administration.";
    if (code === "auth/cancelled-popup-request") return "Authentication request was superseded. Please try again.";
  }
  if (err instanceof Error && err.message === "LIVE_FIREBASE_NOT_CONFIGURED") {
    return "Live Firebase configuration is not detected.";
  }
  return "Authentication failed. Check your credentials and try again.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const { login, loginWithGoogle, switchSandboxRole, isDemoMode } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const getRoleDest = (r: UserRole) =>
    r === "admin" ? "/admin/dashboard" : r === "trainer" ? "/trainer/dashboard" : "/member/dashboard";

  const isAuthorizedForPath = (path: string, userRole: UserRole): boolean => {
    if (userRole === "admin") return true;
    if (path.startsWith("/admin")) return false;
    if (path.startsWith("/trainer")) return userRole === "trainer";
    if (path.startsWith("/member")) return userRole === "member";
    return true;
  };

  const resolveDestination = (fromPath: string | undefined, userRole: UserRole): string => {
    if (fromPath && isAuthorizedForPath(fromPath, userRole)) {
      return fromPath;
    }
    return getRoleDest(userRole);
  };

  const validate = () => {
    let valid = true;
    setEmailError(""); setPasswordError(""); setFormError("");
    if (!email.trim()) { setEmailError("Email address is required."); valid = false; }
    if (!password) { setPasswordError("Password is required."); valid = false; }
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isGoogleSubmitting) return;
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await login(email, password, role);
      const activeUserRole = useAuthStore.getState().activeRole;
      notify.success({
        title: "ACCESS GRANTED",
        message: "Welcome back, Athlete.",
      });
      navigate(resolveDestination(from, activeUserRole || role), { replace: true });
    } catch (err) {
      const errorMsg = mapAuthError(err);
      setFormError(errorMsg);
      notify.error({
        title: "ACCESS DENIED",
        message: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting || isGoogleSubmitting) return;
    setIsGoogleSubmitting(true);
    setFormError("");
    try {
      await loginWithGoogle();
      const activeUserRole = useAuthStore.getState().activeRole;
      notify.success({
        title: "ACCESS GRANTED",
        message: "Authenticated via Google.",
      });
      // Authoritative role resolution from user profile (never client select dropdown)
      navigate(resolveDestination(from, activeUserRole), { replace: true });
    } catch (err) {
      const errorMsg = mapAuthError(err);
      setFormError(errorMsg);
      notify.error({
        title: "ACCESS DENIED",
        message: errorMsg,
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    if (!isDemoMode) return;
    setRole(demoRole);
    switchSandboxRole(demoRole);
    notify.success({
      title: "ACCESS GRANTED",
      message: `Authenticated in sandbox as ${demoRole.toUpperCase()}.`,
    });
    navigate(getRoleDest(demoRole));
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08080a] text-white font-sans selection:bg-[#dfff00] selection:text-black">
      {/* ── SPLIT LAYOUT ── */}
      <div className="relative z-10 min-h-screen w-full flex flex-col lg:flex-row">

        {/* ── LEFT / MOBILE BANNER: ATHLETE VISUAL PANEL ── */}
        <div className="relative w-full h-[28vh] min-h-[190px] max-h-[250px] lg:h-auto lg:min-h-screen lg:max-h-none lg:w-1/2 bg-black flex flex-col justify-end p-5 sm:p-8 xl:p-12 pb-6 lg:pb-14 overflow-hidden shrink-0">
          <img
            src="/vortex-auth-bg.jpg"
            alt="Athlete workout"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] filter brightness-[0.75] contrast-[1.1] saturate-[1.05]"
          />
          {/* Subtle directional depth overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-black/20 lg:from-black lg:via-black/40 lg:to-black/10 pointer-events-none" />
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#08080a] pointer-events-none" />

          {/* Hero Manifesto (Mobile compact, Desktop full) */}
          <div className="relative z-10 max-w-md">
            <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#dfff00]/40 bg-black/75 backdrop-blur-sm text-[9px] font-bold tracking-[0.15em] text-[#dfff00] uppercase mb-1.5 lg:mb-2.5">
              Athletic Command Center
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black uppercase leading-[1.08] font-heading text-white drop-shadow-xl">
              Command <span className="text-[#dfff00]">Your</span> Performance
            </h2>
            <p className="hidden sm:block text-zinc-300 text-xs xl:text-sm mt-1.5 lg:mt-2.5 leading-relaxed font-sans">
              Track telemetry, manage elite programming, and unlock unrestricted athletic progression.
            </p>
          </div>
        </div>

        {/* ── RIGHT: FORM PANEL ── */}
        <div className="relative flex-1 flex flex-col min-h-screen justify-between px-4 sm:px-8 lg:px-10 py-5">
          {/* Ambient glow effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[320px] h-[320px] rounded-full bg-[#dfff00]/[0.05] blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#dfff00]/[0.03] blur-[100px]" />
          </div>

          {/* Top Header with Portal Role Switchers & Register Link */}
          <header className="relative z-20 w-full flex items-center justify-between shrink-0 mb-6 sm:mb-8">
            <Link to="/" className="flex items-center gap-2 lg:hidden group">
              <div className="w-7 h-7 rounded-lg bg-black/80 border border-[#dfff00]/50 flex items-center justify-center text-[#dfff00]">
                <IronyxLogo className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-xs tracking-[0.2em] uppercase text-white font-heading">
                IRONX
              </span>
            </Link>

            {/* Portal Switcher & Register Action */}
            <div className="flex items-center gap-2 ml-auto">
              {isDemoMode && (
                <div className="hidden sm:flex items-center gap-1.5 mr-1">
                  {([
                    { r: "member" as UserRole, label: "Member", icon: User },
                    { r: "trainer" as UserRole, label: "Trainer", icon: Award },
                    { r: "admin" as UserRole, label: "Admin", icon: Shield },
                  ]).map(({ r, label, icon: Icon }) => {
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        id={`nav-role-${r}`}
                        onClick={() => handleQuickDemo(r)}
                        className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${isSelected
                          ? "bg-[#dfff00] text-black border-[#dfff00] font-bold shadow-[0_0_10px_rgba(223,255,0,0.3)]"
                          : "bg-black/70 hover:bg-black/90 text-zinc-300 border-zinc-700/80 hover:border-[#dfff00] hover:text-[#dfff00]"
                          }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <Link
                to="/register"
                className="px-3.5 py-1 rounded-lg border border-zinc-700 hover:border-[#dfff00] bg-black/80 hover:bg-[#dfff00] text-zinc-200 hover:text-black text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Sign Up</span>
              </Link>
            </div>
          </header>

          {/* Form Chamber */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-2 sm:py-4">
            <div className="w-full max-w-sm sm:max-w-md mx-auto">

              {/* Title Header */}
              <div className="flex flex-col items-center text-center mb-4 sm:mb-5">
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wider font-heading">
                  Sign In
                </h1>
                <p className="text-zinc-400 text-xs mt-1">
                  Enter your credentials to access your account.
                </p>
              </div>

              {/* Glass Card */}
              <div className="bg-black/65 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)]">

                {formError && (
                  <div role="alert" aria-live="assertive" className="w-full mb-3 rounded-lg border border-red-500/50 bg-red-950/80 backdrop-blur-md px-3 py-1.5 text-xs text-red-200 font-mono text-center">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleLogin} noValidate className="w-full space-y-3">

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label htmlFor="login-email" className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-email"
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

                  {/* Password Field */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="login-password" className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[10px] text-zinc-400 hover:text-[#dfff00] transition-colors underline underline-offset-4 py-0.5"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
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
                    id="login-submit"
                    type="submit"
                    disabled={isSubmitting || isGoogleSubmitting}
                    className="w-full mt-2 py-2.5 px-5 rounded-lg bg-[#dfff00] hover:bg-[#eaff4d] text-black font-black tracking-wide text-xs uppercase transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_20px_rgba(223,255,0,0.3)] hover:shadow-[0_4px_25px_rgba(223,255,0,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-heading cursor-pointer"
                  >
                    {!isSubmitting && <LogIn className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    {isSubmitting ? "AUTHENTICATING..." : "SIGN IN"}
                  </button>

                  {/* Subtle OR Divider */}
                  <div className="relative my-3 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-800" />
                    </div>
                    <span className="relative bg-[#0c0c10] px-2 text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                      or
                    </span>
                  </div>

                  {/* Continue with Google */}
                  <button
                    id="login-google"
                    type="button"
                    disabled={isSubmitting || isGoogleSubmitting}
                    onClick={handleGoogleLogin}
                    aria-label="Continue with Google"
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#121217] hover:bg-[#181820] border border-zinc-700 hover:border-zinc-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#dfff00]/50 active:scale-[0.99]"
                  >
                    {isGoogleSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-[#dfff00] rounded-full animate-spin" aria-hidden="true" />
                        <span>AUTHENTICATING...</span>
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>CONTINUE WITH GOOGLE</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="w-full text-center py-4 border-t border-white/5">
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              © 2026 IRONX FITNESS PERFORMANCE PLATFORM • ALL RIGHTS RESERVED
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
