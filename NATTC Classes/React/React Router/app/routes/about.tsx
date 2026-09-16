import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About | React Router App" },
    { name: "description", content: "Learn more about our React Router project structure." },
  ];
}

export default function About() {
  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">About This Application</h1>
        <p className="text-slate-400">
          Learn how React Router structures components, routing config, and framework features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-semibold text-indigo-400">📁 Folder Structure</h2>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li><code className="text-indigo-300">app/routes.ts</code> — Central route config file</li>
            <li><code className="text-indigo-300">app/routes/</code> — Route components (Pages)</li>
            <li><code className="text-indigo-300">app/components/</code> — Reusable UI components</li>
            <li><code className="text-indigo-300">app/root.tsx</code> — Root layout & HTML shell</li>
          </ul>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-semibold text-purple-400">⚡ Key Highlights</h2>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li>Vite high-speed HMR development server</li>
            <li>Nested routing with layout outlets</li>
            <li>Fully dynamic client and server loader capabilities</li>
            <li>Styled with utility-first Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
