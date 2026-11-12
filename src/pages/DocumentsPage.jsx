import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Calendar,
  Lock
} from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import ReceiptModal from '../components/ReceiptModal';

export default function DocumentsPage() {
  const { userPolicies, payments } = usePolicy();
  const { user } = useAuth();

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [docFilter, setDocFilter] = useState('all');

  const handleOpenReceipt = (txn) => {
    setSelectedTxn(txn);
    setReceiptModalOpen(true);
  };

  const handleDownloadDoc = (docName) => {
    alert(`Downloading verified electronic document: ${docName}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4 text-[#0091da]" />
          <span>Electronic Document Vault</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Documents & 80C Tax Certificates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Instant access to official policy bond certificates, Section 80C Income Tax statements, and digitized renewal payment receipts.
        </p>
      </div>

      {/* Tax Certificate 80C Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-[#0b2a59] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-bold text-xs border border-emerald-400/30">
            FY 2025-26 & 2026-27 Active
          </span>
          <h2 className="text-2xl font-black text-white">
            Consolidated Section 80C Tax Certificate
          </h2>
          <p className="text-xs text-slate-200 max-w-xl">
            Single unified certificate declaring all eligible life insurance premiums paid across your policies for IT return filing.
          </p>
        </div>

        <button
          onClick={() => {
            const firstPaid = payments.find(p => p.status === 'Paid') || payments[0];
            handleOpenReceipt(firstPaid);
          }}
          className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-2 shadow-md flex-shrink-0"
        >
          <Printer className="w-4 h-4 text-emerald-800" />
          <span>Generate Consolidated 80C Certificate</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Policy Bonds */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Lock className="w-5 h-5 text-sky-700" />
            <h3 className="font-extrabold text-base text-slate-900">Signed Policy Bonds (Original Contracts)</h3>
          </div>

          <div className="space-y-3">
            {userPolicies.map(pol => (
              <div 
                key={pol.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{pol.policyName}</h4>
                  <p className="text-[11px] font-mono text-slate-500">Policy: {pol.maskedNumber}</p>
                  <p className="text-[10px] text-slate-400">Issued: {formatDate(pol.commencementDate)}</p>
                </div>

                <button
                  onClick={() => handleDownloadDoc(`SBI_PolicyBond_${pol.policyNumber}.pdf`)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-sky-500 text-sky-800 font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Bond</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Renewal Receipts */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-base text-slate-900">Renewal Premium Receipts</h3>
          </div>

          <div className="space-y-3">
            {payments.filter(p => p.status === 'Paid').map(txn => (
              <div 
                key={txn.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{txn.policyName}</h4>
                  <p className="text-[11px] font-mono text-slate-500">Receipt: {txn.receiptNumber}</p>
                  <p className="text-[10px] text-slate-400">Paid on: {formatDate(txn.paymentDate)}</p>
                </div>

                <button
                  onClick={() => handleOpenReceipt(txn)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View / Print</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        transaction={selectedTxn}
      />
    </div>
  );
}
