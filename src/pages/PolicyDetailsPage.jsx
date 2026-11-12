import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Scale, 
  HeartHandshake, 
  Calendar, 
  DollarSign,
  ChevronRight,
  Info
} from 'lucide-react';
import { VERIFIED_POLICIES } from '../data/verifiedPolicies';
import PremiumCalculatorWidget from '../components/PremiumCalculatorWidget';
import { usePolicy } from '../context/PolicyContext';
import { formatINR } from '../utils/formatters';

export default function PolicyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { compareList, toggleCompare } = usePolicy();

  const [activeTab, setActiveTab] = useState('overview');

  const policy = VERIFIED_POLICIES.find(p => p.id === id) || VERIFIED_POLICIES[0];
  const isCompared = compareList.includes(policy.id);

  const handleApplyWithQuote = (calcData) => {
    navigate(`/apply?policy=${policy.id}&age=${calcData.age}&sumAssured=${calcData.sumAssured}&premium=${calcData.quote.total}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/explore" className="hover:text-slate-800">Explore Policies</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">{policy.name}</span>
      </div>

      {/* Hero Banner with Product Header */}
      <div className="bg-gradient-to-r from-[#0b2a59] via-[#0e356e] to-[#004b87] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/30">
              {policy.categoryName}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 font-mono text-xs">
              UIN: {policy.uin}
            </span>
            {policy.badge && (
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-bold text-xs">
                ★ {policy.badge}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {policy.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {policy.summary}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-cyan-200">
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-semibold">Entry Age</span>
              <span className="text-white font-bold text-sm">{policy.minEntryAge} to {policy.maxEntryAge} Years</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-semibold">Min Sum Assured</span>
              <span className="text-white font-bold text-sm">{formatINR(policy.minSumAssured, { compact: true })}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-semibold">Max Maturity Age</span>
              <span className="text-white font-bold text-sm">Up to {policy.maxMaturityAge} Years</span>
            </div>
          </div>
        </div>

        {/* Action Panel in Hero */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col gap-3 min-w-[280px]">
          <Link
            to={`/apply?policy=${policy.id}`}
            className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-[#0b2a59] bg-white hover:bg-slate-100 shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>Start Online Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => toggleCompare(policy.id)}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-2 ${
              isCompared 
                ? 'bg-amber-400 text-slate-900 border-amber-400' 
                : 'bg-transparent text-white border-white/40 hover:bg-white/10'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isCompared ? 'Added to Compare Matrix' : 'Compare With Other Plans'}</span>
          </button>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <a 
              href={policy.officialUrl} 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>SBI Life Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-emerald-300 font-semibold">✓ 100% Verified</span>
          </div>
        </div>
      </div>

      {/* Main Content & Interactive Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Details & Tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Target Profile' },
              { id: 'benefits', label: 'Benefits & Payouts' },
              { id: 'eligibility', label: 'Eligibility & Terms' },
              { id: 'riders', label: 'Riders & Tax Perks' },
              { id: 'illustration', label: 'Benefit Illustration' }
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

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900">About the Plan</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {policy.summary}
                </p>

                <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-sky-900">Intended Customer Profile</h4>
                    <p className="text-xs text-sky-800 mt-0.5 leading-relaxed">
                      {policy.customerProfile}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Options if available */}
              {policy.planOptions && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-base text-slate-900">Available Plan Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {policy.planOptions.map((opt, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-[#0b2a59] block mb-1">
                          Option {idx + 1}: {opt.name}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BENEFITS & PAYOUTS */}
          {activeTab === 'benefits' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900">Death & Maturity Benefits</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-rose-700 font-bold mb-1">
                      <Shield className="w-4 h-4" />
                      <span>Death Benefit</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {policy.deathBenefit}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Maturity / Survival Benefit</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {policy.maturityBenefit}
                    </p>
                  </div>

                  {policy.terminalIllnessBenefit && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-purple-700 font-bold mb-1">
                        <Info className="w-4 h-4" />
                        <span>Accelerated Terminal Illness Benefit</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {policy.terminalIllnessBenefit}
                      </p>
                    </div>
                  )}

                  {policy.betterHalfBenefit && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-sky-700 font-bold mb-1">
                        <HeartHandshake className="w-4 h-4" />
                        <span>Better Half Benefit (Spouse Cover)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {policy.betterHalfBenefit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ELIGIBILITY & TERMS */}
          {activeTab === 'eligibility' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
              <h3 className="font-bold text-base text-slate-900">Eligibility Criteria</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Minimum / Maximum Entry Age</span>
                  <span className="text-sm font-bold text-slate-900">{policy.minEntryAge} to {policy.maxEntryAge} Years</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Minimum / Maximum Policy Term</span>
                  <span className="text-sm font-bold text-slate-900">{policy.minPolicyTerm} to {policy.maxPolicyTerm} Years</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Premium Payment Terms (PPT)</span>
                  <span className="text-xs font-bold text-slate-900">{policy.pptOptions?.join(', ')}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Frequencies</span>
                  <span className="text-xs font-bold text-slate-900">{policy.paymentFrequencies?.join(', ')}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sum Assured Limits</span>
                  <span className="text-xs font-bold text-slate-900">
                    Min: {formatINR(policy.minSumAssured)} | Max: {policy.maxSumAssured ? formatINR(policy.maxSumAssured) : 'No limit (Subject to underwriting)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RIDERS & TAX BENEFITS */}
          {activeTab === 'riders' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900">Tax Deductions & Benefits</h3>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <strong>Section 80C & Section 10(10D) Eligibility:</strong>
                  <p className="mt-1">{policy.taxBenefits}</p>
                </div>

                <h3 className="font-bold text-base text-slate-900 pt-2">Applicable Add-On Riders</h3>
                {policy.riders && policy.riders.length > 0 ? (
                  <div className="space-y-3 text-xs">
                    {policy.riders.map((r, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">{r.name}</div>
                          {r.uin && <div className="text-[10px] font-mono text-slate-400">UIN: {r.uin}</div>}
                        </div>
                        {r.extraCostPercent && (
                          <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            +{r.extraCostPercent}% Premium
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No external riders needed; key benefits are built into the primary policy design.</p>
                )}

                <h3 className="font-bold text-base text-slate-900 pt-2">Statutory Exclusions</h3>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  {policy.exclusions?.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: BENEFIT ILLUSTRATION */}
          {activeTab === 'illustration' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
              <h3 className="font-bold text-base text-slate-900">Standard Benefit Illustration Model</h3>
              <p className="text-xs text-slate-500">
                Sample illustration based on a 30-year-old non-smoker individual choosing standard terms.
              </p>

              <div className="overflow-x-auto text-xs">
                <table className="w-full border-collapse border border-slate-200 text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold">
                      <th className="p-2.5 border border-slate-200">Policy Year</th>
                      <th className="p-2.5 border border-slate-200">Age</th>
                      <th className="p-2.5 border border-slate-200">Annual Outflow</th>
                      <th className="p-2.5 border border-slate-200">Guaranteed Life Cover</th>
                      <th className="p-2.5 border border-slate-200">Expected Survival / Maturity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-2.5 border border-slate-200">Year 1</td>
                      <td className="p-2.5 border border-slate-200">31</td>
                      <td className="p-2.5 border border-slate-200">₹14,850</td>
                      <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">₹1,00,00,000</td>
                      <td className="p-2.5 border border-slate-200 font-sans text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200">Year 5</td>
                      <td className="p-2.5 border border-slate-200">35</td>
                      <td className="p-2.5 border border-slate-200">₹14,850</td>
                      <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">₹1,00,00,000</td>
                      <td className="p-2.5 border border-slate-200 font-sans text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200">Year 10</td>
                      <td className="p-2.5 border border-slate-200">40</td>
                      <td className="p-2.5 border border-slate-200">₹14,850</td>
                      <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">₹1,00,00,000</td>
                      <td className="p-2.5 border border-slate-200 font-sans text-slate-400">—</td>
                    </tr>
                    <tr className="bg-emerald-50/50 font-bold">
                      <td className="p-2.5 border border-slate-200">Year 30 (Maturity)</td>
                      <td className="p-2.5 border border-slate-200">60</td>
                      <td className="p-2.5 border border-slate-200">₹0 (Completed)</td>
                      <td className="p-2.5 border border-slate-200 text-slate-500 font-sans">Policy Term Ends</td>
                      <td className="p-2.5 border border-slate-200 text-emerald-800">
                        {policy.maturityBenefit || 'Term Completed'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Premium Calculator Widget (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            <PremiumCalculatorWidget 
              policy={policy} 
              onApplyClick={handleApplyWithQuote}
            />

            {/* Official Brochure Download Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Official Documentation</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Review the official IRDAI approved brochure, policy wording, and terms & conditions document.
              </p>
              <div className="space-y-2">
                <a
                  href={policy.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold flex items-center justify-between text-xs transition"
                >
                  <span>Official Product Webpage</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href={policy.brochureUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-800 font-semibold flex items-center justify-between text-xs transition"
                >
                  <span>Download Policy Brochure (PDF)</span>
                  <Download className="w-3.5 h-3.5 text-sky-700" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
