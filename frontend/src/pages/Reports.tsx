import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import api from '../services/api';

interface Sale {
  id: string;
  itemId: string;
  quantity: number;
  totalAmount: number;
  date: string;
  isCash: boolean;
}

export default function Reports() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get('/reports/sales');
        setSales(res.data.data);
      } catch (error) {
        console.error('Error fetching sales report', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleExport = (format: 'pdf' | 'excel') => {
    api.get(`/reports/sales/export?format=${format}`, { responseType: 'blob' })
    .then(response => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.download = `sales_report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();
    })
    .catch(error => {
      console.error('Error downloading report', error);
    });
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 border-white/10">
      <div className="p-8 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          Transactions Ledger
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-600 text-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-700 hover:border-slate-500 transition-all font-semibold shadow-lg backdrop-blur-md"
          >
            <Download className="w-4 h-4 text-rose-400" />
            PDF Report
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-600 text-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-700 hover:border-slate-500 transition-all font-semibold shadow-lg backdrop-blur-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Excel Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/40 text-slate-400 text-sm uppercase tracking-widest border-b border-slate-700/50 font-semibold">
              <th className="p-5 pl-8">Date</th>
              <th className="p-5">Transaction ID</th>
              <th className="p-5 text-center">Payment Method</th>
              <th className="p-5 text-right">Units Sold</th>
              <th className="p-5 text-right pr-8">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-500">Loading records...</td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-500">No transactions recorded yet</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-5 pl-8 text-slate-300 font-medium">
                    {new Date(sale.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-5 text-slate-500 font-mono text-sm">{sale.id}</td>
                  <td className="p-5 text-center">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider ${sale.isCash ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                      {sale.isCash ? 'CASH' : 'CREDIT'}
                    </span>
                  </td>
                  <td className="p-5 text-right text-slate-300 font-semibold">{sale.quantity}</td>
                  <td className="p-5 pr-8 text-right text-white font-bold tracking-wide">₹{sale.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
