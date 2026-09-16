import React from 'react';

export const AdminSchedulePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Master Timetable Calendar</h1>
    <p className="text-xs text-[#9EA3B5]">Real-time room allocation, waitlist management, and coach assignments.</p>
  </div>
);

export const MemberClassesPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Class Schedule</h1>
    <p className="text-xs text-[#9EA3B5]">Discover and reserve upcoming studio sessions.</p>
  </div>
);

export const MemberBookingsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">My Reservations</h1>
  </div>
);

export const TrainerSchedulePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Coach Timetable & PT Slots</h1>
  </div>
);
