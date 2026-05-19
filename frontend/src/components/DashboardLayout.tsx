import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, BarChart, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Sales', path: '/sales', icon: ShoppingCart },
    { name: 'Reports', path: '/reports', icon: BarChart },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F19] relative">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <div className="w-72 m-4 rounded-3xl glass-panel flex flex-col z-10 border-white/5">
        <div className="p-8">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 text-white">
              <Package className="w-7 h-7" />
            </div>
            <span className="text-gradient">StockSmart</span>
          </h1>
        </div>

        <nav className="flex-1 mt-4">
          <ul className="space-y-3 px-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                        ? 'bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-24 flex items-center justify-between px-10">
          <h2 className="text-2xl font-bold text-slate-100">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-200">Admin User</p>
              <p className="text-xs text-slate-400">admin@stocksmart.io</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-0.5">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-slate-200 font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-10 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
