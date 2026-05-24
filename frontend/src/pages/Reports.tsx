import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Download, Package, BookOpen , User, ShoppingBag, Printer, Mail } from 'lucide-react';
import api from '../services/api';
import EmailModal from '../components/EmailModal';
import { ApiRoutes } from '../constants/routes';

interface Sale {
  id: string;
  itemId: string;
  quantity: number;
  totalAmount: number;
  date: string;
  isCash: boolean;
}

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface Customer {
  id: string;
  name: string;
  address: string;
  mobileNumber: string;
}

interface LedgerTransaction {
  id: string;
  customerId: string;
  type: 'debit' | 'credit';
  amount: number;
  referenceId?: string;
  description: string;
  date: string;
}

export default function Reports() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'sales';
  const customerId = searchParams.get('customerId') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'sales') {
          const res = await api.get(ApiRoutes.REPORTS.SALES);
          setSales(res.data.data);
        } else if (activeTab === 'items') {
          const res = await api.get(ApiRoutes.REPORTS.ITEMS);
          setItems(res.data.data);
        } else if (activeTab === 'ledger') {
          // Fetch customers list
          const custRes = await api.get(ApiRoutes.CUSTOMERS.BASE);
          setCustomers(custRes.data.data);

          // Fetch ledger if a customer is selected
          if (customerId) {
            const ledRes = await api.get(ApiRoutes.REPORTS.LEDGER(customerId));
            setLedger(ledRes.data.data);
          } else {
            setLedger([]);
          }
        }
      } catch (error) {
        console.error(`Error fetching data for ${activeTab}`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, customerId]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleCustomerChange = (id: string) => {
    setSearchParams({ tab: 'ledger', customerId: id });
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    let url = '';
    let filename = '';

    if (activeTab === 'sales') {
      url = `${ApiRoutes.REPORTS.SALES_EXPORT}?format=${format}`;
      filename = `sales_report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    } else if (activeTab === 'items') {
      url = `${ApiRoutes.REPORTS.ITEMS_EXPORT}?format=${format}`;
      filename = `items_report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    } else if (activeTab === 'ledger') {
      if (!customerId) return;
      url = `${ApiRoutes.REPORTS.LEDGER_EXPORT(customerId)}?format=${format}`;
      const customerName = customers.find(c => c.id === customerId)?.name || 'customer';
      filename = `${customerName.toLowerCase().replace(/\s+/g, '_')}_ledger.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    }

    if (!url) return;

    api.get(url, { responseType: 'blob' })
      .then(response => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response.data]));
        link.download = filename;
        link.click();
      })
      .catch(error => {
        console.error('Error downloading report', error);
      });
  };

  // Compute stats
  const totalSalesUnits = sales.reduce((sum, s) => sum + s.quantity, 0);
  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  const totalItemsCount = items.length;
  const totalStockUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalStockValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Compute Customer Ledger Running Balance (from oldest to newest)
  const ledgerWithBalances = (() => {
    if (!ledger || ledger.length === 0) return [];
    // Copy and reverse to process chronologically
    const reversed = [...ledger].reverse();
    let balance = 0;
    const chronologicalBalances = reversed.map((tx) => {
      if (tx.type === 'debit') {
        balance += tx.amount;
      } else {
        balance -= tx.amount;
      }
      return balance;
    });
    // Reverse chronologicalBalances back to line up with the original descending ledger transactions
    const descendingBalances = chronologicalBalances.reverse();
    return ledger.map((tx, idx) => ({
      ...tx,
      runningBalance: descendingBalances[idx]
    }));
  })();

  const selectedCustomerInfo = customers.find(c => c.id === customerId);

  const totalLedgerDebits = ledger.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + tx.amount, 0);
  const totalLedgerCredits = ledger.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
  const currentOutstandingBalance = totalLedgerDebits - totalLedgerCredits;

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 border-white/10">
      
      {/* Top Banner Header */}
      <div className="p-8 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/20 no-print">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            Reporting Analytics
          </h3>
          <p className="text-sm text-slate-400 mt-1">Generate lists, review financials, and download official records.</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            disabled={activeTab === 'ledger' && !customerId}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-600 text-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-700 hover:border-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-all font-semibold shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            Print
          </button>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            disabled={activeTab === 'ledger' && !customerId}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-600 text-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-700 hover:border-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-all font-semibold shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            Email Report
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={activeTab === 'ledger' && !customerId}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-600 text-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-700 hover:border-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-all font-semibold shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-rose-400" />
            PDF Report
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={activeTab === 'ledger' && !customerId}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-600 text-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-700 hover:border-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-all font-semibold shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Excel Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-slate-700/50 bg-slate-900/20 px-8 py-4 gap-2 no-print">
        <button
          onClick={() => handleTabChange('sales')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'sales'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Sales Report
        </button>
        <button
          onClick={() => handleTabChange('items')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'items'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Package className="w-4 h-4" />
          Items Report
        </button>
        <button
          onClick={() => handleTabChange('ledger')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'ledger'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Customer Ledger
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 flex flex-col p-8 print:p-0">
        {/* Print-Only Document Title Header */}
        <div className="print-only mb-6 border-b-2 border-slate-200 pb-4">
          <h1 className="text-3xl font-extrabold text-white print-text-black">
            {activeTab === 'sales' && 'Sales Analysis Report'}
            {activeTab === 'items' && 'Inventory Stock Report'}
            {activeTab === 'ledger' && selectedCustomerInfo && `Customer Ledger Statement - ${selectedCustomerInfo.name}`}
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Generated on: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {activeTab === 'ledger' && selectedCustomerInfo && (
            <div className="mt-3 text-sm text-slate-700 space-y-1">
              <p><strong>Mobile:</strong> {selectedCustomerInfo.mobileNumber}</p>
              <p><strong>Address:</strong> {selectedCustomerInfo.address}</p>
            </div>
          )}
        </div>

        {activeTab === 'sales' && (
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
                  <>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-5 pl-8 text-slate-300 font-medium">
                          {new Date(sale.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-5 text-slate-500 font-mono text-xs">{sale.id}</td>
                        <td className="p-5 text-center">
                          <span className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider ${sale.isCash ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                            {sale.isCash ? 'CASH' : 'CREDIT'}
                          </span>
                        </td>
                        <td className="p-5 text-right text-slate-300 font-semibold">{sale.quantity}</td>
                        <td className="p-5 pr-8 text-right text-white font-bold tracking-wide">₹{sale.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-900/60 font-bold border-t border-slate-700">
                      <td colSpan={3} className="p-5 pl-8 text-slate-400 uppercase tracking-widest text-sm">Totals</td>
                      <td className="p-5 text-right text-indigo-400 text-lg">{totalSalesUnits}</td>
                      <td className="p-5 pr-8 text-right text-purple-400 text-lg font-bold">₹{totalSalesRevenue.toFixed(2)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/40 text-slate-400 text-sm uppercase tracking-widest border-b border-slate-700/50 font-semibold">
                  <th className="p-5 pl-8">Item ID</th>
                  <th className="p-5">Name</th>
                  <th className="p-5 text-right">Units in Stock</th>
                  <th className="p-5 text-right">Price per Unit</th>
                  <th className="p-5 text-right pr-8">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500">Loading inventory details...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500">No items in database</td>
                  </tr>
                ) : (
                  <>
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-5 pl-8 text-slate-500 font-mono text-xs">{item.id}</td>
                        <td className="p-5 text-slate-200 font-semibold">
                          <div>{item.name}</div>
                          <span className="text-xs font-normal text-slate-500 block truncate max-w-xs">{item.description}</span>
                        </td>
                        <td className="p-5 text-right text-slate-300 font-semibold">{item.quantity}</td>
                        <td className="p-5 text-right text-slate-300 font-semibold">₹{item.price.toFixed(2)}</td>
                        <td className="p-5 pr-8 text-right text-white font-bold tracking-wide">₹{(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-900/60 font-bold border-t border-slate-700">
                      <td colSpan={2} className="p-5 pl-8 text-slate-400 uppercase tracking-widest text-sm">Totals ({totalItemsCount} unique)</td>
                      <td className="p-5 text-right text-indigo-400 text-lg">{totalStockUnits}</td>
                      <td className="p-5 text-right text-slate-500">-</td>
                      <td className="p-5 pr-8 text-right text-purple-400 text-lg font-bold">₹{totalStockValue.toFixed(2)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="flex flex-col flex-1">
            {/* Customer Selector Bar */}
            <div className="p-6 bg-slate-900/20 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Select Client:</span>
                <select
                  value={customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="glass-input w-auto min-w-60"
                >
                  <option value="" className="bg-slate-900 text-slate-500">Choose Customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                      {c.name} ({c.mobileNumber})
                    </option>
                  ))}
                </select>
              </div>

              {customerId && selectedCustomerInfo && (
                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  <div className="bg-slate-800/60 border border-slate-700 px-4 py-2.5 rounded-xl">
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Contact</span>
                    <span className="text-cyan-400 text-sm mt-0.5 block">{selectedCustomerInfo.mobileNumber}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 px-4 py-2.5 rounded-xl">
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Address</span>
                    <span className="text-slate-300 text-sm mt-0.5 block">{selectedCustomerInfo.address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* If client is selected, show details */}
            {!customerId ? (
              <div className="flex flex-col items-center justify-center p-20 text-center flex-1">
                <div className="w-16 h-16 rounded-full bg-slate-800/40 text-slate-500 flex items-center justify-center mb-4 border border-slate-700/40">
                  <User className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-300">No Customer Selected</h4>
                <p className="text-slate-500 text-sm mt-1 max-w-sm">Please choose a client from the dropdown menu to compute their accounts receivable and view ledger logs.</p>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-slate-700/30">
                  <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                    <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Total Charges (Debits)</span>
                    <span className="text-3xl font-extrabold text-white mt-4">₹{totalLedgerDebits.toFixed(2)}</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                    <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Total Payments (Credits)</span>
                    <span className="text-3xl font-extrabold text-emerald-400 mt-4">₹{totalLedgerCredits.toFixed(2)}</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-indigo-500/20 bg-indigo-500/5">
                    <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Outstanding Balance</span>
                    <span className={`text-3xl font-extrabold mt-4 ${currentOutstandingBalance > 0 ? 'text-rose-400' : currentOutstandingBalance < 0 ? 'text-cyan-400' : 'text-slate-300'}`}>
                      ₹{currentOutstandingBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Ledger Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/40 text-slate-400 text-sm uppercase tracking-widest border-b border-slate-700/50 font-semibold">
                        <th className="p-5 pl-8">Date</th>
                        <th className="p-5">Reference ID</th>
                        <th className="p-5 text-center">Type</th>
                        <th className="p-5">Description</th>
                        <th className="p-5 text-right">Amount</th>
                        <th className="p-5 text-right pr-8">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="p-10 text-center text-slate-500">Calculating transactions...</td>
                        </tr>
                      ) : ledgerWithBalances.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-10 text-center text-slate-500">No ledger transactions found for this customer.</td>
                        </tr>
                      ) : (
                        ledgerWithBalances.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5 pl-8 text-slate-300 font-medium">
                              {new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="p-5 text-slate-500 font-mono text-xs">{tx.referenceId || tx.id}</td>
                            <td className="p-5 text-center">
                              <span className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                {tx.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-5 text-slate-300 font-medium">{tx.description}</td>
                            <td className={`p-5 text-right font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {tx.type === 'credit' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                            </td>
                            <td className="p-5 pr-8 text-right text-white font-bold tracking-wide">
                              ₹{tx.runningBalance.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        reportType={activeTab as 'sales' | 'items' | 'ledger'}
        customerId={customerId}
        customerName={selectedCustomerInfo?.name}
      />
    </div>
  );
}
