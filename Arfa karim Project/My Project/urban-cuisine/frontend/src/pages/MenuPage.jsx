import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import SectionHeader from '../components/ui/SectionHeader';
import MenuItemCard from '../components/ui/MenuItemCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useFetch from '../hooks/useFetch';

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all',      label: 'All Dishes',  emoji: '🍽️' },
  { key: 'starters', label: 'Starters',   emoji: '🥗' },
  { key: 'mains',    label: 'Mains',       emoji: '🥩' },
  { key: 'desserts', label: 'Desserts',    emoji: '🍮' },
  { key: 'drinks',   label: 'Drinks',      emoji: '🍷' },
  { key: 'specials', label: 'Specials',    emoji: '⭐' },
];

// ── Static placeholder data (shown when API is not yet seeded) ─────────────────
const PLACEHOLDER_ITEMS = [
  // Starters
  {
    _id: 's1', name: 'Burrata & Heirloom Tomato', category: 'starters',
    description: 'Creamy burrata, heirloom tomatoes, basil oil, aged balsamic, and toasted sourdough.',
    price: 18, isFeatured: false, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&auto=format&fit=crop',
  },
  {
    _id: 's2', name: 'Seared Scallops', category: 'starters',
    description: 'Hand-dived scallops, cauliflower purée, crispy pancetta, micro herbs, truffle oil.',
    price: 24, isFeatured: true, isVegetarian: false, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&auto=format&fit=crop',
  },
  {
    _id: 's3', name: 'Spiced Lamb Kofta', category: 'starters',
    description: 'Ground lamb with harissa, tzatziki, pomegranate molasses, and warm flatbread.',
    price: 21, isFeatured: false, isVegetarian: false, isSpicy: true,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop',
  },
  {
    _id: 's4', name: 'Wild Mushroom Soup', category: 'starters',
    description: 'Velvety blend of porcini, shiitake, and chanterelle with truffle cream and chives.',
    price: 16, isFeatured: false, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop',
  },

  // Mains
  {
    _id: 'm1', name: 'Pan-Seared Salmon', category: 'mains',
    description: 'Atlantic salmon fillet, lemon beurre blanc, capers, wilted baby spinach.',
    price: 38, isFeatured: true, isVegetarian: false, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop',
  },
  {
    _id: 'm2', name: 'Truffle Risotto', category: 'mains',
    description: 'Carnaroli rice, black truffle, aged Parmigiano-Reggiano, fresh thyme, olive oil.',
    price: 34, isFeatured: true, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop',
  },
  {
    _id: 'm3', name: 'Dry-Aged Ribeye', category: 'mains',
    description: '28-day dry-aged 300g ribeye, bone marrow butter, roasted garlic, triple-cooked chips.',
    price: 58, isFeatured: true, isVegetarian: false, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop',
  },
  {
    _id: 'm4', name: 'Harissa Chicken', category: 'mains',
    description: 'Free-range chicken breast, harissa glaze, roasted root vegetables, herbed couscous.',
    price: 32, isFeatured: false, isVegetarian: false, isSpicy: true,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop',
  },
  {
    _id: 'm5', name: 'Lobster Linguine', category: 'mains',
    description: 'Half Boston lobster, hand-rolled linguine, cherry tomato bisque, tarragon, chilli.',
    price: 52, isFeatured: false, isVegetarian: false, isSpicy: true,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&auto=format&fit=crop',
  },

  // Desserts
  {
    _id: 'd1', name: 'Chocolate Fondant', category: 'desserts',
    description: 'Warm dark chocolate pudding with a molten centre, vanilla bean ice cream.',
    price: 18, isFeatured: true, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop',
  },
  {
    _id: 'd2', name: 'Crème Brûlée', category: 'desserts',
    description: 'Classic Madagascan vanilla custard, caramelised sugar crust, fresh berries.',
    price: 14, isFeatured: false, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&auto=format&fit=crop',
  },
  {
    _id: 'd3', name: 'Seasonal Fruit Tart', category: 'desserts',
    description: 'Crisp pastry shell, vanilla cream, glazed seasonal fruits, toasted almond flakes.',
    price: 15, isFeatured: false, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop',
  },

  // Drinks
  {
    _id: 'dr1', name: 'Signature Negroni', category: 'drinks',
    description: 'Urban Cuisine twist — house-infused gin, Campari, sweet vermouth, orange zest.',
    price: 16, isFeatured: true, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&auto=format&fit=crop',
  },
  {
    _id: 'dr2', name: 'Reserve Burgundy', category: 'drinks',
    description: 'Hand-selected Pinot Noir from Côte de Nuits — earthy, silky, with dark cherry notes.',
    price: 22, isFeatured: false, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
  },
  {
    _id: 'dr3', name: 'Sparkling Lemonade', category: 'drinks',
    description: 'House-pressed lemon, elderflower, fresh mint, sparkling water. Non-alcoholic.',
    price: 9, isFeatured: false, isVegetarian: true, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop',
  },

  // Specials
  {
    _id: 'sp1', name: "Chef's Tasting Menu", category: 'specials',
    description: 'Seven-course journey curated daily by Chef Marco. Ask your server for tonight\'s selection.',
    price: 145, isFeatured: true, isVegetarian: false, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop',
  },
  {
    _id: 'sp2', name: 'Sunday Roast for Two', category: 'specials',
    description: 'Slow-roasted prime rib, roasted potatoes, seasonal vegetables, Yorkshire pudding, jus.',
    price: 89, isFeatured: true, isVegetarian: false, isSpicy: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
  },
];

