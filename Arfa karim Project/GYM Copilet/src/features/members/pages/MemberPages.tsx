import React from 'react';

export const AdminMembersPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Member CRM & Directory</h1>
    <p className="text-xs text-[#9EA3B5]">Lifecycle retention, subscription statuses, and check-in history.</p>
  </div>
);

export const MemberDetailPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Member Profile & Telemetry</h1>
  </div>
);

export const MemberPortalDashboardPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Daily Readiness & Streak</h1>
    <p className="text-xs text-[#9EA3B5]">Personal athlete hub and upcoming session schedule.</p>
  </div>
);

export const MemberMembershipPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Digital Pass & Billing</h1>
  </div>
);

export const MemberProfilePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Athlete Bio & Preferences</h1>
  </div>
);
