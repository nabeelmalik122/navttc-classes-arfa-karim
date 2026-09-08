import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, DollarSign, Users, Activity, BarChart2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SectionReveal } from "@/components/motion/SectionReveal";

const RETENTION_DATA = [
  { month: "Sep", rate: 97.8 },
  { month: "Oct", rate: 98.2 },
  { month: "Nov", rate: 98.5 },
  { month: "Dec", rate: 98.9 },
  { month: "Jan", rate: 99.4 },
  { month: "Feb", rate: 99.1 },
];

const TIER_DISTRIBUTION = [
  { name: "Pro Athlete (55%)", value: 1419, color: "#dfff00" },
  { name: "Titan All-Access (30%)", value: 774, color: "#ffffff" },
  { name: "Foundation (15%)", value: 387, color: "#71717a" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">BUSINESS INTELLIGENCE</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Financial & Performance Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Longitudinal benchmark telemetry on membership cohort retention and revenue mix (Seeded Operational Models).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              BENCHMARK TELEMETRY
            </Badge>
            <Badge variant="volt" className="text-[10px] font-mono">
              99.1% RETENTION
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* KPI Highlight Strip */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Benchmark Retention</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">99.1%</div>
            <p className="text-[10px] text-[#71717a] font-mono">Rolling 6-month trailing</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Active Member Cohort</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">2,580</div>
            <p className="text-[10px] text-[#71717a] font-mono">Subscribed athletes</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Primary Volume Tier</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">Pro Athlete</div>
            <p className="text-[10px] text-[#71717a] font-mono">55% of enrolled cohort</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Monthly Churn Floor</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">0.9%</div>
            <p className="text-[10px] text-[#71717a] font-mono">Industry leading baseline</p>
          </div>
        </div>
      </SectionReveal>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Curve */}
        <SectionReveal delay={0.1}>
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase font-heading">
                  Cohort Retention Trajectory (%)
                </h2>
                <p className="text-xs text-[#71717a] font-mono">6-month longitudinal retention rate</p>
              </div>
              <Badge variant="volt" className="text-[10px] font-mono">TRAILING 6 MO</Badge>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RETENTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f26" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={[95, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0c10",
                      borderColor: "#1f1f26",
                      borderRadius: "8px",
                      color: "#f4f4f5",
                      fontSize: "11px",
                      fontFamily: "monospace"
                    }}
                    formatter={(val: any) => [`${val}%`, "Retention Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#dfff00"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#dfff00", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#dfff00" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionReveal>

        {/* Tier Distribution Pie Chart */}
        <SectionReveal delay={0.15}>
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase font-heading">
                  Membership Tier Volume Mix
                </h2>
                <p className="text-xs text-[#71717a] font-mono">Roster breakdown across 2,580 athletes</p>
              </div>
              <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
                TOTAL: 2,580
              </Badge>
            </div>

            <div className="min-h-[280px] sm:h-72 w-full pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full sm:w-1/2 h-48 sm:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TIER_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {TIER_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0c0c10" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0c0c10",
                        borderColor: "#1f1f26",
                        borderRadius: "8px",
                        color: "#f4f4f5",
                        fontSize: "11px",
                        fontFamily: "monospace"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend & Breakdown */}
              <div className="w-full sm:w-1/2 space-y-2.5 font-mono text-xs">
                {TIER_DISTRIBUTION.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#08080a] border border-[#1f1f26]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[#f4f4f5] text-[11px] truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-white text-[11px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* Accessible Structured Retention Table */}
      <SectionReveal delay={0.2}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#1f1f26] flex items-center justify-between bg-[#121217]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Cohort Retention Monthly Ledger
            </h2>
            <span className="text-[10px] font-mono text-[#71717a]">
              Structured numeric telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08080a] text-[#71717a] uppercase border-b border-[#1f1f26]">
                <tr>
                  <th scope="col" className="py-3 px-5">Reporting Month</th>
                  <th scope="col" className="py-3 px-5">Active Cohort Retention</th>
                  <th scope="col" className="py-3 px-5">Monthly Churn</th>
                  <th scope="col" className="py-3 px-5 text-right">Cohort Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f26]">
                {RETENTION_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-[#121217] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">{row.month} 2025/2026</td>
                    <td className="py-3.5 px-5 text-[#dfff00] font-bold">{row.rate}%</td>
                    <td className="py-3.5 px-5 text-[#a1a1aa]">{(100 - row.rate).toFixed(1)}%</td>
                    <td className="py-3.5 px-5 text-right">
                      <Badge variant="success" className="text-[10px] font-mono">EXEMPLARY</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
