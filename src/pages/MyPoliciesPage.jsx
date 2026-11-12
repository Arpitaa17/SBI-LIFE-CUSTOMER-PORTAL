import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Plus, 
  ChevronRight, 
  ArrowRight,
  Download,
  LifeBuoy
} from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import { 
  formatINR, 
  formatDate, 
  calculateRemainingYears, 
  calculateElapsedYears 
} from '../utils/formatters';
import PaymentModal from '../components/PaymentModal';

export default function MyPoliciesPage() {
  const { userPolicies, linkPolicy } = usePolicy();
  const [unmaskMap, setUnmaskMap] = useState({});
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ policyNumber: '', dob: '', otp: '' });
  const [linkStep, setLinkStep] = useState(1);
  const [linkError, setLinkError] = useState('');
  
  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPolicyForPay, setSelectedPolicyForPay] = useState(null);

  const toggleMask = (id) => {
    setUnmaskMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartLink = (e) => {
    e.preventDefault();
    if (!linkForm.policyNumber || !linkForm.dob) {
      setLinkError('Please enter both policy number and date of birth.');
      return;
    }
    setLinkError('');
    setLinkStep(2); // OTP verification step
  };

  const handleVerifyOtpAndLink = (e) => {
    e.preventDefault();
    try {
      linkPolicy(linkForm.policyNumber, linkForm.dob);
      setLinkModalOpen(false);
      setLinkStep(1);
      setLinkForm({ policyNumber: '', dob: '', otp: '' });
      alert('Policy successfully verified and linked to your portfolio!');
    } catch (err) {
      setLinkError(err.message || 'Verification failed. Please check details.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-[#0091da]" />
            <span>Master Policyholder Portfolio</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My SBI Life Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time policy servicing records, installment counters, riders, and maturity timelines verified against SBI Life master records.
          </p>
        </div>

        <button
          onClick={() => { setLinkModalOpen(true); setLinkError(''); }}
          className="px-4 py-2.5 bg-[#0b2a59] hover:bg-[#0091da] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Link Existing SBI Policy</span>
        </button>
      </div>

      {/* Policies List */}
      <div className="space-y-6">
        {userPolicies.map((pol) => {
          const isUnmasked = unmaskMap[pol.id];
          const remainingDuration = calculateRemainingYears(pol.maturityDate);
          const elapsedDuration = calculateElapsedYears(pol.commencementDate);
          const percentDurationElapsed = Math.min(100, Math.round((Number(elapsedDuration) / pol.totalTermYears) * 100));

          return (
            <div 
              key={pol.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 transition hover:border-sky-300"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                      pol.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      ● {pol.status}
                    </span>
                    <span className="text-xs text-sky-800 font-semibold bg-sky-50 px-2 py-0.5 rounded">
                      {pol.categoryName}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{pol.policyName}</h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span>Policy No: <strong>{isUnmasked ? pol.policyNumber : pol.maskedNumber}</strong></span>
                    <button 
                      onClick={() => toggleMask(pol.id)}
                      className="text-slate-400 hover:text-slate-700"
                      title={isUnmasked ? 'Mask number' : 'Show full number'}
                    >
                      {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <span>• UIN: {pol.uin}</span>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Life Sum Assured</span>
                  <div className="text-2xl font-black text-[#0b2a59] font-sans">
                    {formatINR(pol.sumAssured)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Plan Option: {pol.planOption}</span>
                </div>
              </div>

              {/* Progress & Duration Visual Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Commencement: {formatDate(pol.commencementDate)} ({elapsedDuration} yrs completed)</span>
                  <span>Maturity: {formatDate(pol.maturityDate)} ({remainingDuration} yrs remaining)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-[#0b2a59] rounded-full"
                    style={{ width: `${percentDurationElapsed}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Total Policy Duration: {pol.totalTermYears} Years</span>
                  <span>Journey Progress: {percentDurationElapsed}%</span>
                </div>
              </div>

              {/* Installment & Premium Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Premium Installment</span>
                  <span className="text-base font-black text-slate-900 font-mono">{formatINR(pol.totalAnnualOutflow)}</span>
                  <span className="text-[10px] text-slate-500 block">Frequency: {pol.frequency}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Installments Cleared</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    {pol.premiumsPaidCount} <span className="text-xs font-normal text-slate-500">of {pol.totalInstallments}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block">{pol.remainingInstallments} installments remaining</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Premiums Paid</span>
                  <span className="text-base font-black text-[#0b2a59] font-mono">{formatINR(pol.totalPremiumsPaidToDate)}</span>
                  <span className="text-[10px] text-slate-500 block">Last Paid: {formatDate(pol.lastPaymentDate)}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Next Premium Due</span>
                  {pol.nextDueDate ? (
                    <>
                      <span className="text-base font-black text-amber-700 font-mono">{formatDate(pol.nextDueDate)}</span>
                      <span className="text-[10px] text-emerald-600 font-medium block">Grace: {pol.gracePeriodDays} days</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base font-bold text-slate-500">None (Paid-Up)</span>
                      <span className="text-[10px] text-slate-400 block">All installments cleared</span>
                    </>
                  )}
                </div>
              </div>

              {/* Nominee & Riders Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Registered Nominee</span>
                  <div className="font-bold text-slate-900">{pol.nomineeName} ({pol.nomineeRelation})</div>
                  <span className="text-[11px] text-slate-500">Sec 39 Insurance Act designation active</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Active Riders</span>
                  {pol.riders && pol.riders.length > 0 ? (
                    <div className="space-y-1">
                      {pol.riders.map((r, i) => (
                        <div key={i} className="flex justify-between text-slate-700">
                          <span>✓ {r.name}</span>
                          <span className="font-mono text-slate-900 font-semibold">{formatINR(r.cover, { compact: true })}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500">Standard base plan protection</span>
                  )}
                </div>
              </div>

              {/* Bottom Card Servicing Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/timeline?policy=${pol.id}`}
                    className="font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                  >
                    <span>View Interactive Maturity Journey</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/documents"
                    className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download Policy Bond</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  {pol.status === 'Active' && pol.nextDueDate && (
                    <button
                      onClick={() => {
                        setSelectedPolicyForPay(pol);
                        setPaymentModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#0091da] hover:bg-[#007cb8] text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Upcoming Premium</span>
                    </button>
                  )}
                  <Link
                    to="/support"
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition flex items-center gap-1"
                  >
                    <LifeBuoy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Request Servicing</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LINK POLICY MODAL */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setLinkModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 animate-in zoom-in-95">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">Link Existing SBI Life Policy</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add your branch or agent-purchased policy to your centralized online portfolio.
            </p>

            {linkError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {linkError}
              </div>
            )}

            {linkStep === 1 ? (
              <form onSubmit={handleStartLink} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Policy Number (11 Digits)</label>
                  <input
                    type="text"
                    maxLength={11}
                    value={linkForm.policyNumber}
                    onChange={(e) => setLinkForm({ ...linkForm, policyNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm"
                    placeholder="e.g. 55019284712"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Policyholder Date of Birth</label>
                  <input
                    type="date"
                    value={linkForm.dob}
                    onChange={(e) => setLinkForm({ ...linkForm, dob: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setLinkModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0b2a59] text-white rounded-xl font-bold hover:bg-[#0091da] transition"
                  >
                    Generate OTP
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndLink} className="space-y-4 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  An authentication OTP has been sent to the mobile registered with Policy #{linkForm.policyNumber}.
                  <span className="block font-bold mt-1">(Demo OTP: Any 6 digits e.g. 123456)</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={linkForm.otp}
                    onChange={(e) => setLinkForm({ ...linkForm, otp: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center text-lg tracking-widest font-bold"
                    placeholder="123456"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setLinkStep(1)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition"
                  >
                    Verify & Link Policy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Pay Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        policy={selectedPolicyForPay}
      />
    </div>
  );
}
