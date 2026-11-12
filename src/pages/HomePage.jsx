import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Sparkles, 
  CreditCard, 
  FileText, 
  Scale, 
  ArrowRight, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Search, 
  Compass, 
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Calculator,
  Lock,
  HeartHandshake,
  Check,
  Star
} from 'lucide-react';
import { VERIFIED_POLICIES, POLICY_CATEGORIES } from '../data/verifiedPolicies';
import PolicyCard from '../components/PolicyCard';
import { useAuth } from '../context/AuthContext';
import { usePolicy } from '../context/PolicyContext';
import { formatINR } from '../utils/formatters';

export default function HomePage() {
  const { user, isLoggedIn } = useAuth();
  const { userPolicies, payments } = usePolicy();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [heroSearch, setHeroSearch] = useState('');

  // Interactive Hero Quote Teaser
  const [heroAge, setHeroAge] = useState(30);
  const [heroSumAssured, setHeroSumAssured] = useState(10000000); // ₹1 Cr

  // Find upcoming payment reminder
  const upcomingPayment = payments.find(p => p.status === 'Pending');

  const filteredPolicies = selectedCategory === 'all'
    ? VERIFIED_POLICIES.slice(0, 6)
    : VERIFIED_POLICIES.filter(p => p.category === selectedCategory).slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  // Rough indicative calculation for Hero teaser
  const indicativeHeroPremium = Math.round((heroSumAssured / 100000) * 95 * (1 + (heroAge - 25) * 0.038) * 1.18);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. ULTRA-PREMIUM HERO SECTION */}
      <section className="relative bg-[#051329] text-white pt-16 pb-28 sm:pb-32 overflow-hidden">
        {/* Ambient Glowing Radial Mesh Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-cyan-400/20 via-indigo-600/15 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute top-[30%] right-[25%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

        {/* Subtle Geometric Background Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-semibold text-cyan-300 shadow-lg">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>SBI Life Smart Portal • Backed by State Bank of India</span>
              </div>

              {/* Headline with Gradient Accent */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Guaranteed Protection. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-200 bg-clip-text text-transparent">
                  Uncompromised Trust.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Discover verified SBI Life policies, calculate exact premium quotations, explore AI-guided personalized recommendations, track your installments, and download 80C tax receipts from one unified platform.
              </p>

              {/* Premium Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex items-center max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl border border-white/30 focus-within:ring-2 focus-within:ring-cyan-400 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by policy (e.g. eShield Next, Smart Platina)..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full text-slate-900 text-xs sm:text-sm px-2 py-2 focus:outline-none placeholder:text-slate-400 font-medium bg-transparent"
                />
                <button
                  type="submit"
                  className="btn-shine px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0b2a59] to-[#0091da] hover:opacity-95 text-white transition flex items-center gap-1.5 flex-shrink-0 shadow-md cursor-pointer"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/explore"
                  className="px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-[#051329] bg-white hover:bg-slate-100 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Explore All 15 Policies</span>
                  <ArrowRight className="w-4 h-4 text-[#0091da]" />
                </Link>

                <Link
                  to="/recommendations"
                  className="btn-shine px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0091da] to-[#0062a4] hover:opacity-95 border border-cyan-400/30 shadow-xl transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Find Right Policy (AI Matcher)</span>
                </Link>
              </div>

              {/* Badges Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">99.2% Claim Settlement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">IRDAI Reg. No. 111</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Section 80C Tax Savings</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Quote & Glass Hub (5 cols) */}
            <div className="lg:col-span-5 relative">
              
              {/* Floating Glow Card */}
              <div className="relative glass-dark rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 text-white backdrop-blur-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                      SBI
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Instant Quote Generator</h3>
                      <p className="text-[11px] text-cyan-200">Real-time indicative calculation</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    Live Rates
                  </span>
                </div>

                {/* Interactive Slider Teaser */}
                <div className="py-4 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Your Age</span>
                      <span className="font-bold text-cyan-300 font-mono text-sm">{heroAge} Years</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="65"
                      value={heroAge}
                      onChange={(e) => setHeroAge(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Desired Life Cover (Term)</span>
                      <span className="font-bold text-cyan-300 font-sans text-sm">{formatINR(heroSumAssured, { compact: true })}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {[5000000, 10000000, 20000000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHeroSumAssured(val)}
                          className={`py-1 rounded-xl text-center font-bold text-[11px] transition ${
                            heroSumAssured === val
                              ? 'bg-cyan-400 text-slate-950 font-black'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {formatINR(val, { compact: true })}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculated Result Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/80 to-[#0b2a59] border border-cyan-500/30 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 block">
                      Estimated Indicative Premium
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                        {formatINR(indicativeHeroPremium)}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">/ year (incl. GST)</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-300 pt-2 mt-2 border-t border-white/10">
                      <span>Approx {formatINR(Math.round(indicativeHeroPremium / 12))}/mo</span>
                      <span className="text-emerald-300 font-semibold">✓ Tax Free Claim u/s 10(10D)</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/apply?policy=sbi-life-eshield-next&sumAssured=${heroSumAssured}&age=${heroAge}`}
                  className="btn-shine w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:opacity-95 text-slate-950 shadow-xl transition flex items-center justify-center gap-2 cursor-pointer font-black"
                >
                  <span>Apply with this Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* If user logged in and has pending payment, show subtle notification */}
                {upcomingPayment && (
                  <div className="mt-4 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="truncate">Due: {upcomingPayment.policyName}</span>
                    </div>
                    <Link to="/premium-payments" className="font-bold underline text-white whitespace-nowrap ml-2">
                      Pay Now →
                    </Link>
                  </div>
                )}
              </div>

              {/* Floating decorative badge */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-100 animate-float">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black">
                  ★
                </div>
                <div className="text-left">
                  <div className="text-xs font-black">Rated 4.9 / 5.0</div>
                  <div className="text-[10px] text-slate-500">By 1.2 Lakh+ Policyholders</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS & CREDIBILITY BAR (Floating Glassmorphism) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-2 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#0b2a59] tracking-tight">99.2%</div>
            <div className="text-xs font-bold text-slate-800">Claim Settlement Ratio</div>
            <div className="text-[11px] text-slate-500">IRDAI Certified Performance</div>
          </div>
          <div className="p-2 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-sky-600 tracking-tight">2.5 Cr+</div>
            <div className="text-xs font-bold text-slate-800">Lives Protected</div>
            <div className="text-[11px] text-slate-500">Pan-India Policyholder Trust</div>
          </div>
          <div className="p-2 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">₹3.5L Cr+</div>
            <div className="text-xs font-bold text-slate-800">Assets Managed (AUM)</div>
            <div className="text-[11px] text-slate-500">Prudent & Safe Solvency</div>
          </div>
          <div className="p-2 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">1,000+</div>
            <div className="text-xs font-bold text-slate-800">Branch Network</div>
            <div className="text-[11px] text-slate-500">+ 22,000 SBI Bank Outlets</div>
          </div>
        </div>
      </section>

      {/* 3. POLICY CATALOGUE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-[#0091da]" />
              <span>Verified Product Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore SBI Life Insurance Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic, up-to-date plans filed with IRDAI. Choose from protection, guaranteed income, market-linked growth, or retirement annuities.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 self-start md:self-auto group"
          >
            <span>View All {VERIFIED_POLICIES.length} Verified Policies</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {POLICY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#0b2a59] to-[#004b87] text-white shadow-lg shadow-blue-900/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Policy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPolicies.map(policy => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </section>

      {/* 4. AI RECOMMENDATION WOW BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 text-white overflow-hidden shadow-2xl bg-gradient-to-br from-[#06193b] via-[#092b66] to-[#01427c]">
          {/* Subtle Ambient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Financial Diagnostic</span>
            </span>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Confused About Which Policy Fits Your Family?
            </h3>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Answer 7 simple questions about your age, annual income, dependents, and financial goals. Our intelligent engine evaluates all SBI Life products against verified guidelines to calculate your exact Human Life Value and recommend the top 3 plans with transparent reasons.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/recommendations"
                className="btn-shine inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs sm:text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-xl transition-all hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Launch 2-Min Policy Matcher Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-cyan-200 font-medium">100% Free • No Phone Calls</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEAMLESS CUSTOMER JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
            End-to-End Digital Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How SBI Life Digital Portal Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From discovering the right coverage to policy issuance and paperless annual renewals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-[#0b2a59] font-black text-xl flex items-center justify-center mb-4 shadow-xs">
              1
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">Explore & Compare</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse authentic SBI Life plans, filter by age/budget, and compare terms side-by-side.
            </p>
          </div>

          <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-700 font-black text-xl flex items-center justify-center mb-4 shadow-xs">
              2
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">Instant Live Quote</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculate indicative premiums tailored to your exact age, chosen term, and add-on riders.
            </p>
          </div>

          <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 font-black text-xl flex items-center justify-center mb-4 shadow-xs">
              3
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">Digital KYC & Apply</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit proposal details, nominee disclosures, and CKYC through verified encrypted channels.
            </p>
          </div>

          <div className="card-hover-effect bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center mb-4 shadow-xs">
              4
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">Pay & Track 24x7</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitor milestones, receive payment alerts, pay via SBI ePay, and download 80C receipts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
