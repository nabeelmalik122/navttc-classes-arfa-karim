import React from 'react';

export const AdminSettingsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Enterprise Configuration</h1>
    <p className="text-xs text-[#9EA3B5]">Branding, Stripe keys, access hardware, and webhooks.</p>
  </div>
);

export const AdminStaffPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Staff Roster & Roles</h1>
  </div>
);
