import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { formatCurrency, formatDateShort } from '../../utils/format';

const ORDER_STATUSES = ['pending','preparing','ready','delivered','cancelled'];
const STATUS_COLORS = {
  pending:   'badge-gold',
  preparing: 'badge-blue',
  ready:     'badge-green',
  delivered: 'badge-green',
  cancelled: 'badge-red',
};

function OrderRow({ order, onUpdate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="hover:bg-white/3 transition-colors cursor-pointer"
        onClick={() => setExpanded(v => !v)}>
        <td className="py-3 pr-4">
          <p className="text-offwhite text-xs font-mono">{order._id.slice(-8)}</p>
          <p className="text-offwhite/40 text-xs">{formatDateShort(order.createdAt)}</p>
        </td>
        <td className="py-3 pr-4 text-offwhite/70">{order.guestName || order.user?.name || 'Guest'}</td>
        <td className="py-3 pr-4 capitalize text-offwhite/70">{order.type}</td>
        <td className="py-3 pr-4 text-gold font-semibold">{formatCurrency(order.total)}</td>
        <td className="py-3 pr-4">
          <select value={order.status} onClick={e => e.stopPropagation()}
            onChange={e => onUpdate(order._id, e.target.value)}
            className="bg-transparent border border-white/15 rounded-sm text-xs px-2 py-1 text-offwhite/70 cursor-pointer">
            {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-charcoal capitalize">{s}</option>)}
          </select>
        </td>
        <td className="py-3 text-offwhite/30">
          {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <td colSpan={6} className="pb-4 pt-0">
              <div className="bg-white/3 rounded-sm p-4 ml-4">
                <p className="text-xs text-offwhite/40 uppercase tracking-wider mb-2">Items</p>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                    <span className="text-offwhite/70">{item.name} × {item.quantity}</span>
                    <span className="text-offwhite/50">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm mt-2 pt-2 font-semibold">
                  <span className="text-offwhite/60">Total</span>
                  <span className="text-gold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AdminOrders() {
  const [filter, setFilter] = useState('');
  const { data, loading, refetch } = useFetch('/orders', { params: filter ? { status: filter } : {} });
  const orders = data?.data ?? [];

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order updated to ${status}`);
      refetch();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Admin</p>
          <h1 className="font-heading text-3xl text-offwhite">Orders</h1>
        </div>
        <div className="flex gap-2 items-center">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="input-base py-2 bg-charcoal text-sm w-40">
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <button onClick={refetch} className="btn-ghost p-2"><FiRefreshCw size={16} /></button>
        </div>
      </div>
      {loading ? <LoadingSpinner /> : orders.length === 0 ? (
        <div className="text-center py-16 text-offwhite/40">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-offwhite/40 text-xs uppercase tracking-widest">
                {['Order ID','Customer','Type','Total','Status',''].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map(o => <OrderRow key={o._id} order={o} onUpdate={updateStatus} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
