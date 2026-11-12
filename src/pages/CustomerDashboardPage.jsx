import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Award,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePolicy } from '../context/PolicyContext';
import { formatINR, formatDate, maskPolicyNumber } from '../utils/formatters';
import PaymentModal from '../components/PaymentModal';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { userPolicies, payments, applications } = usePolicy();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentItem, setSelectedPaymentItem] = useState(null);

  // Calculate high-level summary metrics
  const activePolicies = userPolicies.filter(p => p.status === 'Active');
  const totalSumAssured = userPolicies.reduce((acc, p) => acc + (p.sumAssured || 0), 0);
  const totalPremiumsPaid = userPolicies.reduce((acc, p) => acc + (p.totalPremiumsPaidToDate || 0), 0);
  
  // Find pending upcoming premium
  const pendingPayment = payments.find(p => p.status === 'Pending');

  const handlePayClick = (item) => {
    setSelectedPaymentItem(item);
    setPaymentModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Welcome Banner (Wealth Management Style) */}
      <div className="relative rounded-3xl p-6 sm:p-10 text-white shadow-2xl bg-gradient-to-r from-[#051329] via-[#092247] to-[#004b87] overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Verified Portfolio
              </span>
              <span className="text-xs text-cyan-200 font-medium">KYC: {user.kycStatus}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome Back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Client ID: <span className="font-mono text-cyan-300 font-bold">{user.id}</span> • PAN: <span className="font-mono">{user.panMasked}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/apply"
              className="btn-shine px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:opacity-95 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for New Policy</span>
            </Link>

            <Link
              to="/documents"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 flex items-center gap-2 backdrop-blur-md"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>80C Tax Receipts</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 LUXURY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Life Protection */}
        <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Life Protection</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0b2a59] flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-[#0091da]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0b2a59] font-sans tracking-tight">
            {formatINR(totalSumAssured, { compact: true })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Active across {activePolicies.length} policy contracts
          </div>
        </div>

        {/* Card 2: Active Policies */}
        <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Policies</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans tracking-tight">
            {userPolicies.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1.5">
            {activePolicies.length} Active • {userPolicies.length - activePolicies.length} Paid-up
          </div>
        </div>

        {/* Card 3: Total Premiums Paid */}
        <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accumulated Wealth</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950 font-mono tracking-tight">
            {formatINR(totalPremiumsPaid)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            Lifetime accumulated savings
          </div>
        </div>

        {/* Card 4: Upcoming Due */}
        <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Due</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          {pendingPayment ? (
            <>
              <div className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tracking-tight">
                {formatINR(pendingPayment.amount)}
              </div>
              <div className="text-[11px] text-amber-900 font-bold mt-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Due: {formatDate(pendingPayment.dueDate)}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-sans tracking-tight">
                All Paid
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5">
                No outstanding premium dues
              </div>
            </>
          )}
        </div>
      </div>

      {/* Prominent Action Alert (If payment is pending) */}
      {pendingPayment && (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-yellow-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-base text-slate-900">Annual Renewal Installment Due</h4>
                <span className="text-[10px] font-black text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300 uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Installment of <strong>{formatINR(pendingPayment.amount)}</strong> for <strong>{pendingPayment.policyName}</strong> ({pendingPayment.policyNumber}) is due on <strong>{formatDate(pendingPayment.dueDate)}</strong>. Pay before grace period ends to maintain unbroken coverage.
              </p>
            </div>
          </div>

          <button
            onClick={() => handlePayClick(pendingPayment)}
            className="btn-shine px-8 py-3.5 bg-[#0b2a59] hover:bg-[#0091da] text-white rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xl flex-shrink-0 cursor-pointer"
          >
            <span>Pay via SBI ePay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* IN-PROGRESS PROPOSAL TRACKER (If any) */}
      {applications.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-sky-700" />
              <h3 className="font-extrabold text-base text-slate-900">Recent Online Application Status</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Proposal Ref: <strong className="font-mono text-slate-900">{applications[0].referenceNumber}</strong>
            </span>
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Applied Plan</span>
              <span className="font-extrabold text-slate-900 text-sm">{applications[0].policyName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Sum Assured</span>
              <span className="font-black text-slate-900 font-mono text-sm">{formatINR(applications[0].coverageAmount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Stage</span>
              <span className="inline-block mt-0.5 font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full text-xs border border-amber-200">
                ● {applications[0].status}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Status Update</span>
              <span className="text-slate-700 font-semibold">{applications[0].lastUpdatedAt}</span>
            </div>
          </div>
        </div>
      )}

      {/* MY POLICIES SUMMARY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Active Policy Portfolio</h3>
            <p className="text-xs text-slate-500">Master contracts currently linked with your account</p>
          </div>
          <Link
            to="/my-policies"
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 group"
          >
            <span>View Full Portfolio Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userPolicies.slice(0, 4).map(pol => (
            <div 
              key={pol.id}
              className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                    pol.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    ● {pol.status}
                  </span>
                  <h4 className="font-black text-base text-slate-900 mt-2">{pol.policyName}</h4>
                  <p className="text-[11px] font-mono text-slate-400">Policy: {pol.maskedNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sum Assured</span>
                  <span className="text-base font-black text-[#0b2a59] font-sans">{formatINR(pol.sumAssured, { compact: true })}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                  <span>Term: {pol.totalTermYears} Yrs</span>
                  <span>{pol.premiumsPaidCount} / {pol.totalInstallments} Paid</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-[#0b2a59] rounded-full"
                    style={{ width: `${(pol.premiumsPaidCount / pol.totalInstallments) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {pol.nextDueDate ? `Due: ${formatDate(pol.nextDueDate)}` : 'Term Finished'}
                </span>
                <Link
                  to={`/timeline?policy=${pol.id}`}
                  className="font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                >
                  <span>Milestone Journey →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS ROW (3 Luxury Gradient Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/recommendations"
          className="card-hover-effect p-7 rounded-3xl bg-gradient-to-br from-[#06193b] via-[#092247] to-[#041226] text-white shadow-xl space-y-3 group border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h4 className="font-extrabold text-base">Policy Recommendation Engine</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Take a 2-minute diagnostic assessment to identify protection gaps for your family.
          </p>
        </Link>

        <Link
          to="/premium-payments"
          className="card-hover-effect p-7 rounded-3xl bg-gradient-to-br from-[#01427c] via-[#004b87] to-[#002b66] text-white shadow-xl space-y-3 group border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition">
            <CreditCard className="w-6 h-6 text-cyan-300" />
          </div>
          <h4 className="font-extrabold text-base">Premium Payments & History</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            View transaction receipts, upcoming calendars, and pay renewal installments securely.
          </p>
        </Link>

        <Link
          to="/support"
          className="card-hover-effect p-7 rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#0f172a] text-white shadow-xl space-y-3 group border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <h4 className="font-extrabold text-base">Servicing & Support</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Update nominee details, register claims, and track service tickets with zero paperwork.
          </p>
        </Link>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        paymentItem={selectedPaymentItem}
      />
    </div>
  );
}
