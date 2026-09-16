export default function Navbar() {
  return (
    <header className="bg-[#1E3A8A] text-white px-8 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[#FBBF24] text-2xl">🛍️</span>
        <h1 className="text-2xl font-bold tracking-wide">
          Shop<span className="text-[#FBBF24]">Ease</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 font-medium">
        <a href="#" className="border-b-2 border-[#FBBF24] pb-1 text-white">
          Home
        </a>
        <a href="#" className="hover:text-[#FBBF24] transition-colors">
          Products
        </a>
        <a href="#" className="hover:text-[#FBBF24] transition-colors">
          Categories
        </a>
        <a href="#" className="hover:text-[#FBBF24] transition-colors">
          About
        </a>
        <a href="#" className="hover:text-[#FBBF24] transition-colors">
          Contact
        </a>
      </nav>

      {/* Action Icons */}
      <div className="flex items-center gap-6">
        <button className="hover:text-[#FBBF24] transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="hover:text-[#FBBF24] transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
        <div className="relative cursor-pointer">
          <svg
            className="w-6 h-6 hover:text-[#FBBF24] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="absolute -top-2 -right-2 bg-[#FBBF24] text-[#111827] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>
      </div>
    </header>
  );
}
