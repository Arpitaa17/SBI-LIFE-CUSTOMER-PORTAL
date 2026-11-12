import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Check, ArrowRight, Scale, Clock, HeartHandshake, Star } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { usePolicy } from '../context/PolicyContext';

export default function PolicyCard({ policy }) {
  const { compareList, toggleCompare } = usePolicy();
  const isCompared = compareList.includes(policy.id);

  return (
    <div className="card-hover-effect bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden group relative hover:border-sky-300/80 transition-all duration-300">
      
      {/* Top Banner Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0b2a59] via-[#0091da] to-cyan-400 group-hover:h-2 transition-all duration-300"></div>

      <div className="p-6 pb-4">
        {/* Category & Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-extrabold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200/60 uppercase tracking-wide">
            {policy.categoryName}
          </span>
          {policy.badge ? (
            <span className="text-[10px] font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1 shadow-2xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{policy.badge}</span>
            </span>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.8</span>
            </div>
          )}
        </div>

        {/* Title & UIN */}
        <h3 className="font-black text-lg text-slate-900 group-hover:text-[#0b2a59] transition-colors leading-snug">
          <Link to={`/policy/${policy.id}`}>
            {policy.name}
          </Link>
        </h3>
        <p className="text-[11px] font-mono text-slate-400 mt-0.5">UIN: {policy.uin}</p>

        {/* Tagline */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-2.5 leading-relaxed font-normal">
          {policy.tagline || policy.summary}
        </p>
      </div>

      {/* High-Fidelity Specs Grid */}
      <div className="px-6 py-3.5 bg-gradient-to-br from-slate-50 to-slate-100/50 border-y border-slate-100 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Entry Age</span>
          <span className="font-extrabold text-slate-900">{policy.minEntryAge} - {policy.maxEntryAge} Yrs</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Policy Term</span>
          <span className="font-extrabold text-slate-900">{policy.minPolicyTerm} - {policy.maxPolicyTerm} Yrs</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min Sum Assured</span>
          <span className="font-black text-[#0b2a59] font-sans">{formatINR(policy.minSumAssured, { compact: true })}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tax Benefits</span>
          <span className="font-extrabold text-emerald-700">Sec 80C & 10(10D)</span>
        </div>
      </div>

      {/* Feature Bullet Points */}
      <div className="p-6 py-4 flex-1 space-y-2 text-xs">
        {policy.deathBenefit && (
          <div className="flex items-start gap-2 text-slate-700">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span className="line-clamp-1"><strong className="text-slate-900 font-bold">Death Cover:</strong> {policy.deathBenefit}</span>
          </div>
        )}
        {policy.maturityBenefit && (
          <div className="flex items-start gap-2 text-slate-700">
            <div className="w-4 h-4 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span className="line-clamp-1"><strong className="text-slate-900 font-bold">Maturity:</strong> {policy.maturityBenefit}</span>
          </div>
        )}
      </div>

      {/* Footer Action Strip */}
      <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={() => toggleCompare(policy.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
            isCompared 
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
              : 'text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Compare with other plans"
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isCompared ? 'Compared' : 'Compare'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/policy/${policy.id}`}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 px-2.5 py-2 transition"
          >
            Details
          </Link>
          <Link
            to={`/apply?policy=${policy.id}`}
            className="btn-shine px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#0b2a59] to-[#0091da] hover:opacity-95 shadow-md transition flex items-center gap-1.5"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
