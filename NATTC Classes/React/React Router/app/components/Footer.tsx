export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p>© {new Date().getFullYear()} React Router App. Built with React Router v8 & Vite.</p>
        <div className="flex items-center gap-4">
          <a href="https://reactrouter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">Docs</a>
          <a href="https://github.com/remix-run/react-router" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
