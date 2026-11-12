import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw, 
  AlertCircle, 
  TrendingUp, 
  HeartHandshake, 
  HelpCircle,
  FileText,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VERIFIED_POLICIES } from '../data/verifiedPolicies';
import { generatePolicyRecommendations } from '../utils/calculators';
import { formatINR } from '../utils/formatters';

export default function RecommendationEnginePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Assessment inputs
  const [inputs, setInputs] = useState({
    age: 32,
    annualIncome: 1500000,
    monthlyExpenses: 50000,
    savings: 600000,
    occupation: 'Salaried Corporate',
    existingCoverage: 2500000,
    dependents: 2,
    goal: 'family-protection', // 'family-protection' | 'savings' | 'wealth' | 'retirement' | 'child-education' | 'tax'
    budget: 45000,
    preferredDuration: 30,
    riskTolerance: 'moderate' // 'low' | 'moderate' | 'high'
  });

  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const output = generatePolicyRecommendations(inputs, VERIFIED_POLICIES);
    setResults(output);
    setFormSubmitted(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormSubmitted(false);
    setResults(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Fiduciary Policy Recommendation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Find the Right Policy for You
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Unbiased, algorithmically scored life insurance matching based on verified IRDAI guidelines, your family's protection needs, life goals, and cash flow budget.
        </p>
      </div>

      {/* Main Assessment Questionnaire */}
      {!formSubmitted ? (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* Section 1: Demographics */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-[#0b2a59] uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Personal & Employment Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Current Age</label>
                  <input
                    type="number"
                    min="18"
                    max="75"
                    value={inputs.age}
                    onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Gross Income</label>
                  <input
                    type="number"
                    step="50000"
                    value={inputs.annualIncome}
                    onChange={(e) => setInputs({ ...inputs, annualIncome: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{formatINR(inputs.annualIncome)}</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Financial Dependents</label>
                  <select
                    value={inputs.dependents}
                    onChange={(e) => setInputs({ ...inputs, dependents: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value={0}>0 (Self only)</option>
                    <option value={1}>1 (Spouse / Parent)</option>
                    <option value={2}>2 (Spouse + 1 Child)</option>
                    <option value={3}>3 (Spouse + 2 Children)</option>
                    <option value={4}>4+ (Extended Family)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Financial Health & Existing Protection */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-sm text-[#0b2a59] uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Cash Flow & Existing Life Cover
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Expenses (INR)</label>
                  <input
                    type="number"
                    step="5000"
                    value={inputs.monthlyExpenses}
                    onChange={(e) => setInputs({ ...inputs, monthlyExpenses: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Liquid Savings</label>
                  <input
                    type="number"
                    step="50000"
                    value={inputs.savings}
                    onChange={(e) => setInputs({ ...inputs, savings: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Existing Life Cover</label>
                  <input
                    type="number"
                    step="500000"
                    value={inputs.existingCoverage}
                    onChange={(e) => setInputs({ ...inputs, existingCoverage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{formatINR(inputs.existingCoverage)}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Goals & Risk */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-sm text-[#0b2a59] uppercase tracking-wider border-b border-slate-100 pb-2">
                3. Primary Financial Goal & Budget
              </h3>

              <div>
                <label className="block font-bold text-slate-700 mb-2">What is your primary financial objective?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'family-protection', title: 'Pure Family Protection', desc: 'Maximum death benefit life cover at lowest cost (Term Insurance)' },
                    { id: 'savings', title: 'Guaranteed Regular Income', desc: 'Secure capital and predictable yearly payouts without market risk' },
                    { id: 'wealth', title: 'Wealth Creation (ULIP)', desc: 'High-growth market-linked compounding across equity/debt funds' },
                    { id: 'retirement', title: 'Retirement & Lifetime Annuity', desc: 'Guaranteed pension income starting after retirement' },
                    { id: 'child-education', title: 'Child Education & College', desc: 'Milestone college payouts with premium waiver security' },
                    { id: 'tax', title: 'Tax Planning (80C / 10(10D))', desc: 'Optimize tax savings while building family protection' }
                  ].map(g => (
                    <label
                      key={g.id}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                        inputs.goal === g.id
                          ? 'border-[#0091da] bg-sky-50/70 ring-2 ring-sky-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="primaryGoal"
                        checked={inputs.goal === g.id}
                        onChange={() => setInputs({ ...inputs, goal: g.id })}
                        className="mt-0.5 text-sky-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{g.title}</div>
                        <div className="text-[11px] text-slate-500 leading-tight">{g.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Premium Budget (INR)</label>
                  <input
                    type="number"
                    step="5000"
                    value={inputs.budget}
                    onChange={(e) => setInputs({ ...inputs, budget: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{formatINR(inputs.budget)} per year</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Risk Appetite</label>
                  <select
                    value={inputs.riskTolerance}
                    onChange={(e) => setInputs({ ...inputs, riskTolerance: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="low">Conservative (Zero market risk / Guaranteed return)</option>
                    <option value="moderate">Moderate (Balanced savings and growth)</option>
                    <option value="high">Aggressive (Maximum equity exposure for high returns)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero commission bias • Ranked by underwriting fit</span>
              </span>

              <button
                type="submit"
                className="px-8 py-3 bg-[#0091da] hover:bg-[#007cb8] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Tailored Recommendations</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8 animate-in fade-in">
          
          {/* Diagnostic Summary Header */}
          <div className="bg-gradient-to-br from-[#0b2a59] to-[#0e356e] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30">
                Evaluation Complete
              </span>
              <h2 className="text-2xl font-black">
                Personalized Recommendation Results
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed">
                Based on your annual income of {formatINR(inputs.annualIncome)}, age {inputs.age}, and {inputs.dependents} dependent(s), here is your financial diagnostic:
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-2 min-w-[240px]">
              <div className="flex justify-between">
                <span className="text-slate-300">Ideal Human Life Value:</span>
                <span className="font-bold text-white font-mono">{formatINR(results.idealLifeCover, { compact: true })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Existing Coverage:</span>
                <span className="font-mono text-slate-200">{formatINR(inputs.existingCoverage, { compact: true })}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1">
                <span className="text-amber-300 font-bold">Uninsured Gap:</span>
                <span className="font-bold text-amber-300 font-mono">{formatINR(results.coverageGap, { compact: true })}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Inputs</span>
            </button>
          </div>

          {/* Top Ranked Recommendations Cards */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
              Top Matched Policies for You
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.recommendations.map((rec, index) => {
                const p = rec.policy;
                return (
                  <div 
                    key={p.id}
                    className="bg-white rounded-2xl border-2 border-sky-300 shadow-md p-6 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Rank Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#0b2a59] text-white flex items-center justify-center font-black text-xs">
                          #{index + 1}
                        </span>
                        <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                          {p.categoryName}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {rec.score}% Match Score
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-black text-lg text-slate-900">{p.name}</h4>
                      <p className="text-xs font-mono text-slate-400">UIN: {p.uin}</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">"{p.tagline}"</p>
                    </div>

                    {/* Why this policy suits your profile */}
                    <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                        Why this is recommended for you:
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        {rec.rationale.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quote and Term Suggestions */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs mb-4">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase block">Suggested Cover</span>
                        <strong className="text-slate-900 text-sm">{formatINR(rec.suggestedCoverage, { compact: true })}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase block">Estimated Premium</span>
                        <strong className="text-[#0b2a59] text-sm font-mono">{formatINR(rec.indicativeQuote.total)}/yr</strong>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/policy/${p.id}`}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        View Full Details →
                      </Link>

                      <Link
                        to={`/apply?policy=${p.id}&sumAssured=${rec.suggestedCoverage}&age=${inputs.age}`}
                        className="px-4 py-2 bg-[#0b2a59] hover:bg-[#0091da] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <span>Apply For This Plan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suitable Alternatives */}
          {results.alternatives && results.alternatives.length > 0 && (
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">
                Consider These Alternatives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.alternatives.map((alt) => (
                  <div key={alt.policy.id} className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                      {alt.policy.categoryName}
                    </span>
                    <h5 className="font-bold text-slate-900">{alt.policy.name}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{alt.policy.tagline}</p>
                    <Link
                      to={`/policy/${alt.policy.id}`}
                      className="text-xs font-bold text-sky-700 hover:underline inline-block pt-1"
                    >
                      Compare Features →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fiduciary / Regulatory Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5 font-bold">Important Statutory Recommendation Notice:</strong>
              The recommendations generated above are indicative and based on automated rules reflecting standard financial planning heuristics. Insurance is the subject matter of solicitation. Please consult with an authorized SBI Life Insurance representative or certified financial planner to verify specific tax, medical, and underwriting implications before purchasing.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
