import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag,
  FiCheckCircle, FiClock, FiPhone, FiUser, FiMail,
  FiAlertCircle, FiMessageCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import api from '../../services/api';

// ── Guest details form ─────────────────────────────────────────────────────────
function GuestForm({ form, setForm, errors }) {
  const ch = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  return (
    <div className="space-y-3 px-6 pb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
        Your Details
      </p>
      {[
        { name: 'guestName',  type: 'text',  placeholder: 'Full Name *',     icon: FiUser  },
        { name: 'guestEmail', type: 'email', placeholder: 'Email Address *', icon: FiMail  },
        { name: 'guestPhone', type: 'tel',   placeholder: 'Phone Number *',  icon: FiPhone },
      ].map(({ name, type, placeholder, icon: Icon }) => (
        <div key={name} className="relative">
          <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite/30 pointer-events-none" />
          <input
            name={name} type={type} value={form[name]} onChange={ch}
            placeholder={placeholder}
            className={`w-full bg-white/5 border text-offwhite text-sm placeholder-offwhite/30
                        pl-9 pr-3 py-2.5 rounded-sm focus:outline-none focus:border-gold
                        transition-colors
                        ${errors[name] ? 'border-red-400' : 'border-white/15'}`}
          />
          {errors[name] && (
            <p className="text-[11px] text-red-400 mt-0.5 flex items-center gap-1">
              <FiAlertCircle size={10} />{errors[name]}
            </p>
          )}
        </div>
      ))}
      <div>
        <select
          name="type"
          value={form.type}
          onChange={ch}
          className="w-full bg-[#1a1a1a] border border-white/15 text-offwhite/70 text-sm
                     px-3 py-2.5 rounded-sm focus:outline-none focus:border-gold
                     transition-colors appearance-none cursor-pointer"
        >
          <option value="dine-in">🍽️  Dine In</option>
          <option value="takeaway">🥡 Takeaway</option>
          <option value="delivery">🛵 Delivery</option>
        </select>
      </div>
      {form.type === 'delivery' && (
        <input
          name="deliveryAddress"
          type="text"
          value={form.deliveryAddress}
          onChange={ch}
          placeholder="Delivery Address *"
          className="w-full bg-white/5 border border-white/15 text-offwhite text-sm
                     placeholder-offwhite/30 px-3 py-2.5 rounded-sm focus:outline-none
                     focus:border-gold transition-colors"
        />
      )}
      <textarea
        name="notes"
        value={form.notes}
        onChange={ch}
        placeholder="Special instructions (optional)"
        rows={2}
        className="w-full bg-white/5 border border-white/15 text-offwhite text-sm
                   placeholder-offwhite/30 px-3 py-2.5 rounded-sm focus:outline-none
                   focus:border-gold transition-colors resize-none"
      />
    </div>
  );
}

