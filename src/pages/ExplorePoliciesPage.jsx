import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Scale, 
  SlidersHorizontal, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { VERIFIED_POLICIES, POLICY_CATEGORIES } from '../data/verifiedPolicies';
import PolicyCard from '../components/PolicyCard';
import { usePolicy } from '../context/PolicyContext';
import { formatINR } from '../utils/formatters';

export default function ExplorePoliciesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { compareList, clearCompare } = usePolicy();

  // URL query params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Filter States
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [userAge, setUserAge] = useState('');
  const [coverageRange, setCoverageRange] = useState('all');
  const [financialGoal, setFinancialGoal] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'name' | 'min-age' | 'min-coverage'

  // Sync category with URL
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCat);
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setCategory('all');
    setSearchQuery('');
    setUserAge('');
    setCoverageRange('all');
    setFinancialGoal('all');
    setSortBy('popular');
    setSearchParams({});
  };

  // Filter Logic
  const filteredPolicies = useMemo(() => {
    return VERIFIED_POLICIES.filter(policy => {
      // 1. Category Filter
      if (category !== 'all' && policy.category !== category) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = policy.name.toLowerCase().includes(query);
        const matchUin = policy.uin.toLowerCase().includes(query);
        const matchSummary = (policy.summary || '').toLowerCase().includes(query);
        const matchTagline = (policy.tagline || '').toLowerCase().includes(query);
        if (!matchName && !matchUin && !matchSummary && !matchTagline) {
          return false;
        }
      }

      // 3. Age filter
      if (userAge !== '') {
        const age = Number(userAge);
        if (age < policy.minEntryAge || age > policy.maxEntryAge) {
          return false;
        }
      }

      // 4. Coverage Range
      if (coverageRange === 'under-25L' && policy.minSumAssured > 2500000) return false;
      if (coverageRange === '25L-1Cr' && (policy.minSumAssured > 10000000 || policy.maxSumAssured < 2500000)) return false;
      if (coverageRange === 'above-1Cr' && policy.maxSumAssured < 10000000) return false;

      // 5. Financial Goal Filter
      if (financialGoal === 'protection' && policy.category !== 'term' && policy.category !== 'whole-life') return false;
      if (financialGoal === 'savings' && policy.category !== 'savings' && policy.category !== 'endowment') return false;
      if (financialGoal === 'wealth' && policy.category !== 'ulip') return false;
      if (financialGoal === 'retirement' && policy.category !== 'retirement') return false;
      if (financialGoal === 'child' && policy.category !== 'child') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'min-age') return a.minEntryAge - b.minEntryAge;
      if (sortBy === 'min-coverage') return a.minSumAssured - b.minSumAssured;
      // Default: popular / rating
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [category, searchQuery, userAge, coverageRange, financialGoal, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-[#0091da]" />
          <span>IRDAI Registered Products</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Explore All SBI Life Insurance Policies
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Comprehensive catalogue of active individual life insurance, savings, pension, child, and ULIP products from SBI Life Insurance Company Limited.
        </p>
      </div>

      {/* Main Filter Bar & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Row 1: Search & Quick stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by policy name or UIN (e.g. 111N123V02)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-semibold text-slate-600">
              Showing <strong>{filteredPolicies.length}</strong> of {VERIFIED_POLICIES.length} verified plans
            </span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Filters (Age, Coverage, Goal, Sort) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Filter by Age */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Age</label>
            <input
              type="number"
              placeholder="e.g. 35"
              min="0"
              max="100"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Filter by Coverage */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Coverage Amount</label>
            <select
              value={coverageRange}
              onChange={(e) => setCoverageRange(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">Any Coverage</option>
              <option value="under-25L">Under ₹25 Lakhs</option>
              <option value="25L-1Cr">₹25 Lakhs to ₹1 Crore</option>
              <option value="above-1Cr">Above ₹1 Crore</option>
            </select>
          </div>

          {/* Filter by Goal */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Financial Goal</label>
            <select
              value={financialGoal}
              onChange={(e) => setFinancialGoal(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Goals</option>
              <option value="protection">Pure Family Protection</option>
              <option value="savings">Guaranteed Regular Income</option>
              <option value="wealth">Market-Linked Wealth (ULIP)</option>
              <option value="retirement">Retirement & Annuity</option>
              <option value="child">Child Higher Education</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Sort Results By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="popular">Most Popular</option>
              <option value="name">Policy Name (A-Z)</option>
              <option value="min-age">Minimum Entry Age</option>
              <option value="min-coverage">Sum Assured</option>
            </select>
          </div>
        </div>

        {/* Row 3: Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none">
          {POLICY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                category === cat.id
                  ? 'bg-[#0b2a59] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Results Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Policies Match Your Selected Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your age or coverage filters, or reset to view all available SBI Life policies.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#0b2a59] text-white rounded-xl text-xs font-bold hover:bg-[#0091da] transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map(policy => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}

      {/* Floating Bottom Comparison Bar (When 1 or more items are selected for comparison) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-[#071936] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom duration-300 max-w-xl w-[92%]">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-xs font-bold">{compareList.length} of 4 Policies Selected</div>
              <div className="text-[10px] text-slate-300">Ready for side-by-side comparison</div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={clearCompare}
              className="text-slate-400 hover:text-white p-1 text-xs"
              title="Clear selection"
            >
              Clear
            </button>
            <Link
              to="/compare"
              className="px-4 py-2 bg-[#0091da] hover:bg-[#007cb8] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
