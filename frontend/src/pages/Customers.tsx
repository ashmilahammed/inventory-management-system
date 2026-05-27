import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { customersApi } from '../api/customers.api';
import { PageRoutes } from '../constants/routes';

interface Customer {
  id: string;
  name: string;
  address: string;
  mobileNumber: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', mobileNumber: '' });

  // Delete Modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const response = await customersApi.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customersApi.updateCustomer(editingCustomer.id, formData);
      } else {
        await customersApi.createCustomer(formData);
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await customersApi.deleteCustomer(deleteId);
      setDeleteId(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer', error);
    }
  };

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ name: customer.name, address: customer.address, mobileNumber: customer.mobileNumber });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', address: '', mobileNumber: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="glass-panel rounded-3xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 border-white/10">
        <div className="p-8 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            Client Roster
          </h3>
          <button
            onClick={() => openModal()}
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/40 text-slate-400 text-sm uppercase tracking-widest border-b border-slate-700/50 font-semibold">
                <th className="p-5 pl-8">Name</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Address</th>
                <th className="p-5 text-center pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">Loading...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">No customers found</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-5 pl-8 font-semibold text-slate-200">{customer.name}</td>
                    <td className="p-5 text-cyan-400 font-medium">{customer.mobileNumber}</td>
                    <td className="p-5 text-slate-400">{customer.address}</td>
                    <td className="p-5 pr-8">
                      <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`${PageRoutes.REPORTS}?tab=ledger&customerId=${customer.id}`} className="p-2.5 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-colors" title="View Ledger">
                          <BookOpen className="w-4 h-4" />
                        </Link>
                        <button onClick={() => openModal(customer)} className="p-2.5 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(customer.id)} className="p-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors" title="Delete">
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
            <h2 className="text-3xl font-bold mb-8 text-white">{editingCustomer ? 'Edit Customer' : 'New Customer'}</h2>
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
                <label className="block text-sm font-semibold text-slate-300 mb-2">Mobile Number</label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Address</label>
                <textarea
                  required
                  rows={3}
                  className="glass-input resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
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
                  {editingCustomer ? 'Save Changes' : 'Add Customer'}
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
            <h2 className="text-2xl font-bold mb-2 text-white">Delete Customer?</h2>
            <p className="text-slate-400 mb-8">This action cannot be undone. Are you sure you want to permanently delete this customer from the database?</p>
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
