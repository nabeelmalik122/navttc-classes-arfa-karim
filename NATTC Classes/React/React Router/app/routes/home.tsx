import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | React Router App" },
    { name: "description", content: "Welcome to our modern React Router application!" },
  ];
}

export default function Home() {
  return (
    <div className="py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          React Router v8 + Vite + Tailwind CSS
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 text-transparent bg-clip-text">
          Welcome to React Router Application
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Exploring modern client & server side routing in React with speed, type-safety, and seamless navigation experiences.
        </p>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl group">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Fast Navigation</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Instant route switching with built-in layout preservation and pre-loading support.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 shadow-xl group">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
            🛡️
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Type Safety</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            First-class TypeScript typegen for route parameters, loaders, actions, and meta tags.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl group">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
            🧩
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Modular Routes</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Clean component structure isolating Home, About, Contact, and Status views effortlessly.
          </p>
        </div>
      </section>
    </div>
  );
}
