import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const UnauthorizedState: React.FC<{ requiredRole?: string }> = ({
  requiredRole = "authorized role"
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-xl bg-[#0d0d11] border border-red-900/50 flex items-center justify-center text-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <ShieldAlert className="w-7 h-7" aria-hidden="true" />
        </div>

        <Badge variant="destructive" dot>RESTRICTED CLEARANCE</Badge>

        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase text-white font-['Outfit'] tracking-tight">
            Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
            Your current credential identity does not possess the requisite security clearance ({requiredRole}) to access this console.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="volt" size="sm" className="gap-2">
              <LogIn className="w-4 h-4" /> Authenticate Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