// ── Order success screen ───────────────────────────────────────────────────────
function OrderSuccess({ order, guestName, onClose }) {
  const orderId = order?._id?.slice(-6).toUpperCase() ?? '------';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <h2 className="font-heading text-offwhite text-lg">Order Placed!</h2>
        <button onClick={onClose} className="btn-ghost p-2" aria-label="Close">
          <FiX size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center gap-5 text-center">

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
          className="w-20 h-20 bg-gold/15 border-2 border-gold/40 rounded-full
                     flex items-center justify-center"
        >
          <FiCheckCircle size={36} className="text-gold" />
        </motion.div>

        {/* Thank you */}
        <div>
          <p className="font-heading text-2xl text-offwhite mb-1">
            Thank You, {guestName?.split(' ')[0]}!
          </p>
          <p className="text-offwhite/50 text-sm">
            Your order <span className="text-gold font-semibold">#{orderId}</span> has been received.
          </p>
        </div>

        {/* 30-min timer banner */}
        <div className="w-full bg-gold/10 border border-gold/25 rounded-sm px-4 py-4">
          <div className="flex items-center gap-3 justify-center mb-2">
            <FiClock size={20} className="text-gold" />
            <p className="font-heading text-offwhite text-lg">~30 Minutes</p>
          </div>
          <p className="text-offwhite/60 text-sm leading-relaxed">
            Please wait approximately <strong className="text-gold">30 minutes</strong> — your order is being prepared and will be ready soon.
          </p>
        </div>

        {/* Order summary */}
        {order && (
          <div className="w-full bg-white/4 border border-white/10 rounded-sm p-4 text-left space-y-3">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest">Order Summary</p>

            {/* Items */}
            <div className="space-y-1.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-offwhite/70">{item.name} × {item.quantity}</span>
                  <span className="text-offwhite/50">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-3 space-y-1">
              <div className="flex justify-between text-xs text-offwhite/45">
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-offwhite/45">
                <span>Tax (8%)</span><span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-offwhite pt-1">
                <span>Total</span>
                <span className="text-gold">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Type + ID */}
            <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-offwhite/35">Order Type</span>
                <p className="text-offwhite capitalize mt-0.5">{order.type}</p>
              </div>
              <div>
                <span className="text-offwhite/35">Order ID</span>
                <p className="text-gold font-mono mt-0.5">#{orderId}</p>
              </div>
              {order.guestName && (
                <div>
                  <span className="text-offwhite/35">Name</span>
                  <p className="text-offwhite mt-0.5">{order.guestName}</p>
                </div>
              )}
              {order.guestEmail && (
                <div>
                  <span className="text-offwhite/35">Email</span>
                  <p className="text-offwhite mt-0.5 truncate">{order.guestEmail}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp for updates */}
        <a
          href="https://wa.me/923079009095?text=Hi%2C%20I%20just%20placed%20an%20order%20and%20would%20like%20an%20update."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-green-400 border border-green-500/30
                     px-4 py-2.5 rounded-sm hover:bg-green-500/10 transition-colors w-full justify-center"
        >
          <FiMessageCircle size={15} /> Track via WhatsApp
        </a>

        <p className="text-offwhite/30 text-xs">
          Questions? Call us on{' '}
          <a href="tel:+923209880120" className="text-gold hover:underline">0320-9880120</a>
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <button onClick={onClose} className="btn-primary w-full py-3">
          Continue Browsing
        </button>
      </div>
    </motion.div>
  );
}

// ── Main CartDrawer ────────────────────────────────────────────────────────────
const EMPTY_GUEST = { guestName: '', guestEmail: '', guestPhone: '', type: 'dine-in', deliveryAddress: '', notes: '' };

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, subtotal, tax, total, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep]           = useState('cart');   // 'cart' | 'details' | 'success'
  const [guestForm, setGuestForm] = useState(EMPTY_GUEST);
  const [formErrors, setFormErrors] = useState({});
  const [placing, setPlacing]     = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const guestName = isAuthenticated
    ? user?.name
    : guestForm.guestName;

  // Validate guest form
  const validateGuest = () => {
    if (isAuthenticated) return {};
    const e = {};
    if (!guestForm.guestName.trim())  e.guestName  = 'Name is required';
    if (!guestForm.guestEmail.trim()) e.guestEmail = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(guestForm.guestEmail)) e.guestEmail = 'Valid email required';
    if (!guestForm.guestPhone.trim()) e.guestPhone = 'Phone is required';
    if (guestForm.type === 'delivery' && !guestForm.deliveryAddress.trim())
      e.deliveryAddress = 'Delivery address is required';
    return e;
  };

  const handleProceed = () => {
    if (isAuthenticated) {
      // Logged-in users skip guest form
      handlePlaceOrder();
    } else {
      setStep('details');
    }
  };

  const handlePlaceOrder = async () => {
    const errs = validateGuest();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setPlacing(true);
    try {
      const payload = {
        items: items.map(i => ({ menuItem: i.menuItem, quantity: i.quantity })),
        type: guestForm.type || 'dine-in',
        notes: guestForm.notes || undefined,
      };

      if (!isAuthenticated) {
        payload.guestName  = guestForm.guestName;
        payload.guestEmail = guestForm.guestEmail;
      }

      if (guestForm.type === 'delivery' && guestForm.deliveryAddress) {
        payload.deliveryAddress = { street: guestForm.deliveryAddress };
      }

      const { data } = await api.post('/orders', payload);
      setPlacedOrder(data.data);
      setStep('success');
      clearCart();
      toast.success('🎉 Order placed successfully!', { duration: 4000 });
    } catch (err) {
      toast.error(err.message || 'Could not place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(() => {
      setStep('cart');
      setGuestForm(EMPTY_GUEST);
      setFormErrors({});
      setPlacedOrder(null);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1f1f1f]
                       border-l border-white/10 z-[70] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <AnimatePresence mode="wait">

              {/* ── SUCCESS SCREEN ── */}
              {step === 'success' && (
                <motion.div key="success" className="flex flex-col h-full"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <OrderSuccess order={placedOrder} guestName={guestName} onClose={handleClose} />
                </motion.div>
              )}

              {/* ── GUEST DETAILS STEP ── */}
              {step === 'details' && (
                <motion.div key="details" className="flex flex-col h-full"
                  initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                    <div>
                      <button onClick={() => setStep('cart')}
                        className="text-xs text-offwhite/40 hover:text-gold mb-1 transition-colors">
                        ← Back to cart
                      </button>
                      <h2 className="font-heading text-offwhite text-lg">Your Details</h2>
                    </div>
                    <button onClick={handleClose} className="btn-ghost p-2"><FiX size={20} /></button>
                  </div>

                  {/* Form */}
                  <div className="flex-1 overflow-y-auto pt-4">
                    <GuestForm form={guestForm} setForm={setGuestForm} errors={formErrors} />
                  </div>

                  {/* Footer */}
                  <div className="border-t border-white/10 px-6 py-4 space-y-2 shrink-0">
                    <div className="flex justify-between text-sm font-semibold text-offwhite mb-3">
                      <span>Total to Pay</span>
                      <span className="text-gold">{formatCurrency(total)}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="btn-primary w-full py-3.5 gap-2"
                    >
                      {placing ? (
                        <><div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> Placing Order…</>
                      ) : (
                        <><FiCheckCircle size={16} /> Confirm Order</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── CART SCREEN ── */}
              {step === 'cart' && (
                <motion.div key="cart" className="flex flex-col h-full"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                      <FiShoppingBag size={20} className="text-gold" />
                      <h2 className="font-heading text-offwhite text-lg">
                        Your Order
                        {itemCount > 0 && (
                          <span className="ml-2 text-sm font-body text-offwhite/50">
                            ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                          </span>
                        )}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {items.length > 0 && (
                        <button onClick={clearCart}
                          className="text-xs text-offwhite/40 hover:text-red-400 transition-colors px-2 py-1">
                          Clear all
                        </button>
                      )}
                      <button onClick={handleClose} className="btn-ghost p-2" aria-label="Close cart">
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                          <FiShoppingBag size={28} className="text-offwhite/25" />
                        </div>
                        <div>
                          <p className="text-offwhite/60 font-medium mb-1">Your cart is empty</p>
                          <p className="text-offwhite/35 text-sm">Browse our menu and add something delicious</p>
                        </div>
                        <Link to="/menu" onClick={handleClose} className="btn-primary text-sm mt-2">View Menu</Link>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        <AnimatePresence initial={false}>
                          {items.map((item) => (
                            <motion.li key={item.menuItem} layout
                              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                              className="flex items-center gap-3 p-3 bg-white/5 rounded-sm border border-white/10">
                              <img src={item.image} alt={item.name}
                                className="w-14 h-14 object-cover rounded-sm shrink-0" loading="lazy" />
                              <div className="flex-1 min-w-0">
                                <p className="text-offwhite text-sm font-medium truncate">{item.name}</p>
                                <p className="text-gold text-sm">{formatCurrency(item.price)}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <button onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                                    className="w-6 h-6 border border-white/20 rounded-sm flex items-center
                                               justify-center text-offwhite/60 hover:border-gold hover:text-gold transition-colors">
                                    <FiMinus size={10} />
                                  </button>
                                  <span className="text-offwhite text-sm w-5 text-center font-medium">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                                    className="w-6 h-6 border border-white/20 rounded-sm flex items-center
                                               justify-center text-offwhite/60 hover:border-gold hover:text-gold transition-colors">
                                    <FiPlus size={10} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="text-offwhite text-sm font-semibold">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                                <button onClick={() => removeItem(item.menuItem)}
                                  className="text-offwhite/25 hover:text-red-400 transition-colors">
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </div>

                  {/* Footer totals + CTA */}
                  {items.length > 0 && (
                    <div className="border-t border-white/10 px-6 py-4 space-y-3 shrink-0">
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-offwhite/60">
                          <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-offwhite/60">
                          <span>Tax (8%)</span><span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between text-offwhite font-semibold text-base
                                        border-t border-white/10 pt-2">
                          <span>Total</span>
                          <span className="text-gold">{formatCurrency(total)}</span>
                        </div>
                      </div>
                      <button onClick={handleProceed} className="btn-primary w-full py-3 gap-2">
                        <FiCheckCircle size={16} />
                        {isAuthenticated ? 'Place Order' : 'Enter Details & Order'}
                      </button>
                      <button onClick={handleClose}
                        className="w-full text-center text-xs text-offwhite/35 hover:text-offwhite/60 transition-colors py-1">
                        Continue browsing
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.aside>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
