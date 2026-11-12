import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  X, 
  Plus, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import { VERIFIED_POLICIES } from '../data/verifiedPolicies';
import { formatINR } from '../utils/formatters';

export default function ComparePoliciesPage() {
  const { compareList, toggleCompare, clearCompare } = usePolicy();
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Selected policy objects
  const comparedPolicies = VERIFIED_POLICIES.filter(p => compareList.includes(p.id));

  // Available policies that can be added
  const availableToAdd = VERIFIED_POLICIES.filter(p => !compareList.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-[#0091da]" />
            <span>Policy Evaluation Tool</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Side-by-Side Policy Comparison
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Evaluate differences in coverage, premiums, guaranteed returns, lock-in terms, and exclusions across 2 to 4 SBI Life policies.
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition"
            >
              Clear All ({compareList.length})
            </button>
          </div>
        )}
      </div>

      {comparedPolicies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Policies Selected for Comparison</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose up to 4 SBI Life policies from the catalogue to compare terms, premiums, and benefits side-by-side.
          </p>
          <div className="pt-2">
            <Link
              to="/explore"
              className="px-5 py-2.5 bg-[#0b2a59] text-white rounded-xl text-xs font-bold hover:bg-[#0091da] transition inline-flex items-center gap-1.5"
            >
              <span>Browse Policy Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add Policy Dropdown Header */}
          {compareList.length < 4 && (
            <div className="relative inline-block">
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-[#0b2a59] flex items-center gap-2 shadow-xs transition"
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Add Another Policy ({compareList.length}/4)</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {selectorOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">Select to add:</div>
                  {availableToAdd.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        toggleCompare(p.id);
                        setSelectorOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 flex items-center justify-between text-slate-800"
                    >
                      <span className="font-semibold truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">{p.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comparison Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              {/* Table Header: Policy Names & Actions */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 w-60 text-xs font-bold text-slate-500 uppercase">Feature / Parameter</th>
                  {comparedPolicies.map(p => (
                    <th key={p.id} className="p-4 min-w-[240px] align-top border-l border-slate-200">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          {p.categoryName}
                        </span>
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        <Link to={`/policy/${p.id}`} className="hover:text-sky-700">
                          {p.name}
                        </Link>
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">UIN: {p.uin}</p>

                      <div className="mt-3">
                        <Link
                          to={`/apply?policy=${p.id}`}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#0b2a59] hover:bg-[#0091da] shadow-xs transition flex items-center justify-center gap-1"
                        >
                          <span>Apply Online</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {/* Product Nature */}
                <tr className="bg-slate-50/50">
                  <td colSpan={comparedPolicies.length + 1} className="p-2.5 font-bold text-[11px] uppercase tracking-wider text-[#0b2a59]">
                    1. Product Nature & Suitability
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Target Customer Profile</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700 leading-relaxed">
                      {p.customerProfile}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Key Tagline</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 text-slate-800 font-medium">
                      "{p.tagline}"
                    </td>
                  ))}
                </tr>

                {/* Eligibility */}
                <tr className="bg-slate-50/50">
                  <td colSpan={comparedPolicies.length + 1} className="p-2.5 font-bold text-[11px] uppercase tracking-wider text-[#0b2a59]">
                    2. Age & Term Eligibility
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Entry Age Range</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 font-bold text-slate-900">
                      {p.minEntryAge} to {p.maxEntryAge} Years
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Maximum Maturity Age</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 font-bold text-slate-900">
                      {p.maxMaturityAge} Years
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Policy Term Options</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700">
                      {p.minPolicyTerm} to {p.maxPolicyTerm} Years
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Premium Payment Terms</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700">
                      {p.pptOptions?.join(', ')}
                    </td>
                  ))}
                </tr>

                {/* Coverage & Payouts */}
                <tr className="bg-slate-50/50">
                  <td colSpan={comparedPolicies.length + 1} className="p-2.5 font-bold text-[11px] uppercase tracking-wider text-[#0b2a59]">
                    3. Sum Assured & Payouts
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Minimum Sum Assured</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 font-mono font-bold text-slate-900">
                      {formatINR(p.minSumAssured)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Death Benefit</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700">
                      {p.deathBenefit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Maturity / Survival Benefit</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 font-medium text-emerald-800">
                      {p.maturityBenefit}
                    </td>
                  ))}
                </tr>

                {/* Returns & Risk Type */}
                <tr className="bg-slate-50/50">
                  <td colSpan={comparedPolicies.length + 1} className="p-2.5 font-bold text-[11px] uppercase tracking-wider text-[#0b2a59]">
                    4. Returns Structure & Market Linkage
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Nature of Returns</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100">
                      {p.category === 'term' && <span className="font-bold text-slate-700">Pure Risk Protection (No market risk)</span>}
                      {p.category === 'savings' && <span className="font-bold text-emerald-700">Guaranteed Return (100% Capital Safe)</span>}
                      {p.category === 'endowment' && <span className="font-bold text-blue-700">Participating Bonus + Sum Assured</span>}
                      {p.category === 'ulip' && <span className="font-bold text-amber-700">Market-Linked (Equity/Debt Fund Choice)</span>}
                      {p.category === 'retirement' && <span className="font-bold text-purple-700">Guaranteed Lifelong Annuity Stream</span>}
                      {p.category === 'child' && <span className="font-bold text-emerald-700">Education Milestone Payouts + Waiver</span>}
                      {p.category === 'whole-life' && <span className="font-bold text-indigo-700">Guaranteed Legacy Payout till Age 100</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Tax Deductions</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700">
                      {p.taxBenefits}
                    </td>
                  ))}
                </tr>

                {/* Official Links */}
                <tr>
                  <td className="p-4 font-semibold text-slate-600 bg-slate-50/20">Official Brochure</td>
                  {comparedPolicies.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-100">
                      <a 
                        href={p.officialUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sky-700 hover:text-sky-900 font-bold inline-flex items-center gap-1"
                      >
                        <span>Official SBI Life Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