// ── Animation variants ─────────────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// ── Page component ─────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [vegOnly, setVegOnly]               = useState(false);
  const [spicyOnly, setSpicyOnly]           = useState(false);
  const [showFilters, setShowFilters]       = useState(false);

  // Fetch from API — falls back to placeholders if empty / loading
  const { data, loading, error } = useFetch('/menu');
  const apiItems = data?.data ?? [];
  const sourceItems = apiItems.length > 0 ? apiItems : PLACEHOLDER_ITEMS;

  // Filter logic
  const filtered = useMemo(() => {
    return sourceItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesVeg   = !vegOnly   || item.isVegetarian;
      const matchesSpicy = !spicyOnly || item.isSpicy;
      return matchesCategory && matchesSearch && matchesVeg && matchesSpicy;
    });
  }, [sourceItems, activeCategory, search, vegOnly, spicyOnly]);

  // Count per category (for badges)
  const countByCategory = useMemo(() => {
    const counts = { all: sourceItems.length };
    CATEGORIES.slice(1).forEach(({ key }) => {
      counts[key] = sourceItems.filter((i) => i.category === key).length;
    });
    return counts;
  }, [sourceItems]);

  const hasActiveFilter = search || vegOnly || spicyOnly || activeCategory !== 'all';

  const clearFilters = () => {
    setSearch('');
    setVegOnly(false);
    setSpicyOnly(false);
    setActiveCategory('all');
  };

  return (
    <PageLayout>

      {/* ── Page hero ─────────────────────────────────────────────── */}
      <section className="relative h-64 sm:h-80 flex items-end overflow-hidden" aria-label="Menu hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80"
            alt="Beautifully plated dish"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 overlay-dark" />
        </div>
        <div className="relative z-10 container-main px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2"
          >
            Culinary Excellence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl text-offwhite"
          >
            Our <span className="text-gold italic">Menu</span>
          </motion.h1>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────── */}
      <section className="section-pad" aria-label="Menu items">
        <div className="container-main px-4 sm:px-6 lg:px-8">

          {/* Search + filter toggle row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search bar */}
            <div className="relative flex-1">
              <FiSearch
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-offwhite/35 pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search dishes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-10 pr-10"
                aria-label="Search menu items"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-offwhite/40 hover:text-offwhite"
                  aria-label="Clear search"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            {/* Filter toggle (mobile-friendly) */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-sm text-sm font-medium
                          transition-colors duration-200
                          ${showFilters || vegOnly || spicyOnly
                            ? 'border-gold text-gold bg-gold/10'
                            : 'border-white/20 text-offwhite/60 hover:border-white/40 hover:text-offwhite'
                          }`}
              aria-expanded={showFilters}
            >
              <FiFilter size={15} />
              Filters
              {(vegOnly || spicyOnly) && (
                <span className="w-2 h-2 bg-gold rounded-full" />
              )}
            </button>

            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 text-sm text-red-400
                           hover:text-red-300 transition-colors whitespace-nowrap"
              >
                <FiX size={14} /> Clear all
              </button>
            )}
          </div>

          {/* Expandable dietary filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 pb-5 pt-1">
                  {[
                    { key: 'veg',   label: '🌿 Vegetarian', active: vegOnly,   toggle: () => setVegOnly((v) => !v)   },
                    { key: 'spicy', label: '🌶️ Spicy',       active: spicyOnly, toggle: () => setSpicyOnly((v) => !v) },
                  ].map(({ key, label, active, toggle }) => (
                    <button
                      key={key}
                      onClick={toggle}
                      className={`px-4 py-2 rounded-full text-sm border transition-all duration-200
                                  ${active
                                    ? 'bg-gold text-charcoal border-gold font-semibold'
                                    : 'border-white/20 text-offwhite/60 hover:border-white/40 hover:text-offwhite'
                                  }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category tabs */}
          <div
            className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide"
            role="tablist"
            aria-label="Menu categories"
          >
            {CATEGORIES.map(({ key, label, emoji }) => {
              const count = countByCategory[key] ?? 0;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium
                              whitespace-nowrap transition-all duration-200 shrink-0 border
                              ${isActive
                                ? 'bg-gold text-charcoal border-gold shadow-lg shadow-gold/20'
                                : 'border-white/15 text-offwhite/60 hover:border-white/30 hover:text-offwhite'
                              }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full
                                ${isActive ? 'bg-charcoal/20' : 'bg-white/10'}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-offwhite/40 text-sm">
              {loading
                ? 'Loading menu…'
                : `${filtered.length} ${filtered.length === 1 ? 'dish' : 'dishes'}`
              }
              {activeCategory !== 'all' && (
                <span className="text-gold ml-1">
                  in {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                </span>
              )}
            </p>
            {apiItems.length === 0 && !loading && (
              <span className="badge-gold text-[10px]">Demo Data</span>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-16 text-offwhite/40">
              <p className="mb-2">Could not load menu items.</p>
              <p className="text-sm">Make sure the backend is running.</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 flex flex-col items-center gap-4"
            >
              <p className="text-5xl">🍽️</p>
              <p className="text-offwhite/60 text-lg font-heading">No dishes found</p>
              <p className="text-offwhite/35 text-sm">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="btn-outline text-sm mt-2">
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + search + vegOnly + spicyOnly}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((item) => (
                <motion.div key={item._id} variants={cardVariants} layout>
                  <MenuItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Allergen note ──────────────────────────────────────────── */}
      <section className="pb-16 pt-0" aria-label="Allergen information">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="border border-white/10 rounded-sm p-5 text-sm text-offwhite/40 leading-relaxed">
            <strong className="text-offwhite/60">Allergen information:</strong> Some dishes may
            contain allergens including nuts, gluten, dairy, shellfish, and eggs. Please inform your
            server of any dietary requirements or allergies before ordering. Vegetarian dishes are
            marked 🌿 and spicy dishes are marked 🌶️.
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
