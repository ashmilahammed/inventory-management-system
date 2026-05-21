import { useState, useEffect } from 'react';
import { ShoppingCart, Tag, User, CreditCard, Banknote } from 'lucide-react';
import api from '../services/api';
import { ApiRoutes } from '../constants/routes';

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
}

export default function Sales() {
  const [items, setItems] = useState<Item[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [isCash, setIsCash] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await api.get(ApiRoutes.INVENTORY.BASE);
        const customersRes = await api.get(ApiRoutes.CUSTOMERS.BASE);
        setItems(itemsRes.data.data.filter((i: Item) => i.quantity > 0));
        setCustomers(customersRes.data.data);
      } catch (error) {
        console.error('Error fetching data for POS', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post(ApiRoutes.SALES.BASE, {
        itemId: selectedItem,
        quantity,
        customerId: selectedCustomer || undefined,
        isCash
      });
      setMessage({ type: 'success', text: 'Sale recorded successfully!' });
      
      setItems(items.map(item => 
        item.id === selectedItem ? { ...item, quantity: item.quantity - quantity } : item
      ).filter(item => item.quantity > 0));
      
      setQuantity(1);
      setSelectedItem('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error recording sale' });
    } finally {
      setLoading(false);
    }
  };

  const selectedItemData = items.find(i => i.id === selectedItem);
  const totalAmount = selectedItemData ? selectedItemData.price * quantity : 0;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel rounded-3xl overflow-hidden border-white/10 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="p-8 border-b border-slate-700/50 bg-slate-800/30 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl mb-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <ShoppingCart className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Point of Sale</h2>
            <p className="text-slate-400 mt-2 font-medium">Record a new transaction</p>
          </div>

          <div className="p-10">
            {message.text && (
              <div className={`p-4 rounded-xl mb-8 text-sm font-semibold border ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Item Selection */}
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-400" /> Select Item
                  </label>
                  <select
                    required
                    className="glass-input text-lg appearance-none cursor-pointer"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    <option value="" disabled>Choose an item from inventory...</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id} className="bg-slate-800">
                        {item.name} - ₹{item.price.toFixed(2)} (Stock: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-300">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItemData?.quantity || 1}
                    required
                    className="glass-input text-lg"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-300">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3 h-[52px]">
                    <button
                      type="button"
                      onClick={() => setIsCash(true)}
                      className={`flex items-center justify-center gap-2 rounded-xl border transition-all font-semibold ${isCash ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    >
                      <Banknote className="w-4 h-4" /> Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCash(false)}
                      className={`flex items-center justify-center gap-2 rounded-xl border transition-all font-semibold ${!isCash ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    >
                      <CreditCard className="w-4 h-4" /> Credit
                    </button>
                  </div>
                </div>

                {/* Customer */}
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" /> Assign Customer <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <select
                    className="glass-input appearance-none cursor-pointer"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="" className="bg-slate-800">Walk-in Customer (No ledger record)</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-800">{c.name}</option>
                    ))}
                  </select>
                  {!isCash && !selectedCustomer && (
                    <p className="text-xs text-amber-400 mt-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 inline-block">
                      Warning: Processing a credit sale without a customer will not record the owed balance.
                    </p>
                  )}
                </div>
              </div>

              {/* Total & Checkout */}
              <div className="pt-8 mt-4 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Amount</p>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    ₹{totalAmount.toFixed(2)}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !selectedItem}
                  className="btn-primary w-full md:w-auto px-10 py-4 text-lg rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? 'Processing...' : 'Complete Checkout'}
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
