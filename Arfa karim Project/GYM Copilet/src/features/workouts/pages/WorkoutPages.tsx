import React from 'react';

export const TrainerProgramsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Program & Routine Builder</h1>
    <p className="text-xs text-[#9EA3B5]">Design multi-week periodized workouts and assign to clients.</p>
  </div>
);

export const TrainerClientsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Assigned Client Roster</h1>
  </div>
);

export const TrainerNutritionPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold font-display text-white">Macro & Nutrition Planner</h1>
  </div>
);

export const MemberTrackerPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Live Workout Logger</h1>
    <p className="text-xs text-[#9EA3B5]">Log active sets, reps, load, and rest timer.</p>
  </div>
);

export const MemberMetricsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold font-display text-white">Body Composition & 1RM Progression</h1>
  </div>
);
