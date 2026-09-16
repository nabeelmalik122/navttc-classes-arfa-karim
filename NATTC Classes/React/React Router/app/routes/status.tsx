import type { Route } from "./+types/status";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "System Status | React Router App" },
    { name: "description", content: "Check current system status and services operational metrics." },
  ];
}

export default function Status() {
  const services = [
    { name: "Router Engine", status: "Operational", ping: "12ms", state: "green" },
    { name: "Vite Dev Server / HMR", status: "Operational", ping: "4ms", state: "green" },
    { name: "SSR Hydration", status: "Operational", ping: "18ms", state: "green" },
    { name: "Static Asset Pipeline", status: "Operational", ping: "8ms", state: "green" },
  ];

  return (
    <div className="py-10 max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">System Status</h1>
          <p className="text-slate-400">Live operational metrics and service status.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          All Systems Operational
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <div>
                <h3 className="font-semibold text-white">{service.name}</h3>
                <span className="text-xs text-slate-500">Latency: {service.ping}</span>
              </div>
            </div>
            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
