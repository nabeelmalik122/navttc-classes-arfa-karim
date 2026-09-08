import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { IronyxLogo } from "@/components/ui/IronyxLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";

function mapResetError(err: unknown): { message: string; isCodeInvalid: boolean } {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "auth/invalid-action-code" || code === "auth/expired-action-code") {
      return {
        message: "This password reset link has expired or has already been used. Please request a new one.",
        isCodeInvalid: true,
      };
    }
    if (code === "auth/weak-password") {
      return {
        message: "Password is too weak. Please use at least 8 characters.",
        isCodeInvalid: false,
      };
    }
    if (code === "auth/user-disabled") {
      return {
        message: "This account has been disabled. Please contact administration.",
        isCodeInvalid: false,
      };
    }
    if (code === "auth/network-request-failed") {
      return {
        message: "Network connection failed. Please check your internet connection.",
        isCodeInvalid: false,
      };
    }
  }
  return {
    message: "Failed to reset password. The link may have expired or is invalid.",
    isCodeInvalid: false,
  };
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);

  const { isDemoMode, confirmPasswordReset } = useAuthStore();

  const validate = () => {
    let valid = true;
    setPasswordError("");
    setConfirmError("");
    setFormError("");

    if (!password) {
      setPasswordError("New password is required.");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your new password.");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submit
    if (!oobCode) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setFormError("");

    try {
      if (isDemoMode) {
        setIsSuccess(true);
        notify.info({
          title: "CREDENTIALS UPDATED",
          message: "Sandbox mode: credentials updated in demo.",
        });
      } else {
        await confirmPasswordReset(oobCode, password);
        setIsSuccess(true);
        notify.success({
          title: "PASSWORD UPDATED",
          message: "Your credentials have been updated successfully.",
        });
      }
    } catch (err: unknown) {
      const { message, isCodeInvalid: codeInvalid } = mapResetError(err);
      setFormError(message);
      notify.error({
        title: "UPDATE FAILED",
        message: message,
      });
      if (codeInvalid) {
        setIsCodeInvalid(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080a] px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        <SectionReveal>
          <div className="text-center space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="IRONX — Return to homepage">
              <div className="w-11 h-11 rounded-xl bg-[#0c0c10] border border-[#1f1f26] flex items-center justify-center text-[#dfff00]">
                <IronyxLogo className="w-6 h-6" />
              </div>
            </Link>
            <div>
              <Badge variant="volt" className="text-[10px] font-mono tracking-widest mb-2">
                CREDENTIAL UPDATE
              </Badge>
              <h1 className="text-3xl font-black uppercase text-white font-heading tracking-tight">
                Set New Password
              </h1>
              <p className="text-xs text-[#a1a1aa] font-mono mt-1.5">
                Define a new password for your IRONX account.
              </p>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.06}>
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-5">
            {/* Missing or Expired oobCode state */}
            {(!oobCode || isCodeInvalid) && !isSuccess ? (
              <div className="text-center space-y-5 py-4" role="alert" aria-live="assertive">
                <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6 text-[#ef4444]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-[#f4f4f5] font-medium font-heading uppercase tracking-wide">
                    Invalid or Expired Link
                  </p>
                  <p className="text-xs text-[#a1a1aa] font-mono mt-1.5 leading-relaxed">
                    This password reset link is missing a valid security code or has already been used. Please request a new recovery link.
                  </p>
                </div>
                <div className="space-y-2.5 pt-2">
                  <Link to="/forgot-password" className="block">
                    <Button variant="volt" className="w-full">
                      Request New Reset Link
                    </Button>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-1.5 text-xs text-[#a1a1aa] hover:text-white transition-colors font-mono py-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Sign In
                  </Link>
                </div>
              </div>
            ) : isSuccess ? (
              /* Success State */
              <div className="text-center space-y-5 py-4" aria-live="polite">
                <CheckCircle2 className="w-12 h-12 text-[#dfff00] mx-auto" aria-hidden="true" />
                <div>
                  <p className="text-sm text-[#f4f4f5] font-medium font-heading uppercase tracking-wide">
                    Password Updated
                  </p>
                  <p className="text-xs text-[#a1a1aa] font-mono mt-1.5 leading-relaxed">
                    Your credentials have been updated successfully. You may now sign in with your new password.
                  </p>
                </div>
                <Link to="/login" className="block">
                  <Button variant="volt" className="w-full">
                    Proceed to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              /* Reset Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
                aria-label="Set new password form"
              >
                {formError && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-xs text-[#ef4444] font-mono"
                  >
                    {formError}
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label htmlFor="reset-password" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    New Password{" "}
                    <span className="text-[#71717a] normal-case">(min. 8 characters)</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                        setFormError("");
                      }}
                      icon={<Lock className="w-4 h-4" />}
                      error={passwordError}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-[18px] text-[#71717a] hover:text-[#a1a1aa] transition-colors p-1"
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                        : <Eye className="w-4 h-4" aria-hidden="true" />
                      }
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reset-confirm" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="reset-confirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmError("");
                        setFormError("");
                      }}
                      icon={<Lock className="w-4 h-4" />}
                      error={confirmError}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-[18px] text-[#71717a] hover:text-[#a1a1aa] transition-colors p-1"
                    >
                      {showConfirm
                        ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                        : <Eye className="w-4 h-4" aria-hidden="true" />
                      }
                    </button>
                  </div>
                </div>

                <Button
                  id="reset-submit"
                  type="submit"
                  variant="volt"
                  size="lg"
                  className="w-full gap-2"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Updating Password..." : "Update Password"}
                </Button>

                <div className="pt-1 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-white transition-colors font-mono"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </SectionReveal>

      </div>
    </div>
  );
}
