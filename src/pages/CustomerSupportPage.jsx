import React, { useState } from 'react';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  LifeBuoy, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Building,
  AlertCircle
} from 'lucide-react';
import { FAQS, GRIEVANCE_REPRESENTATIVES, BRANCH_LOCATIONS } from '../data/mockFaqs';
import { usePolicy } from '../context/PolicyContext';

export default function CustomerSupportPage() {
  const { supportTickets, raiseSupportTicket } = usePolicy();

  // Accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState({});
  const [selectedCity, setSelectedCity] = useState('All');

  // New ticket state
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Policy Servicing',
    policyNumber: '',
    description: ''
  });
  const [ticketSuccess, setTicketSuccess] = useState(null);

  const toggleFaq = (categoryIdx, questionIdx) => {
    const key = `${categoryIdx}_${questionIdx}`;
    setOpenFaqIndex(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const newTkt = raiseSupportTicket({
      subject: ticketForm.subject,
      category: ticketForm.category,
      policyNumber: ticketForm.policyNumber || 'All Policies',
      description: ticketForm.description,
      priority: 'Normal'
    });

    setTicketSuccess(newTkt);
    setTicketForm({ subject: '', category: 'Policy Servicing', policyNumber: '', description: '' });
  };

  const filteredBranches = selectedCity === 'All' 
    ? BRANCH_LOCATIONS 
    : BRANCH_LOCATIONS.filter(b => b.city === selectedCity);

  const cities = ['All', ...new Set(BRANCH_LOCATIONS.map(b => b.city))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
          <LifeBuoy className="w-4 h-4 text-[#0091da]" />
          <span>Customer Care & Grievance Redressal</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Help Desk & Policy Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          24x7 self-servicing resources, verified FAQs, branch contact details, and multi-tier statutory grievance escalation matrix.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b2a59] flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Toll-Free Helpline</h3>
          <p className="text-sm font-bold text-[#0091da]">1800 267 9090</p>
          <p className="text-[11px] text-slate-400">Available 9:00 AM to 9:00 PM, Mon-Sat</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Email Customer Service</h3>
          <p className="text-sm font-bold text-[#0091da]">info@sbilife.co.in</p>
          <p className="text-[11px] text-slate-400">Response within 24-48 business hours</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Quick SMS Service</h3>
          <p className="text-sm font-bold text-emerald-800">SMS "MYPOLICY" to 56161</p>
          <p className="text-[11px] text-slate-400">Instant SMS policy balance & due date</p>
        </div>
      </div>

      {/* RAISE A SUPPORT TICKET & EXISTING TICKETS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Raise a Ticket Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Raise a Servicing Request / Ticket</h3>
            <p className="text-xs text-slate-500">
              Submit requests for nominee modification, address update, fund switches, or claim inquiries.
            </p>
          </div>

          {ticketSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ticket Registered: {ticketSuccess.ticketNumber}</span>
              </div>
              <p>Your request has been queued. Our customer service representative will respond within 48 hours.</p>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Request Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Policy Servicing">Policy Servicing (Address/Nominee)</option>
                  <option value="Premium Payment Query">Premium Payment / Invoice Query</option>
                  <option value="Fund Servicing">Fund Switch & Redirection (ULIP)</option>
                  <option value="Claim Assistance">Death / Maturity Claim Assistance</option>
                  <option value="Dispute / Grievance">Grievance Escalation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Policy Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 1120****4812"
                  value={ticketForm.policyNumber}
                  onChange={(e) => setTicketForm({ ...ticketForm, policyNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of your inquiry..."
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Please describe your servicing request or question in detail..."
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0091da] hover:bg-[#007cb8] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Servicing Ticket</span>
            </button>
          </form>
        </div>

        {/* Right: Existing Tickets Tracker (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Your Recent Service Tickets</h3>

          <div className="space-y-3">
            {supportTickets.map(tkt => (
              <div key={tkt.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-sky-800">{tkt.ticketNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tkt.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {tkt.status}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900">{tkt.subject}</h5>
                <p className="text-slate-500 text-[11px]">Logged: {tkt.createdAt}</p>
                {tkt.lastReply && (
                  <div className="p-2 bg-white rounded border border-slate-200 text-slate-700 text-[11px] mt-1">
                    <strong>Response:</strong> {tkt.lastReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. FREQUENTLY ASKED QUESTIONS */}
      <div id="faqs" className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
        <div>
          <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative answers to common questions about renewals, claims, tax deductions, and policies.
          </p>
        </div>

        <div className="space-y-6">
          {FAQS.map((category, catIdx) => (
            <div key={catIdx} className="space-y-3">
              <h3 className="font-extrabold text-sm text-[#0b2a59] uppercase tracking-wider pb-1 border-b border-slate-100">
                {category.category}
              </h3>

              <div className="space-y-2">
                {category.questions.map((faq, qIdx) => {
                  const isOpen = openFaqIndex[`${catIdx}_${qIdx}`];
                  return (
                    <div 
                      key={qIdx} 
                      className="border border-slate-200 rounded-xl overflow-hidden transition"
                    >
                      <button
                        onClick={() => toggleFaq(catIdx, qIdx)}
                        className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-[#0b2a59] flex items-center justify-between gap-4 bg-slate-50/50"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GRIEVANCE REDRESSAL MATRIX */}
      <div id="grievance" className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Statutory Escalation Protocol</span>
          </div>
          <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">
            IRDAI Grievance Redressal Mechanism
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            If your service request remains unresolved, you are entitled to escalate across our certified 4-level grievance hierarchy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {GRIEVANCE_REPRESENTATIVES.escalationLevels.map((lvl, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#0b2a59] text-white flex items-center justify-center font-bold text-xs">
                {idx + 1}
              </span>
              <h4 className="font-bold text-slate-900 leading-snug">{lvl.level}</h4>
              <p className="text-[11px] text-slate-500">Turnaround: {lvl.turnaround}</p>
              {lvl.email && (
                <p className="font-mono text-sky-700 font-semibold">{lvl.email}</p>
              )}
              {lvl.url && (
                <a href={lvl.url} target="_blank" rel="noreferrer" className="text-sky-700 font-bold flex items-center gap-1 hover:underline">
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. BRANCH LOCATOR */}
      <div id="branch" className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-700" />
              <span>Locate SBI Life Branches</span>
            </h2>
            <p className="text-xs text-slate-500">Visit any of our 1,000+ branches for in-person servicing.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-600">Select City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {filteredBranches.map((b, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">{b.city} Branch</h4>
              <p className="text-[10px] text-sky-700 font-bold uppercase">{b.state}</p>
              <p className="text-slate-600 text-[11px] leading-relaxed pt-1">{b.address}</p>
              <p className="font-mono text-slate-700 pt-2 font-semibold">Tel: {b.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
