import React from "react";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)] selection:bg-[#dfff00] selection:text-[#08080a] transition-colors duration-300">
      <PublicNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
      <ScrollToTopButton />
    </div>
  );
};
