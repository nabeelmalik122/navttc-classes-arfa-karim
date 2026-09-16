import React from 'react';

export const AdminDashboardPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Enterprise Command Center</h1>
    <p className="text-xs text-[#9EA3B5]">Real-time MRR, member retention rates, studio occupancy, and check-in trends.</p>
  </div>
);

export const AdminAnalyticsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Deep Telemetry & Predictive Churn</h1>
  </div>
);

export const AdminFinancePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">P&L and Invoicing Pipeline</h1>
  </div>
);

export const TrainerEarningsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Commission & Hours Log</h1>
  </div>
);
