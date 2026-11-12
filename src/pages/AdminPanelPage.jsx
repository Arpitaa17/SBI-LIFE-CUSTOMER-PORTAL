import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  CreditCard, 
  Bell, 
  Activity, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Filter,
  Lock,
  Plus
} from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import { useNotifications } from '../context/NotificationContext';
import { VERIFIED_POLICIES } from '../data/verifiedPolicies';
import { formatINR, formatDate } from '../utils/formatters';

export default function AdminPanelPage() {
  const { applications, updateApplicationStatus, payments, supportTickets } = usePolicy();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'reconciliation' | 'tickets' | 'catalogue' | 'announcements'

  // Announcement state
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '', urgent: false });
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleAdvanceApplication = (appId, nextStatus, nextStep) => {
    updateApplicationStatus(appId, nextStatus, nextStep, `Underwriter advanced application to ${nextStatus}.`);
    alert(`Application ${appId} status updated to: ${nextStatus}`);
  };

  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.message) return;

    addNotification({
      title: announcementForm.title,
      message: announcementForm.message,
      category: 'announcement',
      urgent: announcementForm.urgent,
      actionUrl: '/explore'
    });

    setBroadcastSuccess(true);
    setAnnouncementForm({ title: '', message: '', urgent: false });
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-[#071936] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-900 font-bold text-xs">
              SBI Life Staff Console
            </span>
            <span className="text-xs text-slate-400 font-mono">SYS-ADMIN-PORTAL-v2.6</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Administrative Operations & Underwriting
          </h1>
          <p className="text-xs text-slate-400">
            Authorized oversight for product catalogue, proposal evaluation, payment reconciliation, and customer tickets.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900/80 p-3 rounded-2xl border border-slate-700">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Logged in as: <strong>Chief Underwriting Officer</strong></span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold scrollbar-none">
        {[
          { id: 'applications', label: `Applications Ledger (${applications.length})` },
          { id: 'reconciliation', label: `Payment Gateway Clearing (${payments.length})` },
          { id: 'tickets', label: `Support & Servicing Desk (${supportTickets.length})` },
          { id: 'catalogue', label: `Product Catalogue (${VERIFIED_POLICIES.length})` },
          { id: 'announcements', label: 'Broadcast Servicing Alerts' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-[#0091da] text-[#0b2a59] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: APPLICATIONS LEDGER */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Digital Proposal Applications</h3>
            <p className="text-xs text-slate-500">
              Review applicant disclosures, verify CKYC, and transition proposals through underwriting milestones.
            </p>
          </div>

          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Reference</span>
                    <h4 className="font-mono font-bold text-base text-slate-900">{app.referenceNumber}</h4>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      {app.status} (Stage {app.statusStep}/5)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Applicant</span>
                    <strong className="text-slate-900">{app.applicantName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Applied Plan</span>
                    <strong className="text-slate-900">{app.policyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Coverage</span>
                    <strong className="text-slate-900 font-mono">{formatINR(app.coverageAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Annual Outflow</span>
                    <strong className="text-[#0b2a59] font-mono">{formatINR(app.totalAnnualPremium)}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-slate-500 text-[11px]">
                    Submitted: <strong>{app.submittedAt}</strong> • KYC: <strong className="text-emerald-700">{app.kycType}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.statusStep === 2 && (
                      <button
                        onClick={() => handleAdvanceApplication(app.id, 'Underwriting Review', 3)}
                        className="px-3 py-1.5 bg-[#0b2a59] text-white rounded-lg font-bold hover:bg-[#0091da] transition"
                      >
                        Advance to Underwriting
                      </button>
                    )}
                    {app.statusStep === 3 && (
                      <button
                        onClick={() => handleAdvanceApplication(app.id, 'Tele-Medical Completed', 4)}
                        className="px-3 py-1.5 bg-[#0b2a59] text-white rounded-lg font-bold hover:bg-[#0091da] transition"
                      >
                        Complete Tele-Med Review
                      </button>
                    )}
                    {app.statusStep === 4 && (
                      <button
                        onClick={() => handleAdvanceApplication(app.id, 'Policy Issued & Active', 5)}
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 transition"
                      >
                        Issue Policy Contract
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Payment Gateway Clearing & Audit Ledger</h3>
            <p className="text-xs text-slate-500">
              Real-time audit log of premiums collected via SBI ePay gateway and reconciled with the Life/400 master system.
            </p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-700">
                  <th className="p-3 border border-slate-200 text-left">Transaction Ref</th>
                  <th className="p-3 border border-slate-200 text-left">Policy Particulars</th>
                  <th className="p-3 border border-slate-200 text-left">Payment Channel</th>
                  <th className="p-3 border border-slate-200 text-right">Settled Amount</th>
                  <th className="p-3 border border-slate-200 text-center">Gateway Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {payments.map(txn => (
                  <tr key={txn.id}>
                    <td className="p-3 border border-slate-200 font-bold text-slate-900">
                      {txn.transactionRef || 'PENDING-SETTLEMENT'}
                    </td>
                    <td className="p-3 border border-slate-200 font-sans">
                      <div className="font-bold text-slate-800">{txn.policyName}</div>
                      <div className="text-[10px] text-slate-500">{txn.policyNumber}</div>
                    </td>
                    <td className="p-3 border border-slate-200 font-sans text-slate-600">
                      {txn.paymentMethod || 'Awaiting Authorization'}
                    </td>
                    <td className="p-3 border border-slate-200 text-right font-bold text-slate-900">
                      {formatINR(txn.amount)}
                    </td>
                    <td className="p-3 border border-slate-200 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        txn.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TICKETS */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Customer Support Desk</h3>
            <p className="text-xs text-slate-500">Manage servicing requests, update responses, and resolve grievances.</p>
          </div>

          <div className="space-y-3">
            {supportTickets.map(tkt => (
              <div key={tkt.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-sky-800">{tkt.ticketNumber}</span>
                    <span className="text-slate-400 ml-2">Category: {tkt.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    tkt.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {tkt.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{tkt.subject}</h4>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                  {tkt.lastReply}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCT CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Verified Product Catalogue</h3>
              <p className="text-xs text-slate-500">Official IRDAI-registered plans published on this portal.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {VERIFIED_POLICIES.map(p => (
              <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">UIN: {p.uin} • Category: {p.categoryName}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {p.status}
                  </span>
                  <a href={p.officialUrl} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline font-semibold">
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in max-w-xl">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Broadcast Servicing Alert</h3>
            <p className="text-xs text-slate-500">Send high-priority notifications to registered policyholder dashboards.</p>
          </div>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
              Announcement broadcast successfully to all active policyholders.
            </div>
          )}

          <form onSubmit={handleBroadcastAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alert Title</label>
              <input
                type="text"
                placeholder="e.g. Annual Bonus Declared for FY 2026-27"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Broadcast Message Body</label>
              <textarea
                rows={3}
                placeholder="Details of the announcement or policy servicing update..."
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={announcementForm.urgent}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, urgent: e.target.checked })}
                className="rounded text-sky-600"
              />
              <span>Mark as High-Priority / Urgent Alert</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0b2a59] hover:bg-[#0091da] text-white rounded-xl font-bold transition shadow"
            >
              Broadcast Alert
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
