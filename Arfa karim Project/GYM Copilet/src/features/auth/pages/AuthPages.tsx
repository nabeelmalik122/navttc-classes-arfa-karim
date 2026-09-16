import React from 'react';

export const LoginPage: React.FC = () => (
  <div className="p-8 rounded-2xl bg-[#0D0E12] border border-[#232533]">
    <h2 className="text-xl font-bold font-display text-white mb-2">Sign In to GymOS</h2>
    <p className="text-xs text-[#9EA3B5] mb-6">Enter enterprise credentials to access dashboard.</p>
  </div>
);

export const RegisterPage: React.FC = () => (
  <div className="p-8 rounded-2xl bg-[#0D0E12] border border-[#232533]">
    <h2 className="text-xl font-bold font-display text-white mb-2">Register Enterprise Tenant</h2>
    <p className="text-xs text-[#9EA3B5] mb-6">Provision a new multi-tenant fitness club workspace.</p>
  </div>
);

export const ForgotPasswordPage: React.FC = () => (
  <div className="p-8 rounded-2xl bg-[#0D0E12] border border-[#232533]">
    <h2 className="text-xl font-bold font-display text-white mb-2">Password Recovery</h2>
    <p className="text-xs text-[#9EA3B5] mb-6">Receive a secure magic recovery link via email.</p>
  </div>
);

export const OnboardingPage: React.FC = () => (
  <div className="p-8 rounded-2xl bg-[#0D0E12] border border-[#232533]">
    <h2 className="text-xl font-bold font-display text-white mb-2">Tenant Onboarding Wizard</h2>
    <p className="text-xs text-[#9EA3B5] mb-6">Setup branch details, brand tokens, and payment gateways.</p>
  </div>
);
