import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiCheck, FiX, FiTrash2, FiRefreshCw,
  FiChevronDown, FiChevronUp, FiUser, FiPhone,
  FiMail, FiUsers, FiCalendar, FiClock, FiMessageSquare,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { formatDate } from '../../utils/format';

const STATUS_COLORS = {
  pending:   'badge-gold',
  confirmed: 'badge-green',
  cancelled: 'badge-red',
  completed: 'badge-blue',
};

const STATUS_TABS = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

// ── Expanded detail row ────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} className="text-gold mt-0.5 shrink-0" />
      <div>
        <span className="text-offwhite/40 text-xs">{label}: </span>
        <span className="text-offwhite/80 text-xs">{value}</span>
      </div>
    </div>
  );
}

// ── Single reservation row ─────────────────────────────────────────────────────
function ReservationRow({ reservation: r, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [acting, setActing]     = useState(false);

  const isPending   = r.status === 'pending';
  const isConfirmed = r.status === 'confirmed';
  const canConfirm  = isPending;
  const canCancel   = isPending || isConfirmed;
  const canComplete = isConfirmed;

  const act = async (status) => {
    setActing(true);
    await onUpdate(r._id, status);
    setActing(false);
  };

  return (
    <>
      {/* Main row */}
      <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Guest name */}
        <td className="py-3 pr-3 pl-2">
          <p className="text-offwhite text-sm font-medium">{r.name}</p>
          <p className="text-offwhite/40 text-xs truncate max-w-[140px]">{r.email}</p>
        </td>

        {/* Date */}
        <td className="py-3 pr-3 text-offwhite/70 text-sm whitespace-nowrap">
          {new Date(r.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
        </td>

        {/* Time */}
        <td className="py-3 pr-3 text-offwhite/70 text-sm">{r.time}</td>

        {/* Guests */}
        <td className="py-3 pr-3 text-center">
          <span className="text-offwhite/70 text-sm">{r.guests}</span>
        </td>

        {/* Status badge */}
        <td className="py-3 pr-3">
          <span className={`${STATUS_COLORS[r.status] ?? 'badge-gold'} capitalize`}>
            {r.status}
          </span>
        </td>

        {/* Action buttons */}
        <td className="py-3 pr-2">
          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
            {/* CONFIRM */}
            {canConfirm && (
              <button
                disabled={acting}
                onClick={() => act('confirmed')}
                title="Confirm reservation"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold
                           bg-emerald-500/15 text-emerald-400 border border-emerald-500/30
                           rounded-sm hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                           transition-all duration-200 disabled:opacity-50"
              >
                <FiCheck size={12} /> Confirm
              </button>
            )}

            {/* COMPLETE */}
            {canComplete && (
              <button
                disabled={acting}
                onClick={() => act('completed')}
                title="Mark as completed"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold
                           bg-blue-500/15 text-blue-400 border border-blue-500/30
                           rounded-sm hover:bg-blue-500 hover:text-white hover:border-blue-500
                           transition-all duration-200 disabled:opacity-50"
              >
                <FiCheck size={12} /> Complete
              </button>
            )}

            {/* CANCEL */}
            {canCancel && (
              <button
                disabled={acting}
                onClick={() => act('cancelled')}
                title="Cancel reservation"
                className="p-1.5 text-red-400 hover:bg-red-400/15 rounded-sm transition-colors disabled:opacity-50"
              >
                <FiX size={14} />
              </button>
            )}

            {/* DELETE */}
            <button
              disabled={acting}
              onClick={() => onDelete(r._id)}
              title="Delete reservation"
              className="p-1.5 text-offwhite/25 hover:text-red-400 hover:bg-red-400/10
                         rounded-sm transition-colors disabled:opacity-50"
            >
              <FiTrash2 size={14} />
            </button>

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-1.5 text-offwhite/30 hover:text-gold transition-colors"
              title="View details"
            >
              {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>
          </div>
        </td>
      </motion.tr>

      {/* Expanded details panel */}
      <AnimatePresence>
        {expanded && (
          <motion.tr
            key={`${r._id}-detail`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <td colSpan={6} className="pb-4 px-2">
              <div className="bg-gold/5 border border-gold/15 rounded-sm p-4 ml-2 grid
                              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                {/* Guest info */}
                <div className="space-y-2">
                  <p className="text-gold text-[10px] font-semibold uppercase tracking-widest mb-2">
                    Guest Details
                  </p>
                  <DetailRow icon={FiUser}     label="Name"     value={r.name} />
                  <DetailRow icon={FiMail}     label="Email"    value={r.email} />
                  <DetailRow icon={FiPhone}    label="Phone"    value={r.phone} />
                  <DetailRow icon={FiUsers}    label="Guests"   value={`${r.guests} ${r.guests === 1 ? 'person' : 'people'}`} />
                </div>

                {/* Booking info */}
                <div className="space-y-2">
                  <p className="text-gold text-[10px] font-semibold uppercase tracking-widest mb-2">
                    Booking Details
                  </p>
                  <DetailRow icon={FiCalendar} label="Date"     value={formatDate(r.date)} />
                  <DetailRow icon={FiClock}    label="Time"     value={r.time} />
                  <DetailRow icon={FiUser}     label="Occasion" value={r.occasion !== 'none' ? r.occasion : null} />
                  {r.tableNumber && (
                    <DetailRow icon={FiUsers}  label="Table #"  value={String(r.tableNumber)} />
                  )}
                </div>

                {/* Special requests */}
                {r.specialRequests && (
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <p className="text-gold text-[10px] font-semibold uppercase tracking-widest mb-2">
                      Special Requests
                    </p>
                    <div className="flex items-start gap-2">
                      <FiMessageSquare size={13} className="text-gold mt-0.5 shrink-0" />
                      <p className="text-offwhite/70 text-xs leading-relaxed italic">
                        "{r.specialRequests}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick action buttons inside detail (duplicate for convenience) */}
                <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-white/10
                                flex flex-wrap gap-2">
                  <p className="w-full text-offwhite/30 text-xs mb-1">Quick Actions:</p>
                  {canConfirm && (
                    <button onClick={() => act('confirmed')} disabled={acting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30
                                 rounded-sm hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50">
                      <FiCheck size={12} /> Confirm Reservation
                    </button>
                  )}
                  {canComplete && (
                    <button onClick={() => act('completed')} disabled={acting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                 bg-blue-500/15 text-blue-400 border border-blue-500/30
                                 rounded-sm hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50">
                      <FiCheck size={12} /> Mark Completed
                    </button>
                  )}
                  {canCancel && (
                    <button onClick={() => act('cancelled')} disabled={acting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                 bg-red-500/15 text-red-400 border border-red-500/30
                                 rounded-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
                      <FiX size={12} /> Cancel
                    </button>
                  )}
                  {/* WhatsApp guest directly */}
                  {r.phone && (
                    <a
                      href={`https://wa.me/${r.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(r.name)}%2C%20your%20reservation%20at%20Urban%20Cuisine%20on%20${encodeURIComponent(new Date(r.date).toDateString())}%20at%20${encodeURIComponent(r.time)}%20has%20been%20confirmed!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                 bg-green-500/15 text-green-400 border border-green-500/30
                                 rounded-sm hover:bg-green-500 hover:text-white transition-all"
                    >
                      💬 WhatsApp Guest
                    </a>
                  )}
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AdminReservations() {
  const [activeTab, setActiveTab] = useState('all');
  const { data, loading, refetch } = useFetch(
    '/reservations',
    { params: activeTab !== 'all' ? { status: activeTab } : {} }
  );
  const reservations = data?.data ?? [];

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      toast.success(
        status === 'confirmed' ? '✅ Reservation confirmed!' :
        status === 'cancelled' ? '❌ Reservation cancelled' :
        status === 'completed' ? '🎉 Marked as completed' :
        'Reservation updated',
        { duration: 3000 }
      );
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not update reservation');
    }
  };

  const deleteRes = async (id) => {
    if (!window.confirm('Permanently delete this reservation?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      toast.success('Reservation deleted');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not delete');
    }
  };

  // Counts per tab
  const counts = reservations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Admin</p>
          <h1 className="font-heading text-3xl text-offwhite">Reservations</h1>
        </div>
        <button onClick={refetch}
          className="flex items-center gap-2 btn-ghost text-sm border border-white/15
                     px-3 py-2 rounded-sm hover:border-gold transition-colors">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {STATUS_TABS.map(tab => {
          const count = tab === 'all' ? reservations.length : (counts[tab] || 0);
          const isActive = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold
                          uppercase tracking-wider whitespace-nowrap border transition-all duration-200
                          ${isActive
                            ? 'bg-gold text-charcoal border-gold'
                            : 'border-white/15 text-offwhite/50 hover:border-white/30 hover:text-offwhite'
                          }`}>
              {tab}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full
                                  ${isActive ? 'bg-charcoal/25' : 'bg-white/10'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Pending',   key: 'pending',   color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
          { label: 'Confirmed', key: 'confirmed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
          { label: 'Cancelled', key: 'cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20'           },
          { label: 'Completed', key: 'completed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20'        },
        ].map(({ label, key, color }) => (
          <div key={key} className={`border rounded-sm p-3 text-center ${color}`}>
            <p className="text-2xl font-heading font-bold">{counts[key] || 0}</p>
            <p className="text-xs uppercase tracking-wider opacity-80 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 text-offwhite/40 card rounded-sm">
          <p className="text-lg font-heading mb-1">No reservations found</p>
          <p className="text-sm">
            {activeTab !== 'all' ? `No ${activeTab} reservations` : 'No reservations yet'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10">
                {['Guest', 'Date', 'Time', 'Guests', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left pb-3 pr-3 pl-2 text-offwhite/40
                                         text-xs font-semibold uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {reservations.map(r => (
                  <ReservationRow
                    key={r._id}
                    reservation={r}
                    onUpdate={updateStatus}
                    onDelete={deleteRes}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
