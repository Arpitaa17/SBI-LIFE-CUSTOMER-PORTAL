import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Briefcase, 
  Heart, 
  FileCheck, 
  Lock, 
  Sparkles,
  Info,
  Calendar,
  CreditCard
} from 'lucide-react';
import { VERIFIED_POLICIES } from '../data/verifiedPolicies';
import { usePolicy } from '../context/PolicyContext';
import { useAuth } from '../context/AuthContext';
import { calculateIndicativePremium } from '../utils/calculators';
import { formatINR } from '../utils/formatters';

export default function ApplyPolicyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { submitApplication } = usePolicy();
  const { user } = useAuth();

  // Initial params
  const paramPolicyId = searchParams.get('policy') || 'sbi-life-eshield-next';
  const paramAge = searchParams.get('age') || '32';
  const paramSumAssured = searchParams.get('sumAssured') || '10000000';

  // Multi-step state: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Policy Selection & Coverage
    policyId: paramPolicyId,
    coverageAmount: Number(paramSumAssured),
    policyTerm: 30,
    ppt: 'Regular Pay',
    frequency: 'Yearly',

    // Step 2: Personal & Contact
    fullName: user?.name || 'Rajesh Sharma',
    dob: '1988-06-15',
    gender: 'male',
    maritalStatus: 'married',
    email: user?.email || 'rajesh.sharma@example.com',
    mobile: user?.mobile || '+91 98765 43210',
    address: '402, Sea Green Heights, Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',

    // Step 3: Income & Occupation
    occupationType: 'Salaried - Private Sector',
    annualIncome: 1800000,
    employerName: 'Tata Consultancy Services',
    education: 'Post Graduate / Professional Degree',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '8920 4819 2810',

    // Step 4: Medical & Lifestyle Disclosures
    isTobacco: false,
    isAlcohol: false,
    hasPreExistingIllness: false,
    hasSurgeryHistory: false,
    hasCovidComplications: false,
    familyHeartHistory: false,

    // Step 5: Nominee Details & Declaration
    nomineeName: 'Priya Rajesh Sharma',
    nomineeRelationship: 'Spouse',
    nomineeAge: 35,
    nomineeShare: 100,
    acceptedTerms: true
  });

  const selectedPolicy = VERIFIED_POLICIES.find(p => p.id === formData.policyId) || VERIFIED_POLICIES[0];

  // Live calculation of indicative quote
  const quote = calculateIndicativePremium({
    policy: selectedPolicy,
    age: 38,
    gender: formData.gender,
    sumAssured: formData.coverageAmount,
    policyTerm: formData.policyTerm,
    ppt: formData.ppt,
    isTobacco: formData.isTobacco
  });

  const handleNext = () => {
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const appResult = submitApplication({
      policyId: selectedPolicy.id,
      policyName: selectedPolicy.name,
      planOption: 'Level Cover with Future-Proofing',
      applicantName: formData.fullName,
      dob: formData.dob,
      annualIncome: formData.annualIncome,
      occupation: formData.occupationType,
      coverageAmount: formData.coverageAmount,
      policyTerm: formData.policyTerm,
      ppt: formData.ppt,
      paymentFrequency: formData.frequency,
      calculatedBasePremium: quote.base,
      gst: quote.gst,
      totalAnnualPremium: quote.total,
      nomineeName: formData.nomineeName,
      nomineeRelationship: formData.nomineeRelationship,
      nomineeAge: formData.nomineeAge,
      medicalDisclosure: {
        tobaccoNicotine: formData.isTobacco,
        chronicIllness: formData.hasPreExistingIllness,
        previousSurgeries: formData.hasSurgeryHistory,
        familyHeartHistory: formData.familyHeartHistory
      },
      kycType: 'DigiLocker CKYC',
      kycNumber: `CKYC-${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      notes: 'Digital application received. Tele-medical scheduling in progress.'
    });

    setSubmittedApp(appResult);
    setCurrentStep(6); // Success Step
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-1">
          Authorized Digital Workflow
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Apply Online for SBI Life Insurance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Fast, paperless onboarding with instantaneous eligibility check, DigiLocker CKYC, and live premium quotation.
        </p>
      </div>

      {/* Wizard Step Indicator */}
      {currentStep <= 5 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            {[
              { step: 1, label: 'Plan & Cover' },
              { step: 2, label: 'Personal Info' },
              { step: 3, label: 'Income & KYC' },
              { step: 4, label: 'Medical History' },
              { step: 5, label: 'Nominee & Review' }
            ].map(s => (
              <div key={s.step} className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep === s.step
                    ? 'bg-[#0091da] text-white ring-4 ring-sky-100'
                    : currentStep > s.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {currentStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                </div>
                <span className={`hidden sm:inline ${currentStep === s.step ? 'text-[#0b2a59] font-bold' : ''}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
        
        {/* STEP 1: PLAN & COVERAGE */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Step 1: Choose Policy & Coverage Amount</h3>
              <p className="text-xs text-slate-500">Select your intended SBI Life policy and tailor policy duration and term.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select SBI Life Insurance Product</label>
                <select
                  value={formData.policyId}
                  onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                >
                  {VERIFIED_POLICIES.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.categoryName}) — UIN: {p.uin}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Desired Life Coverage (Sum Assured)</label>
                  <select
                    value={formData.coverageAmount}
                    onChange={(e) => setFormData({ ...formData, coverageAmount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value={2500000}>₹25 Lakhs</option>
                    <option value={5000000}>₹50 Lakhs</option>
                    <option value={10000000}>₹1 Crore</option>
                    <option value={15000000}>₹1.5 Crores</option>
                    <option value={20000000}>₹2 Crores</option>
                    <option value={50000000}>₹5 Crores</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Policy Term (Years)</label>
                  <select
                    value={formData.policyTerm}
                    onChange={(e) => setFormData({ ...formData, policyTerm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                    <option value={35}>35 Years</option>
                    <option value={40}>40 Years (Max)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Premium Payment Term (PPT)</label>
                  <select
                    value={formData.ppt}
                    onChange={(e) => setFormData({ ...formData, ppt: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Regular Pay">Regular Pay (Equal to Policy Term)</option>
                    <option value="10 Years">Limited Pay (10 Years)</option>
                    <option value="7 Years">Limited Pay (7 Years)</option>
                    <option value="5 Years">Limited Pay (5 Years)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Yearly">Yearly (Maximum Savings)</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly (Auto-Debit NACH)</option>
                  </select>
                </div>
              </div>

              {/* Live Quotation Preview */}
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-sky-800">Indicative Annual Premium</span>
                  <div className="text-2xl font-black text-[#0b2a59] font-sans">
                    {formatINR(quote.total)} <span className="text-xs font-normal text-slate-500">/ yr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Base: {formatINR(quote.base)} + GST: {formatINR(quote.gst)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    Section 80C Eligible
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0b2a59] text-white rounded-xl text-xs font-bold hover:bg-[#0091da] transition flex items-center gap-1.5 shadow"
              >
                <span>Continue to Personal Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PERSONAL & CONTACT DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Step 2: Basic Personal & Contact Information</h3>
              <p className="text-xs text-slate-500">Provide official details as per your Government ID records.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name (as per PAN)</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State & PIN Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0b2a59] text-white rounded-xl text-xs font-bold hover:bg-[#0091da] transition flex items-center gap-1.5 shadow"
              >
                <span>Continue to Income & KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INCOME & KYC */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Step 3: Income, Occupation & Identity Proof</h3>
              <p className="text-xs text-slate-500">Underwriting requires financial capacity verification for high sum assured.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Occupation Type</label>
                <select
                  value={formData.occupationType}
                  onChange={(e) => setFormData({ ...formData, occupationType: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Salaried - Private Sector">Salaried - Private Sector / Corporate</option>
                  <option value="Salaried - Government / PSU">Salaried - Government / PSU</option>
                  <option value="Self Employed - Professional">Self Employed - Doctor / CA / Lawyer / Tech</option>
                  <option value="Business Owner / Trader">Business Owner / Merchant</option>
                  <option value="Agriculture / Farming">Agriculture</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Gross Income (INR)</label>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                  placeholder="ABCDE1234F"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar (DigiLocker CKYC)</label>
                <input
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  placeholder="**** **** 8210"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>DigiLocker CKYC integration verified. No physical document upload is mandatory for this tier.</span>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0b2a59] text-white rounded-xl text-xs font-bold hover:bg-[#0091da] transition flex items-center gap-1.5 shadow"
              >
                <span>Continue to Medical Disclosures</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MEDICAL & LIFESTYLE DISCLOSURES */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Step 4: Mandatory Medical & Lifestyle Declarations</h3>
              <p className="text-xs text-slate-500">
                Utmost Good Faith (Uberrimae Fidei): Complete and accurate disclosure guarantees claim admissibility.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { key: 'isTobacco', q: 'Do you currently consume or have ever consumed tobacco products (cigarettes, beedis, gutkha, nicotine)?' },
                { key: 'isAlcohol', q: 'Do you consume alcohol on a weekly or daily basis?' },
                { key: 'hasPreExistingIllness', q: 'Have you ever been treated for Hypertension, Diabetes, Cancer, Kidney, Heart or Stroke conditions?' },
                { key: 'hasSurgeryHistory', q: 'Have you undergone any major surgery or been hospitalized for over 7 consecutive days in the past 5 years?' },
                { key: 'familyHeartHistory', q: 'Has any immediate family member (parents/siblings) died of cardiovascular disease before age 55?' }
              ].map(item => (
                <div key={item.key} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-800 leading-snug">{item.q}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, [item.key]: false })}
                      className={`px-3 py-1 rounded-lg font-bold border transition ${
                        !formData[item.key]
                          ? 'bg-[#0b2a59] text-white border-[#0b2a59]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, [item.key]: true })}
                      className={`px-3 py-1 rounded-lg font-bold border transition ${
                        formData[item.key]
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0b2a59] text-white rounded-xl text-xs font-bold hover:bg-[#0091da] transition flex items-center gap-1.5 shadow"
              >
                <span>Continue to Nominee & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: NOMINEE & FINAL REVIEW */}
        {currentStep === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Step 5: Nominee Details & Application Review</h3>
              <p className="text-xs text-slate-500">Designate your nominee for claim settlement under Section 39 of Insurance Act.</p>
            </div>

            {/* Nominee inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominee Full Name</label>
                <input
                  type="text"
                  value={formData.nomineeName}
                  onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Relationship with Applicant</label>
                <select
                  value={formData.nomineeRelationship}
                  onChange={(e) => setFormData({ ...formData, nomineeRelationship: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominee Age & Share (%)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={formData.nomineeAge}
                    onChange={(e) => setFormData({ ...formData, nomineeAge: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Age"
                  />
                  <input
                    type="number"
                    value={formData.nomineeShare}
                    disabled
                    className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-center"
                    placeholder="100%"
                  />
                </div>
              </div>
            </div>

            {/* Application Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">Summary of Coverage</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Product</span>
                  <strong className="text-slate-900">{selectedPolicy.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sum Assured</span>
                  <strong className="text-slate-900">{formatINR(formData.coverageAmount)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Policy Term</span>
                  <strong className="text-slate-900">{formData.policyTerm} Years</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Indicative Premium</span>
                  <strong className="text-[#0b2a59] font-mono text-sm">{formatINR(quote.total)}/yr</strong>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptedTerms}
                  onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                  className="rounded text-sky-600 mt-0.5"
                  required
                />
                <span className="leading-relaxed">
                  I hereby declare that the statements made above are true and complete in every respect. I authorize SBI Life Insurance Company Limited to verify my identity via CKYC/DigiLocker and conduct underwriting and tele-medical assessments as required.
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-[#0091da] hover:bg-[#007cb8] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4" />
                <span>Submit Application to SBI Life System</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: APPLICATION SUBMITTED CONFIRMATION */}
        {currentStep === 6 && submittedApp && (
          <div className="py-6 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Application Successfully Logged
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Application Reference: {submittedApp.referenceNumber}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your application for <strong>{submittedApp.policyName}</strong> has been received by SBI Life's Central Underwriting Office.
              </p>
            </div>

            {/* Status Steps Tracker */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-lg mx-auto text-left space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Application Status:</span>
                <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold">
                  {submittedApp.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Digital Proposal Form Submitted ({submittedApp.submittedAt})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. DigiLocker CKYC & Identity Authenticated</span>
                </div>
                <div className="flex items-center gap-2 text-sky-800 font-bold animate-pulse">
                  <div className="w-4 h-4 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"></div>
                  <span>3. Underwriting & Tele-Medical Evaluation (In Progress)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                  <span>4. First Premium Debit & Policy Bond Issuance</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-2.5 bg-[#0b2a59] hover:bg-[#082046] text-white rounded-xl text-xs font-bold transition shadow"
              >
                Go to My Dashboard
              </Link>
              <Link
                to="/explore"
                className="px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
              >
                Explore Other Products
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
