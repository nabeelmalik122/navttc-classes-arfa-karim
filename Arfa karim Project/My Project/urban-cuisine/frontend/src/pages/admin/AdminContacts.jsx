import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiTrash2, FiRefreshCw, FiMail, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { formatDateShort } from '../../utils/format';

export default function AdminContacts() {
  const [selected, setSelected] = useState(null);
  const { data, loading, refetch } = useFetch('/contact');
  const contacts = data?.data ?? [];

  const openContact = async (c) => {
    setSelected(c);
    if (!c.isRead) {
      try { await api.get(`/contact/${c._id}`); refetch(); } catch {}
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message deleted');
      if (selected?._id === id) setSelected(null);
      refetch();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Admin</p>
          <h1 className="font-heading text-3xl text-offwhite">Messages</h1>
        </div>
        <button onClick={refetch} className="btn-ghost p-2"><FiRefreshCw size={16} /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-2">
          {loading ? <LoadingSpinner size="sm" /> : contacts.length === 0 ? (
            <div className="text-center py-16 text-offwhite/40">No messages yet.</div>
          ) : (
            <AnimatePresence initial={false}>
              {contacts.map(c => (
                <motion.button key={c._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => openContact(c)}
                  className={`w-full text-left p-4 rounded-sm border transition-colors
                               ${selected?._id === c._id ? 'border-gold/40 bg-gold/5' : 'border-white/10 hover:border-white/20 bg-white/3'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {c.isRead ? <FiCheckCircle size={13} className="text-offwhite/30" /> : <FiMail size={13} className="text-gold" />}
                      <span className={`text-sm font-medium ${c.isRead ? 'text-offwhite/60' : 'text-offwhite'}`}>{c.name}</span>
                    </div>
                    <span className="text-xs text-offwhite/30 shrink-0">{formatDateShort(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-offwhite/50 truncate ml-5">{c.subject}</p>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="card rounded-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-offwhite text-lg">{selected.name}</h3>
                <a href={`mailto:${selected.email}`} className="text-gold text-sm hover:underline">{selected.email}</a>
              </div>
              <button onClick={() => deleteContact(selected._id)}
                className="text-offwhite/30 hover:text-red-400 transition-colors p-1">
                <FiTrash2 size={16} />
              </button>
            </div>
            <p className="text-xs text-offwhite/40 uppercase tracking-wider mb-1">Subject</p>
            <p className="text-offwhite/80 text-sm mb-4">{selected.subject}</p>
            <p className="text-xs text-offwhite/40 uppercase tracking-wider mb-1">Message</p>
            <p className="text-offwhite/65 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            {selected.phone && (
              <p className="mt-4 text-xs text-offwhite/40">Phone: {selected.phone}</p>
            )}
          </div>
        ) : (
          <div className="card rounded-sm flex items-center justify-center h-48 text-offwhite/25 text-sm">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
