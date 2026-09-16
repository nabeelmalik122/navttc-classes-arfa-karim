import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FuzzyText } from "@/components/reactbits";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto shadow-2xl">
        <div className="py-2 flex justify-center">
          <FuzzyText
            text="404"
            fontSize="clamp(4rem, 14vw, 7.5rem)"
            color="#dfff00"
            baseIntensity={0.18}
            hoverIntensity={0.55}
          />
        </div>

        <div className="space-y-2">
          <Badge variant="volt">404 SECTOR NOT FOUND</Badge>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Outfit'] tracking-tight">
            Off-Grid Destination
          </h1>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
            The telemetry coordinate you requested does not exist within the IRONX platform.
          </p>
        </div>

        <Link to="/">
          <Button variant="volt" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Safe Sector
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
