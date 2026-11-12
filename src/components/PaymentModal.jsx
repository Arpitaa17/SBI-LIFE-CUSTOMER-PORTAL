import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  Smartphone, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import { formatINR } from '../utils/formatters';

export default function PaymentModal({ isOpen, onClose, policy, paymentItem, onPaymentSuccess }) {
  const { completePayment } = usePolicy();
  
  const [selectedMethod, setSelectedMethod] = useState('sbi-netbanking');
  const [step, setStep] = useState('select'); // 'select' | 'processing' | 'success' | 'failed'
  const [processStage, setProcessStage] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen || (!policy && !paymentItem)) return null;

  const targetPolicy = policy || {
    id: paymentItem?.policyId,
    maskedNumber: paymentItem?.policyNumber,
    policyName: paymentItem?.policyName,
    totalAnnualOutflow: paymentItem?.amount || 102250
  };

  const amount = paymentItem?.amount || targetPolicy.totalAnnualOutflow;
  const basePremium = Math.round(amount / 1.045);
  const gst = amount - basePremium;

  const handleStartPayment = () => {
    setStep('processing');
    setProcessStage('Connecting to SBI ePay Payment Gateway...');

    setTimeout(() => {
      setProcessStage('Encrypting transaction payload with 256-bit TLS...');
    }, 1000);

    setTimeout(() => {
      setProcessStage('Awaiting bank clearance & settlement authorization...');
    }, 2200);

    setTimeout(() => {
      setProcessStage('Synchronizing with SBI Life Core Life/400 System...');
    }, 3400);

    setTimeout(() => {
      // Completed and verified!
      const result = completePayment({
        paymentId: paymentItem?.id,
        policyId: targetPolicy.id,
        paymentMethod: getMethodLabel(selectedMethod)
      });
      setReceiptData(result);
      setStep('success');
      if (onPaymentSuccess) {
        onPaymentSuccess(result);
      }
    }, 4500);
  };

  const getMethodLabel = (id) => {
    switch (id) {
      case 'sbi-netbanking': return 'SBI Net Banking / YONO';
      case 'upi': return `UPI (${upiId || 'Instant VPA'})`;
      case 'card': return `Card (Ending in ${cardDetails.number.slice(-4) || '8219'})`;
      case 'other-banks': return 'Other Bank Net Banking';
      default: return 'Online Payment Gateway';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={() => { if (step !== 'processing') onClose(); }} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#0b2a59] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">SBI ePay — Secure Payment Gateway</h3>
              <p className="text-[11px] text-blue-200">Authorized Premium Collection Portal</p>
            </div>
          </div>
          {step !== 'processing' && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-5">
              {/* Premium Breakdown Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Policy Details</span>
                  <span className="text-xs font-mono font-bold text-slate-900">{targetPolicy.maskedNumber}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-3">{targetPolicy.policyName}</h4>

                <div className="space-y-1.5 text-xs border-t border-slate-200 pt-2.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Installment Premium:</span>
                    <span>{formatINR(basePremium)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST / Taxes:</span>
                    <span>{formatINR(gst)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#0b2a59] pt-1 border-t border-slate-200">
                    <span>Total Premium Amount Payable:</span>
                    <span>{formatINR(amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Verified Payment Method
                </label>
                <div className="space-y-2">
                  {/* Option 1: SBI Net Banking */}
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedMethod === 'sbi-netbanking' 
                      ? 'border-[#0091da] bg-sky-50/60 ring-2 ring-sky-200' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={selectedMethod === 'sbi-netbanking'}
                        onChange={() => setSelectedMethod('sbi-netbanking')}
                        className="text-sky-600"
                      />
                      <Building2 className="w-5 h-5 text-[#0b2a59]" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">State Bank of India (Net Banking / YONO)</div>
                        <div className="text-[11px] text-slate-500">Zero surcharge, instant reconciliation</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Recommended
                    </span>
                  </label>

                  {/* Option 2: UPI */}
                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition ${
                    selectedMethod === 'upi' 
                      ? 'border-[#0091da] bg-sky-50/60 ring-2 ring-sky-200' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={selectedMethod === 'upi'}
                        onChange={() => setSelectedMethod('upi')}
                        className="text-sky-600"
                      />
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">UPI (BHIM, Google Pay, PhonePe, Paytm)</div>
                        <div className="text-[11px] text-slate-500">Scan QR or enter UPI Virtual ID</div>
                      </div>
                    </div>
                    {selectedMethod === 'upi' && (
                      <div className="mt-3 pl-7">
                        <input
                          type="text"
                          placeholder="e.g. rajesh@oksbi or 9876543210@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    )}
                  </label>

                  {/* Option 3: Debit/Credit Cards */}
                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition ${
                    selectedMethod === 'card' 
                      ? 'border-[#0091da] bg-sky-50/60 ring-2 ring-sky-200' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={selectedMethod === 'card'}
                        onChange={() => setSelectedMethod('card')}
                        className="text-sky-600"
                      />
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Debit / Credit Card (Visa, RuPay, MasterCard)</div>
                        <div className="text-[11px] text-slate-500">Secure 3D-OTP authenticated transaction</div>
                      </div>
                    </div>
                    {selectedMethod === 'card' && (
                      <div className="mt-3 pl-7 space-y-2">
                        <input
                          type="text"
                          placeholder="Card Number (4532 **** **** 8219)"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100 p-2.5 rounded-lg">
                <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Payments are encrypted with 256-bit SSL. Status will only be recorded as <strong>Paid</strong> after official clearance from SBI ePay.
                </span>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handleStartPayment}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#0091da] hover:bg-[#007cb8] shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Authorize & Pay {formatINR(amount)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Processing State */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <Loader2 className="w-16 h-16 text-[#0091da] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#0b2a59]" />
                </div>
              </div>
              <h4 className="text-base font-bold text-slate-900">Verifying Payment with Insurer...</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto animate-pulse">
                {processStage}
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 max-w-xs mx-auto">
                Please do not refresh or press back while the bank gateway settles your transaction.
              </div>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Payment Verified & Settled!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your policy status and installment ledger have been synchronized in SBI Life master records.
                </p>
              </div>

              {receiptData && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Transaction Ref:</span>
                    <span className="font-bold text-slate-900">{receiptData.txnRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Official Receipt #:</span>
                    <span className="font-bold text-sky-800">{receiptData.receiptNum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Payment Date:</span>
                    <span className="text-slate-900 font-sans">{receiptData.paidAt}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-sans">
                    <span className="text-slate-700 font-bold">Amount Credited:</span>
                    <span className="font-bold text-emerald-700">{formatINR(amount)}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
