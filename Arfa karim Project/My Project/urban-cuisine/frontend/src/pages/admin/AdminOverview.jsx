import { motion } from 'framer-motion';
import { FiShoppingBag, FiCalendar, FiMail, FiUsers, FiDollarSign, FiClock } from 'react-icons/fi';
import useFetch from '../../hooks/useFetch';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

function StatCard({ icon: Icon, label, value, color, index }) {
  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" animate="visible"
      className="card rounded-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-offwhite/45 text-xs uppercase tracking-widest mb-0.5">{label}</p>
        <p className="font-heading text-offwhite text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

export default function AdminOverview() {
  const { data: orderStats, loading: loadingStats } = useFetch('/orders/stats');
  const { data: reservations, loading: loadingRes }  = useFetch('/reservations', { params: { status: 'pending' } });
  const { data: contacts, loading: loadingCon }      = useFetch('/contact', { params: { unread: 'true' } });
  const { data: users, loading: loadingUsers }        = useFetch('/auth/users');

  const stats = orderStats?.data;

  const cards = [
    { icon: FiDollarSign, label: 'Total Revenue',      value: stats ? formatCurrency(stats.totalRevenue) : '—',  color: 'bg-gold/15 text-gold'         },
    { icon: FiShoppingBag,label: 'Total Orders',       value: stats?.totalOrders ?? '—',                          color: 'bg-blue-500/15 text-blue-400' },
    { icon: FiClock,      label: 'Pending Orders',     value: stats?.pendingOrders ?? '—',                        color: 'bg-yellow-500/15 text-yellow-400' },
    { icon: FiCalendar,   label: 'Pending Reservations',value: reservations?.count ?? '—',                        color: 'bg-purple-500/15 text-purple-400' },
    { icon: FiMail,       label: 'Unread Messages',    value: contacts?.count ?? '—',                             color: 'bg-red-500/15 text-red-400'   },
    { icon: FiUsers,      label: 'Total Members',      value: users?.count ?? '—',                                color: 'bg-emerald-500/15 text-emerald-400' },
  ];

  if (loadingStats || loadingRes || loadingCon || loadingUsers) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="font-heading text-3xl text-offwhite">Overview</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => <StatCard key={c.label} {...c} index={i} />)}
      </div>

      {/* Orders by type */}
      {stats?.ordersByType?.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-xl text-offwhite mb-4">Orders by Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.ordersByType.map(({ _id, count }) => (
              <div key={_id} className="card rounded-sm p-4 text-center">
                <p className="font-heading text-2xl text-gold font-bold">{count}</p>
                <p className="text-offwhite/50 text-sm capitalize mt-1">{_id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
