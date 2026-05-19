import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', quantity: 0, price: 0 });
  
  // Delete Modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async (query = '') => {
    try {
      const response = await api.get(`/inventory${query ? `?q=${query}` : ''}`);
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(search);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, formData);
      } else {
        await api.post('/inventory', formData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/inventory/${deleteId}`);
      setDeleteId(null);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const openModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description, quantity: item.quantity, price: item.price });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', quantity: 0, price: 0 });
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="glass-panel rounded-3xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 border-white/10">
      <div className="p-8 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-100 placeholder-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary px-6 py-3 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/40 text-slate-400 text-sm uppercase tracking-widest border-b border-slate-700/50 font-semibold">
              <th className="p-5 pl-8">Name</th>
              <th className="p-5">Description</th>
              <th className="p-5 text-right">Quantity</th>
              <th className="p-5 text-right">Price</th>
              <th className="p-5 text-center pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-500">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-500">No items found</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-slate-200">{item.name}</td>
                  <td className="p-5 text-slate-400 truncate max-w-xs">{item.description}</td>
                  <td className="p-5 text-right">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold tracking-wide ${item.quantity < 10 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="p-5 text-right text-slate-200 font-semibold">${item.price.toFixed(2)}</td>
                  <td className="p-5 pr-8">
                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(item)} className="p-2.5 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="glass-panel p-10 rounded-3xl w-full max-w-lg border-white/10 animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-bold mb-8 text-white">{editingItem ? 'Edit Item' : 'New Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  className="glass-input resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="glass-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="glass-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary px-6 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-8 py-3"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="glass-panel p-8 rounded-3xl w-full max-w-sm border-white/10 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Delete Item?</h2>
            <p className="text-slate-400 mb-8">This action cannot be undone. Are you sure you want to permanently delete this item from your inventory?</p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="btn-secondary px-6 py-2.5 w-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all w-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
