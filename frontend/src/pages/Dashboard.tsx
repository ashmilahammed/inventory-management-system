import { useEffect, useState } from 'react';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    items: 0,
    customers: 0,
    sales: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, customersRes, salesRes] = await Promise.all([
          api.get('/inventory'),
          api.get('/customers'),
          api.get('/reports/sales'),
        ]);

        const totalRevenue = salesRes.data.data.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);

        setStats({
          items: itemsRes.data.data.length,
          customers: customersRes.data.data.length,
          sales: salesRes.data.data.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="glass-card rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Items</p>
            <h3 className="text-3xl font-bold text-slate-100">{stats.items}</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Customers</p>
            <h3 className="text-3xl font-bold text-slate-100">{stats.customers}</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Sales</p>
            <h3 className="text-3xl font-bold text-slate-100">{stats.sales}</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Revenue</p>
            <h3 className="text-3xl font-bold text-slate-100">${stats.revenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>
      
      <div className="glass-panel rounded-3xl p-10 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4 text-white">Welcome back to <span className="text-gradient">StockSmart</span></h3>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Your inventory is looking healthy today. Use the navigation panel on the left to manage your stock, onboard new customers, or process sales transactions effortlessly.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
              <Package className="w-5 h-5" /> View Inventory
            </button>
            <button className="btn-secondary px-6 py-3 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Record Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
