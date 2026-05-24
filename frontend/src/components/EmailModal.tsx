import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Send, ExternalLink, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { ApiRoutes } from '../constants/routes';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'sales' | 'items' | 'ledger';
  customerId?: string;
  customerName?: string;
}

export default function EmailModal({ isOpen, onClose, reportType, customerId, customerName }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(() => {
    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    if (reportType === 'sales') return `Sales Analysis Report - ${dateStr}`;
    if (reportType === 'items') return `Inventory Stock Report - ${dateStr}`;
    return `Customer Ledger Statement - ${customerName || 'Client'} - ${dateStr}`;
  });
  const [body, setBody] = useState(() => {
    if (reportType === 'sales') return 'Please find attached the Sales Analysis Report generated from StockSmart inventory system.';
    if (reportType === 'items') return 'Please find attached the latest Inventory Stock Valuation Report from StockSmart.';
    return `Please find attached the accounts ledger history report for ${customerName || 'Client'} generated from StockSmart.`;
  });
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ message: string; previewUrl?: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Recipient email address is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const response = await api.post(ApiRoutes.REPORTS.EMAIL, {
        email,
        subject,
        body,
        reportType,
        format,
        customerId
      });
      
      if (response.data.success) {
        setSuccessData({
          message: response.data.message || 'Report has been successfully emailed!',
          previewUrl: response.data.data?.previewUrl
        });
      } else {
        setError(response.data.message || 'Failed to send report email.');
      }
    } catch (err: any) {
      console.error('Error sending report email:', err);
      const errMsg = err.response?.data?.message || 'An error occurred while connecting to the email service.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setEmail('');
    setError(null);
    setSuccessData(null);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-350">
      <div 
        className="w-full max-w-lg max-h-[90vh] rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-300 bg-slate-900/90 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-indigo-400" />
            Email Document
          </h3>
          <button 
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-700/40 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 flex-1 overflow-y-auto">
          {successData ? (
            <div className="flex flex-col items-center justify-center text-center py-6 space-y-4 animate-in fade-in duration-500">
              <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h4 className="text-xl font-bold text-white">{successData.message}</h4>
              <p className="text-sm text-slate-400 max-w-sm">
                The report was converted and sent as a <strong>{format.toUpperCase()}</strong> file attachment.
              </p>

              {successData.previewUrl && (
                <div className="mt-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 max-w-md w-full">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">Development Mailbox</span>
                  <p className="text-xs text-slate-400 mb-3">Since SMTP environment credentials are unconfigured, Ethereal test inbox was used.</p>
                  <a 
                    href={successData.previewUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/25"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Ethereal Preview
                  </a>
                </div>
              )}

              <button
                onClick={handleResetAndClose}
                className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex gap-3 items-start text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Execution Failed</span>
                    <p className="text-rose-350/90 text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recipient Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input !pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Attachment Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      format === 'pdf'
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    PDF Statement
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('excel')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      format === 'excel'
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Excel Worksheet
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Subject of the email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Include a description for the email recipient..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="glass-input resize-none py-3"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-700/40 mt-6">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white rounded-xl border border-slate-700/50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}