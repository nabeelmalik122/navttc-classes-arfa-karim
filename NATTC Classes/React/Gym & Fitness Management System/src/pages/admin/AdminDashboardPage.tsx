import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Zap
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionReveal } from "@/components/motion/SectionReveal";

const REVENUE_DATA = [
  { month: "Oct", mrr: 84000, members: 1950 },
  { month: "Nov", mrr: 92000, members: 2100 },
  { month: "Dec", mrr: 98000, members: 2240 },
  { month: "Jan", mrr: 114000, members: 2420 },
  { month: "Feb", mrr: 121000, members: 2510 },
  { month: "Mar", mrr: 128500, members: 2580 },
];

const PEAK_HOURS_DATA = [
  { hour: "06:00", count: 85 },
  { hour: "08:00", count: 140 },
  { hour: "10:00", count: 65 },
  { hour: "12:00", count: 110 },
  { hour: "15:00", count: 75 },
  { hour: "17:00", count: 195 },
  { hour: "19:00", count: 180 },
  { hour: "21:00", count: 90 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Executive Command Banner */}
      <SectionReveal>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">SYSTEM COMMAND • ROOT ADMIN</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight">
              Executive Business Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              IRONX Flagship Sanctuary • Seeded Operational Model & Performance Benchmarks
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 z-10 w-full md:w-auto shrink-0">
            <Link to="/admin/classes" className="flex-1 sm:flex-initial">
              <Button
                variant="volt"
                size="sm"
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Master Scheduler</span>
              </Button>
            </Link>
            <Link to="/admin/members" className="flex-1 sm:flex-initial">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap gap-2 bg-[#121217] border-[#1f1f26] hover:bg-[#16161b] hover:border-[#2e2e38] text-[#f4f4f5]"
              >
                <Users className="w-4 h-4 shrink-0 text-[#a1a1aa]" aria-hidden="true" />
                <span>Member Ledger</span>
              </Button>
            </Link>
          </div>
        </div>
      </SectionReveal>

      {/* KPI Cards */}
      <SectionReveal delay={0.05}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#71717a] uppercase tracking-wider">
              Core Performance Telemetry
            </span>
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              SEEDED OPERATIONAL MODEL
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Monthly Recurring (MRR)</span>
                <DollarSign className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">$128,500</p>
              <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> +6.2% vs last month
              </p>
            </Card>

            <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Active Athletes</span>
                <Users className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">2,580</p>
              <p className="text-[11px] text-[#71717a] font-mono mt-1">99.1% Retention rate</p>
            </Card>

            <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Today's Check-ins</span>
                <Activity className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">642</p>
              <p className="text-[11px] text-emerald-400 font-mono mt-1">Peak: 17:00 - 19:30</p>
            </Card>

            <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Arena Occupancy</span>
                <Zap className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">84.6%</p>
              <p className="text-[11px] text-[#71717a] font-mono mt-1">Vault & classes utilization</p>
            </Card>
          </div>
        </div>
      </SectionReveal>

      {/* Charts Grid */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MRR Curve */}
          <div className="lg:col-span-8 rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase font-heading">
                Revenue Growth Trajectory (USD)
              </h3>
              <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
                BENCHMARK MODEL
              </Badge>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dfff00" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#dfff00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f26" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} domain={['dataMin - 10000', 'dataMax + 10000']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0c10",
                      borderColor: "#1f1f26",
                      borderRadius: "12px",
                      color: "#f4f4f5",
                      fontSize: "12px"
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "MRR"]}
                  />
                  <Area type="monotone" dataKey="mrr" stroke="#dfff00" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Facility Traffic */}
          <div className="lg:col-span-4 rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase font-heading">
                Peak Traffic Hours
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono border-[#4f9dff]/40 text-[#4f9dff] bg-[#4f9dff]/10">
                CHECK-INS
              </Badge>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PEAK_HOURS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f26" vertical={false} />
                  <XAxis dataKey="hour" stroke="#71717a" fontSize={10} />
                  <YAxis stroke="#71717a" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0c10",
                      borderColor: "#1f1f26",
                      borderRadius: "12px",
                      color: "#f4f4f5",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="count" fill="#4f9dff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
