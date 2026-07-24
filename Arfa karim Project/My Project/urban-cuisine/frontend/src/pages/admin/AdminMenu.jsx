import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { formatCurrency } from '../../utils/format';

const CATEGORIES = ['starters','mains','desserts','drinks','specials'];
const EMPTY = { name:'', description:'', price:'', category:'mains', image:'', isVegetarian:false, isSpicy:false, isFeatured:false, isAvailable:true };

function ItemForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const ch = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-3 p-5 card rounded-sm">
      <h3 className="font-heading text-lg text-offwhite mb-2">{initial ? 'Edit' : 'New'} Menu Item</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="name" value={form.name} onChange={ch} placeholder="Name *" required className="input-base text-sm" />
        <select name="category" value={form.category} onChange={ch} className="input-base bg-charcoal text-sm capitalize">
          {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={ch} placeholder="Price *" required className="input-base text-sm" />
        <input name="image" value={form.image} onChange={ch} placeholder="Image URL *" required className="input-base text-sm" />
      </div>
      <textarea name="description" value={form.description} onChange={ch} placeholder="Description *" required rows={2} className="input-base text-sm resize-none w-full" />
      <div className="flex flex-wrap gap-4 text-sm">
        {[['isVegetarian','Vegetarian'],['isSpicy','Spicy'],['isFeatured',"Chef's Pick"],['isAvailable','Available']].map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 text-offwhite/70 cursor-pointer">
            <input type="checkbox" name={k} checked={form[k]} onChange={ch} className="accent-gold" />
            {label}
          </label>
        ))}
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving} className="btn-primary gap-2 text-sm py-2">
          {saving ? <div className="w-3 h-3 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <FiSave size={13} />}
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost text-sm py-2"><FiX size={13} /> Cancel</button>
      </div>
    </form>
  );
}

export default function AdminMenu() {
  const { data, loading, refetch } = useFetch('/menu/admin/all');
  const items = data?.data ?? [];
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);

  const saveItem = async (form) => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/menu/${editing._id}`, { ...form, price: parseFloat(form.price) });
        toast.success('Item updated');
      } else {
        await api.post('/menu', { ...form, price: parseFloat(form.price) });
        toast.success('Item created');
      }
      setShowForm(false); setEditing(null); refetch();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await api.delete(`/menu/${id}`); toast.success('Deleted'); refetch(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Admin</p>
          <h1 className="font-heading text-3xl text-offwhite">Menu Items</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={refetch} className="btn-ghost p-2"><FiRefreshCw size={16} /></button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary gap-2 text-sm">
            <FiPlus size={15} /> Add Item
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(showForm || editing) && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <ItemForm initial={editing} onSave={saveItem} onCancel={() => { setShowForm(false); setEditing(null); }} saving={saving} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <LoadingSpinner /> : items.length === 0 ? (
        <div className="text-center py-16 text-offwhite/40">No menu items yet. Add one above.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="card rounded-sm overflow-hidden">
              <div className="relative h-36">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => { setEditing(item); setShowForm(false); }}
                    className="w-7 h-7 bg-charcoal/80 rounded-sm flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-colors">
                    <FiEdit2 size={12} />
                  </button>
                  <button onClick={() => deleteItem(item._id)}
                    className="w-7 h-7 bg-charcoal/80 rounded-sm flex items-center justify-center text-red-400 hover:bg-red-400 hover:text-white transition-colors">
                    <FiTrash2 size={12} />
                  </button>
                </div>
                {!item.isAvailable && (
                  <span className="absolute bottom-2 left-2 badge-red text-[9px]">Unavailable</span>
                )}
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-offwhite text-sm font-semibold leading-snug">{item.name}</h3>
                  <span className="text-gold text-sm font-bold shrink-0">{formatCurrency(item.price)}</span>
                </div>
                <p className="text-offwhite/40 text-xs capitalize mt-0.5">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
