import React from 'react';
import { X, Printer, Download, CheckCircle2, Shield } from 'lucide-react';
import { formatINR, formatDate } from '../utils/formatters';

export default function ReceiptModal({ isOpen, onClose, transaction, policy }) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const amount = transaction.amount || 102250;
  const baseAmount = Math.round(amount / 1.045);
  const totalTax = amount - baseAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity no-print" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar */}
        <div className="bg-[#0b2a59] text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm">Official Electronic Premium Receipt & 80C Certificate</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold flex items-center gap-1.5 transition text-white shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div id="printable-receipt" className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 text-xs">
          {/* Header */}
          <div className="border-b-2 border-[#0b2a59] pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0b2a59] flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0091da]"></div>
                  </div>
                  <h1 className="text-xl font-black tracking-tight text-[#0b2a59]">SBI LIFE INSURANCE CO. LTD.</h1>
                </div>
                <p className="text-[10px] text-slate-500 max-w-md">
                  Regd. Office: Natraj, M.V. Road & Western Express Highway Junction, Andheri (East), Mumbai - 400 069.
                </p>
                <p className="text-[10px] text-slate-500">
                  IRDAI Regn. No. 111 | CIN: L99999MH2000PLC129113 | GSTIN: 27AABCS1289H1Z2
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] mb-1">
                  TAX INVOICE / RECEIPT
                </span>
                <p className="font-mono text-[10px] text-slate-600">Receipt No: <strong>{transaction.receiptNumber || 'RCPT-2026-10-8912'}</strong></p>
                <p className="font-mono text-[10px] text-slate-600">Date: <strong>{formatDate(transaction.paymentDate || transaction.dueDate)}</strong></p>
              </div>
            </div>
          </div>

          {/* Policyholder & Transaction Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Policyholder Details</p>
              <p className="font-bold text-sm text-slate-900 mt-0.5">Rajesh Sharma</p>
              <p className="text-slate-600">Client ID: USR-89213</p>
              <p className="text-slate-600 font-mono">PAN: ABCDE****F</p>
              <p className="text-slate-600">State of Supply: Maharashtra (Code 27)</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Policy & Installment Details</p>
              <p className="font-bold text-sm text-slate-900 mt-0.5">{transaction.policyName}</p>
              <p className="text-slate-600 font-mono">Policy No: <strong>{transaction.policyNumber}</strong></p>
              <p className="text-slate-600">Payment Mode: {transaction.paymentMethod || 'Online ePay'}</p>
              <p className="text-slate-600 font-mono">Txn Ref: {transaction.transactionRef || 'SBI-EPAY-9841029'}</p>
            </div>
          </div>

          {/* Premium Particulars Table */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Particulars of Payment</h4>
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border border-slate-300 p-2 text-left">Description</th>
                  <th className="border border-slate-300 p-2 text-center">HSN/SAC</th>
                  <th className="border border-slate-300 p-2 text-right">Taxable Value</th>
                  <th className="border border-slate-300 p-2 text-right">CGST (9%)</th>
                  <th className="border border-slate-300 p-2 text-right">SGST (9%)</th>
                  <th className="border border-slate-300 p-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium">
                    Renewal Premium for {transaction.policyName}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono">997132</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">{formatINR(baseAmount)}</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">{formatINR(cgst)}</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">{formatINR(sgst)}</td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-bold">{formatINR(amount)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={5} className="border border-slate-300 p-2 text-right uppercase">
                    Total Amount Received (in INR):
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono text-[#0b2a59]">
                    {formatINR(amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Statutory 80C Tax Deduction Endorsement */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">
                  Income Tax Exemption Certificate under Section 80C of the Income Tax Act, 1961:
                </strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Certified that the above sum of <strong>{formatINR(baseAmount)}</strong> has been received towards life insurance premium for the policy mentioned. This payment is eligible for tax deduction under Section 80C of the Income Tax Act, 1961 subject to overall limit of ₹1,50,000 and prevailing tax provisions.
                </p>
              </div>
            </div>
          </div>

          {/* Signature and Verification Stamp */}
          <div className="flex justify-between items-end pt-4 border-t border-slate-200">
            <div className="text-[10px] text-slate-500 space-y-1">
              <p>• This is a computer generated tax invoice and does not require a physical signature.</p>
              <p>• Premium receipt is subject to realization of cheque / clearinghouse settlement.</p>
              <p>• For claims and queries, visit www.sbilife.co.in or call toll-free 1800 267 9090.</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-14 border border-blue-200 rounded bg-blue-50/50 flex flex-col items-center justify-center p-1 mb-1">
                <span className="text-[9px] font-bold text-sky-800 uppercase">Digitally Authenticated</span>
                <span className="text-[8px] text-slate-500 font-mono">SBI LIFE IT-SYS-400</span>
                <span className="text-[8px] text-emerald-600 font-semibold">VALID TIMESTAMP</span>
              </div>
              <p className="font-bold text-[10px] text-slate-800">Authorized Signatory</p>
              <p className="text-[9px] text-slate-500">SBI Life Insurance Co. Ltd.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
