import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertCircle, 
  Filter, 
  ArrowRight,
  Bell,
  Check
} from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import { formatINR, formatDate } from '../utils/formatters';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal';

export default function PremiumPaymentsPage() {
  const { payments, userPolicies } = usePolicy();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Reminders consent state
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderSavedNotice, setReminderSavedNotice] = useState(false);

  const pendingPayments = payments.filter(p => p.status === 'Pending');
  const pastPayments = payments.filter(p => p.status !== 'Pending');

  const filteredHistory = pastPayments.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handlePayNow = (paymentItem) => {
    setSelectedPayment(paymentItem);
    setPaymentModalOpen(true);
  };

  const handleViewReceipt = (paymentItem) => {
    setSelectedPayment(paymentItem);
    setReceiptModalOpen(true);
  };

  const handleToggleReminders = () => {
    setRemindersEnabled(!remindersEnabled);
    setReminderSavedNotice(true);
    setTimeout(() => setReminderSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4 text-[#0091da]" />
            <span>SBI ePay Servicing</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Premium Payments & Installment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track scheduled installments, reconcile bank transactions, authorize online renewal payments, and download official 80C tax receipts.
          </p>
        </div>

        {/* Reminders Toggle Pill */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
            <Bell className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-800">SMS / Email Reminders</div>
            <div className="text-[10px] text-slate-400">
              {remindersEnabled ? 'Enabled (5 days prior to due date)' : 'Disabled'}
            </div>
          </div>
          <button
            onClick={handleToggleReminders}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
              remindersEnabled ? 'bg-[#0091da] justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
          </button>
        </div>
      </div>

      {reminderSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Reminder preferences updated successfully in your account profile.</span>
        </div>
      )}

      {/* 1. UPCOMING PREMIUM SCHEDULE (CALENDAR CARD) */}
      <div className="space-y-4">
        <h2 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-700" />
          <span>Upcoming Renewal Premiums</span>
        </h2>

        {pendingPayments.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">All Current Installments Up To Date</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have no outstanding premiums due at this time. All active policy contracts are in good standing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingPayments.map(p => (
              <div 
                key={p.id}
                className="bg-white rounded-3xl border-2 border-amber-300 shadow-md p-6 flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                      Payment Due
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-2">{p.policyName}</h3>
                    <p className="text-xs font-mono text-slate-400">Policy: {p.policyNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Payable Amount</span>
                    <span className="text-2xl font-black text-[#0b2a59] font-sans">{formatINR(p.amount)}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Due Date</span>
                    <strong className="text-amber-900 text-sm font-mono">{formatDate(p.dueDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Installment #</span>
                    <strong className="text-slate-900 text-sm font-mono">Installment {p.installmentNumber}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Grace Period: 30 Days</span>
                  </span>

                  <button
                    onClick={() => handlePayNow(p)}
                    className="px-5 py-2.5 bg-[#0091da] hover:bg-[#007cb8] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>Pay Now via SBI ePay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. PAYMENT HISTORY TABLE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">
              Reconciled Payment History & Receipts
            </h2>
            <p className="text-xs text-slate-500">
              Verified transactions settled through bank gateway and credited to policy accounts.
            </p>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs">
              {['all', 'paid', 'failed', 'refunded'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition ${
                    filterStatus === status ? 'bg-[#0b2a59] text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-4">Transaction / Receipt</th>
                  <th className="p-4">Policy Particulars</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount Paid</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No transaction records found matching this status.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-mono">
                        <div className="font-bold text-slate-900">{txn.receiptNumber || 'RCPT-ONLINE'}</div>
                        <div className="text-[10px] text-slate-400">{txn.transactionRef || 'EPAY-REF'}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">{txn.policyName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Policy: {txn.policyNumber}</div>
                      </td>

                      <td className="p-4 text-slate-600">
                        {txn.paymentMethod || 'SBI Net Banking'}
                      </td>

                      <td className="p-4 text-slate-700 font-medium">
                        {formatDate(txn.paymentDate || txn.dueDate)}
                      </td>

                      <td className="p-4 text-right font-bold text-slate-900 font-mono">
                        {formatINR(txn.amount)}
                      </td>

                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          txn.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          ✓ {txn.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleViewReceipt(txn)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-sky-500 text-sky-800 hover:bg-sky-50 font-bold transition flex items-center gap-1 ml-auto text-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        paymentItem={selectedPayment}
        onPaymentSuccess={() => {
          setPaymentModalOpen(false);
          // Auto open receipt for the newly completed payment
          setTimeout(() => setReceiptModalOpen(true), 300);
        }}
      />

      {/* Receipt & 80C Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        transaction={selectedPayment}
      />
    </div>
  );
}
