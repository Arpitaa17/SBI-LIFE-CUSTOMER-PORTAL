import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Check, Sparkles, Percent } from 'lucide-react';
import { calculateIndicativePremium } from '../utils/calculators';
import { formatINR } from '../utils/formatters';

export default function PremiumCalculatorWidget({ policy, onApplyClick }) {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [sumAssured, setSumAssured] = useState(
    policy?.category === 'term' ? 10000000 : 1500000
  );
  const [policyTerm, setPolicyTerm] = useState(30);
  const [isTobacco, setIsTobacco] = useState(false);
  const [selectedRiders, setSelectedRiders] = useState([]);

  // Calculate quote dynamically
  const quote = useMemo(() => {
    return calculateIndicativePremium({
      policy,
      age: Number(age),
      gender,
      sumAssured: Number(sumAssured),
      policyTerm: Number(policyTerm),
      isTobacco,
      riders: selectedRiders
    });
  }, [policy, age, gender, sumAssured, policyTerm, isTobacco, selectedRiders]);

  const toggleRider = (rider) => {
    if (selectedRiders.some(r => r.name === rider.name)) {
      setSelectedRiders(selectedRiders.filter(r => r.name !== rider.name));
    } else {
      setSelectedRiders([...selectedRiders, rider]);
    }
  };

  // Approximate tax saving assuming 30% tax bracket u/s 80C
  const approxTaxSaved = Math.min(45000, Math.round(quote.base * 0.312));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 relative overflow-hidden">
      {/* Top subtle glow bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-[#0091da] to-[#0b2a59]"></div>

      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 text-[#0b2a59] flex items-center justify-center shadow-xs">
          <Calculator className="w-5 h-5 text-[#0091da]" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Indicative Premium Calculator</h3>
          <p className="text-[11px] text-slate-500">Official SBI Life actuarial rate estimation</p>
        </div>
      </div>

      <div className="space-y-5 text-xs">
        {/* Age Slider */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
          <div className="flex justify-between font-bold text-slate-700">
            <span>Your Current Age</span>
            <span className="font-black text-[#0b2a59] font-mono text-sm">{age} Years</span>
          </div>
          <input
            type="range"
            min={policy?.minEntryAge || 18}
            max={policy?.maxEntryAge || 65}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-[#0091da] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Min: {policy?.minEntryAge || 18} yrs</span>
            <span>Max: {policy?.maxEntryAge || 65} yrs</span>
          </div>
        </div>

        {/* Gender & Tobacco */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="font-bold text-slate-700 block mb-1.5">Gender</span>
            <div className="flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  gender === 'male' ? 'bg-[#0b2a59] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  gender === 'female' ? 'bg-[#0b2a59] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Female (-10%)
              </button>
            </div>
          </div>

          {policy?.category === 'term' ? (
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Tobacco Usage</span>
              <div className="flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsTobacco(false)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                    !isTobacco ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setIsTobacco(true)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                    isTobacco ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>
          ) : (
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Policy Term</span>
              <select
                value={policyTerm}
                onChange={(e) => setPolicyTerm(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
          )}
        </div>

        {/* Sum Assured Dropdown */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1.5">
            <span>Life Cover (Sum Assured)</span>
            <span className="font-black text-[#0b2a59] font-sans text-sm">{formatINR(sumAssured, { compact: true })}</span>
          </div>
          <select
            value={sumAssured}
            onChange={(e) => setSumAssured(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
          >
            {policy?.category === 'term' ? (
              <>
                <option value={5000000}>₹50 Lakhs Coverage</option>
                <option value={7500000}>₹75 Lakhs Coverage</option>
                <option value={10000000}>₹1 Crore Coverage (Recommended)</option>
                <option value={15000000}>₹1.5 Crores Coverage</option>
                <option value={20000000}>₹2 Crores Coverage</option>
                <option value={30000000}>₹3 Crores Coverage</option>
              </>
            ) : (
              <>
                <option value={500000}>₹5 Lakhs Basic Sum Assured</option>
                <option value={1000000}>₹10 Lakhs Basic Sum Assured</option>
                <option value={1500000}>₹15 Lakhs Basic Sum Assured</option>
                <option value={2500000}>₹25 Lakhs Basic Sum Assured</option>
                <option value={5000000}>₹50 Lakhs Basic Sum Assured</option>
              </>
            )}
          </select>
        </div>

        {/* Add-on Riders if available */}
        {policy?.riders && policy.riders.length > 0 && (
          <div>
            <span className="font-bold text-slate-700 block mb-1.5">Optional Comprehensive Riders</span>
            <div className="space-y-1.5">
              {policy.riders.map(r => {
                const isChecked = selectedRiders.some(item => item.name === r.name);
                return (
                  <label 
                    key={r.name} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      isChecked ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-200' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRider(r)}
                        className="rounded text-sky-600"
                      />
                      <span className="text-[11px] font-semibold text-slate-800">{r.name}</span>
                    </div>
                    <span className="text-[10px] text-sky-800 font-mono font-bold">+{r.extraCostPercent}%</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Output Quote Summary Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#061838] via-[#0b2a59] to-[#041d40] text-white space-y-4 shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider">
                Total Indicative Premium
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Sec 80C
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-sans tracking-tight">
                {formatINR(quote.total)}
              </span>
              <span className="text-xs text-slate-300 font-medium">/ year (incl. GST)</span>
            </div>

            <div className="space-y-1 text-xs pt-3 mt-3 border-t border-white/10 text-slate-300">
              <div className="flex justify-between">
                <span>Base Annual Premium:</span>
                <span className="font-mono text-white">{formatINR(quote.base)}</span>
              </div>
              {quote.ridersCost > 0 && (
                <div className="flex justify-between text-cyan-200">
                  <span>Riders Cost:</span>
                  <span className="font-mono">+{formatINR(quote.ridersCost)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Applicable GST:</span>
                <span className="font-mono text-white">{formatINR(quote.gst)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10 text-emerald-300 font-bold">
                <span>Estimated 80C Tax Saved:</span>
                <span className="font-mono">~{formatINR(approxTaxSaved)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onApplyClick) onApplyClick({ age, gender, sumAssured, isTobacco, quote });
            }}
            className="btn-shine w-full py-3 rounded-xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 hover:opacity-95 shadow-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <span>Apply Online with This Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
