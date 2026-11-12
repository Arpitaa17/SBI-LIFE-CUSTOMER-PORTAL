import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  TrendingUp, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import { 
  formatINR, 
  formatDate, 
  calculateRemainingYears, 
  calculateElapsedYears 
} from '../utils/formatters';

export default function MaturityTrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPolicies } = usePolicy();

  const selectedPolicyId = searchParams.get('policy') || userPolicies[0]?.id;
  const currentPolicy = userPolicies.find(p => p.id === selectedPolicyId) || userPolicies[0];

  const handleSelectPolicy = (id) => {
    searchParams.set('policy', id);
    setSearchParams(searchParams);
  };

  const elapsedYears = calculateElapsedYears(currentPolicy?.commencementDate);
  const remainingYears = calculateRemainingYears(currentPolicy?.maturityDate);
  const percentComplete = Math.min(100, Math.round((Number(elapsedYears) / (currentPolicy?.totalTermYears || 1)) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4 text-[#0091da]" />
          <span>Long-Term Wealth & Longevity Roadmap</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Policy Timeline & Maturity Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Track verified policy milestones from inception through bonus accruals, lock-in expirations, and final maturity settlement.
        </p>
      </div>

      {/* Policy Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {userPolicies.map(pol => (
          <button
            key={pol.id}
            onClick={() => handleSelectPolicy(pol.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              currentPolicy?.id === pol.id
                ? 'bg-[#0b2a59] text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{pol.policyName}</span>
            <span className="font-mono text-[10px] opacity-75">({pol.maskedNumber})</span>
          </button>
        ))}
      </div>

      {currentPolicy && (
        <div className="space-y-8 animate-in fade-in">
          {/* Milestone Hero Card */}
          <div className="bg-gradient-to-r from-[#0b2a59] via-[#0e356e] to-[#004b87] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 font-bold text-xs border border-cyan-400/30">
                  {currentPolicy.categoryName} • Status: {currentPolicy.status}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {currentPolicy.policyName}
                </h2>
                <p className="text-xs text-slate-200 max-w-xl">
                  Policy Commencement: <strong>{formatDate(currentPolicy.commencementDate)}</strong> | Scheduled Maturity Date: <strong>{formatDate(currentPolicy.maturityDate)}</strong>
                </p>

                {/* Progress Bar */}
                <div className="pt-2 max-w-lg space-y-1.5">
                  <div className="flex justify-between text-xs text-cyan-200 font-semibold">
                    <span>{elapsedYears} Years Completed</span>
                    <span>{remainingYears} Years Remaining</span>
                  </div>
                  <div className="w-full h-3.5 bg-white/20 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-cyan-400 rounded-full shadow-inner"
                      style={{ width: `${percentComplete}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-xs space-y-2">
                <span className="text-slate-300 uppercase font-bold text-[10px] block">Sum Assured on Death</span>
                <div className="text-2xl font-black text-white font-sans">
                  {formatINR(currentPolicy.sumAssured)}
                </div>
                {currentPolicy.maturityBenefitEstimated && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-slate-300 text-[10px] block">Estimated Maturity Payout</span>
                    <span className="text-emerald-300 font-bold font-mono text-sm">
                      {formatINR(currentPolicy.maturityBenefitEstimated)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Visual Timeline Stepper */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
              Contract Lifecycle Milestones
            </h3>

            <div className="relative border-l-2 border-sky-200 ml-4 sm:ml-6 space-y-8 pb-4">
              {currentPolicy.milestones?.map((milestone, idx) => (
                <div key={idx} className="relative pl-6 sm:pl-8 group">
                  {/* Dot */}
                  <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-4 border-white ${
                    milestone.completed
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                      : 'bg-slate-200 text-slate-600 ring-2 ring-slate-100'
                  }`}>
                    {milestone.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  {/* Content Box */}
                  <div className={`p-4 rounded-2xl border transition ${
                    milestone.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="font-bold text-sm text-slate-900">{milestone.event}</h4>
                      <span className="font-mono text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                        Target Year: {milestone.year}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {milestone.completed 
                        ? 'Successfully archived and recorded in policy servicing database.'
                        : 'Scheduled future milestone. Ensure continuous regular premium payment to maintain guaranteed status.'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Statutory Protection Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Section 45 Indisputability Protection:</strong>
                As per Section 45 of the Insurance Act 1938, after the completion of 3 consecutive years from the policy risk commencement date, no policy of life insurance can be called in question or repudiated by the insurer on any ground whatsoever.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
