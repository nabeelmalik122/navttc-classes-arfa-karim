import { motion } from 'framer-motion';
import { FiPlus, FiDroplet, FiAlertTriangle } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

/**
 * Card component for displaying a single menu item.
 *
 * @param {object} props
 * @param {object} props.item        - MenuItem document from the API
 * @param {boolean} [props.compact]  - Condensed horizontal layout (used in cart, search)
 */
export default function MenuItemCard({ item, compact = false }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 card rounded-sm">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-sm shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-heading text-offwhite text-sm font-semibold truncate">{item.name}</h4>
          <p className="text-gold text-sm font-medium">{formatCurrency(item.price)}</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary p-2 text-sm"
          aria-label={`Add ${item.name} to cart`}
        >
          <FiPlus size={16} />
        </button>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="card rounded-sm overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30
                        transition-all duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            whileHover={{ opacity: 1, scale: 1 }}
            onClick={handleAdd}
            className="opacity-0 group-hover:opacity-100 btn-primary gap-2 text-sm"
            aria-label={`Add ${item.name} to cart`}
          >
            <FiPlus size={16} /> Add to Cart
          </motion.button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.isFeatured && (
            <span className="badge-gold text-[10px]">Chef's Pick</span>
          )}
          {item.isVegetarian && (
            <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
              <FiDroplet size={9} className="inline mr-0.5" />Veg
            </span>
          )}
          {item.isSpicy && (
            <span className="badge bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]">
              <FiAlertTriangle size={9} className="inline mr-0.5" />Spicy
            </span>
          )}
        </div>

        {/* Category pill (bottom right) */}
        <span className="absolute bottom-3 right-3 bg-charcoal/70 backdrop-blur-sm
                         text-offwhite/70 text-[10px] font-medium uppercase tracking-widest
                         px-2.5 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading text-offwhite text-lg font-semibold leading-snug">
            {item.name}
          </h3>
          <span className="text-gold font-semibold text-lg shrink-0">
            {formatCurrency(item.price)}
          </span>
        </div>
        <p className="text-offwhite/55 text-sm leading-relaxed line-clamp-2 mb-4">
          {item.description}
        </p>
        <button
          onClick={handleAdd}
          className="w-full btn-outline text-sm py-2.5 gap-2"
          aria-label={`Add ${item.name} to cart`}
        >
          <FiPlus size={15} /> Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
