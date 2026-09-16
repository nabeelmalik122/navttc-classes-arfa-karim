import { NavLink } from "react-router";

export function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Status", path: "/status" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-400 hover:text-indigo-300 transition-colors">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">ReactRouter</span>
          <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">v8</span>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
