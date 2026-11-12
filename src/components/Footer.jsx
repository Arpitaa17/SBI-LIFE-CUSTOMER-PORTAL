import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, Award, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { GRIEVANCE_REPRESENTATIVES } from '../data/mockFaqs';

export default function Footer() {
  return (
    <footer className="bg-[#071936] text-slate-300 pt-16 pb-8 border-t border-[#0b2a59]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-sky-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">99.2% Settlement</h4>
              <p className="text-xs text-slate-400">Industry-leading claim settlement ratio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">2.5+ Crore Lives</h4>
              <p className="text-xs text-slate-400">Covered across urban and rural India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Solvency Ratio 2.15</h4>
              <p className="text-xs text-slate-400">Comfortably above IRDAI mandate of 1.50</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-purple-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">1800 267 9090</h4>
              <p className="text-xs text-slate-400">Toll-free customer care assistance</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          {/* Brand & Corporate */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0091da] flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">SBI LIFE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SBI Life Insurance Company Limited is a joint venture between State Bank of India (India's largest bank) and BNP Paribas Cardif. Regulated by the Insurance Regulatory and Development Authority of India (IRDAI).
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Natraj, M.V. Road & Western Express Highway, Andheri (E), Mumbai - 400069</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>info@sbilife.co.in</span>
              </p>
            </div>
          </div>

          {/* Insurance Plans */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Policy Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore?category=term" className="hover:text-white transition">Term Insurance</Link></li>
              <li><Link to="/explore?category=savings" className="hover:text-white transition">Savings & Guaranteed Return</Link></li>
              <li><Link to="/explore?category=endowment" className="hover:text-white transition">Endowment Plans</Link></li>
              <li><Link to="/explore?category=ulip" className="hover:text-white transition">ULIP Plans</Link></li>
              <li><Link to="/explore?category=retirement" className="hover:text-white transition">Retirement & Pension</Link></li>
              <li><Link to="/explore?category=child" className="hover:text-white transition">Child Insurance</Link></li>
              <li><Link to="/explore?category=whole-life" className="hover:text-white transition">Whole Life Insurance</Link></li>
            </ul>
          </div>

          {/* Customer Servicing */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Servicing & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/recommendations" className="text-sky-300 font-semibold hover:text-white transition">Policy Recommendation Engine</Link></li>
              <li><Link to="/compare" className="hover:text-white transition">Policy Comparison Tool</Link></li>
              <li><Link to="/premium-payments" className="hover:text-white transition">Pay Premium Online</Link></li>
              <li><Link to="/documents" className="hover:text-white transition">80C Tax Receipts</Link></li>
              <li><Link to="/timeline" className="hover:text-white transition">Maturity Tracker</Link></li>
              <li><Link to="/my-policies" className="hover:text-white transition">Policy Portfolio</Link></li>
            </ul>
          </div>

          {/* Regulatory & Grievance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Regulatory & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/support#grievance" className="hover:text-white transition">Grievance Redressal</Link></li>
              <li><a href="https://bimabharosa.irdai.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">IRDAI Bima Bharosa <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://www.cioins.co.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">Insurance Ombudsman <ExternalLink className="w-3 h-3" /></a></li>
              <li><Link to="/support#branch" className="hover:text-white transition">Locate Branches</Link></li>
              <li><Link to="/support#faqs" className="hover:text-white transition">Claims Procedure</Link></li>
            </ul>
          </div>
        </div>

        {/* Mandatory Statutory Notice under Section 41 & 45 */}
        <div className="py-8 text-[11px] text-slate-400 space-y-3 border-b border-slate-800 leading-relaxed">
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/60 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS/FRAUDULENT OFFERS:</strong> IRDAI clarifies to the public that IRDAI or its officials do not involve in activities like selling insurance policies, announcing bonuses or investment of premiums. Public receiving such phone calls are requested to lodge a police complaint.
            </div>
          </div>

          <p>
            <strong>Section 41 of the Insurance Act, 1938 (Prohibition of Rebates):</strong> (1) No person shall allow or offer to allow, either directly or indirectly, as an inducement to any person to take out or renew or continue an insurance in respect of any kind of risk relating to lives or property in India, any rebate of the whole or part of the commission payable or any rebate of the premium shown on the policy... Any person making default in complying with the provisions of this section shall be liable for a penalty which may extend to ten lakh rupees.
          </p>

          <p>
            <strong>Section 45 of the Insurance Act, 1938:</strong> No policy of life insurance shall be called in question on any ground whatsoever after the expiry of three years from the date of issuance of policy or risk commencement.
          </p>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SBI Life Insurance Company Limited. All rights reserved. IRDAI Regn. No. 111 | CIN: L99999MH2000PLC129113</p>
          <p className="text-[11px]">Trade logo displayed belongs to State Bank of India and is used by SBI Life under license.</p>
        </div>
      </div>
    </footer>
  );
}
