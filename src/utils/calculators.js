// Insurance calculation formulas and recommendation algorithms

/**
 * Calculates indicative premium based on verified policy guidelines
 */
export function calculateIndicativePremium({
  policy,
  age = 30,
  gender = 'male',
  sumAssured = 10000000, // ₹1 Cr default
  policyTerm = 30,
  ppt = 'Regular',
  isTobacco = false,
  riders = []
}) {
  if (!policy) return { base: 0, ridersCost: 0, gst: 0, total: 0 };

  // Fixed scheme check
  if (policy.fixedAnnualPremium) {
    return {
      base: policy.fixedAnnualPremium,
      ridersCost: 0,
      gst: 0,
      total: policy.fixedAnnualPremium
    };
  }

  // Base rate calculation per ₹1 Lakh sum assured
  let ratePerLakh = policy.indicativeAnnualPremiumPerLakhCoverage || 100;

  // Age factor: increases with age (approx 3.5% per year above 25, 2.5% below)
  const ageFactor = 1 + Math.max(0, age - 25) * 0.038;

  // Gender discount (women typically receive ~10% discount on term life in India)
  const genderFactor = gender === 'female' ? 0.90 : 1.0;

  // Tobacco / Smoking loading (approx 45% surcharge on term insurance)
  const tobaccoFactor = (isTobacco && policy.category === 'term') ? 1.45 : 1.0;

  // PPT factor (Limited pay costs more per annum because fewer years are paid)
  let pptFactor = 1.0;
  if (typeof ppt === 'string') {
    if (ppt.includes('5 Pay') || ppt.includes('5 Years')) pptFactor = 2.1;
    else if (ppt.includes('7 Years')) pptFactor = 1.6;
    else if (ppt.includes('10 Pay') || ppt.includes('10 Years')) pptFactor = 1.35;
    else if (ppt.includes('Single')) pptFactor = 7.5;
  }

  const coverageInLakhs = sumAssured / 100000;
  let basePremium = Math.round(coverageInLakhs * ratePerLakh * ageFactor * genderFactor * tobaccoFactor * pptFactor);

  // Minimum floor
  if (policy.category === 'term' && basePremium < 3500) basePremium = 3500;
  if (policy.category === 'savings' && basePremium < 25000) basePremium = 25000;
  if (policy.category === 'ulip' && basePremium < 24000) basePremium = 24000;

  // Add rider costs
  let ridersCost = 0;
  if (riders && riders.length > 0) {
    riders.forEach(r => {
      const riderPct = r.extraCostPercent || 6;
      ridersCost += Math.round(basePremium * (riderPct / 100));
    });
  }

  // Applicable GST: 18% for pure term/riders; 4.5% first year for savings/endowment
  const gstRate = policy.category === 'term' ? 0.18 : 0.045;
  const gst = Math.round((basePremium + ridersCost) * gstRate);
  const total = basePremium + ridersCost + gst;

  return {
    base: basePremium,
    ridersCost,
    gst,
    total,
    frequencyBreakdown: {
      yearly: total,
      halfYearly: Math.round(total * 0.51),
      quarterly: Math.round(total * 0.26),
      monthly: Math.round(total * 0.088)
    }
  };
}

/**
 * Intelligent Personalized Recommendation Engine
 * Evaluates user profile and scores each SBI Life product
 */
export function generatePolicyRecommendations(input, allPolicies) {
  const {
    age = 32,
    annualIncome = 1200000,
    monthlyExpenses = 45000,
    savings = 500000,
    dependents = 2,
    goal = 'family-protection', // 'family-protection' | 'savings' | 'wealth' | 'retirement' | 'child-education' | 'tax'
    budget = 50000,
    riskTolerance = 'moderate', // 'low' | 'moderate' | 'high'
    existingCoverage = 0
  } = input;

  // 1. Calculate ideal life insurance coverage (Human Life Value rule: 10x - 15x annual income)
  const idealLifeCover = Math.max(5000000, annualIncome * (age < 35 ? 15 : 12));
  const coverageGap = Math.max(0, idealLifeCover - existingCoverage);

  // 2. Score policies based on match
  const scoredPolicies = allPolicies.map(policy => {
    let score = 50; // Base score
    const rationale = [];

    // Age eligibility check
    if (age < policy.minEntryAge || age > policy.maxEntryAge) {
      return { policy, score: -1, eligible: false, reasons: [`Age ${age} is outside eligibility range (${policy.minEntryAge}-${policy.maxEntryAge} yrs)`] };
    }

    // Match primary goal
    if (goal === 'family-protection') {
      if (policy.category === 'term') {
        score += 35;
        rationale.push('Directly addresses your primary need for pure financial protection and high life cover for dependents.');
      } else if (policy.category === 'whole-life') {
        score += 20;
        rationale.push('Provides lifelong protection up to age 100 for your family.');
      } else {
        score -= 10;
      }
    } else if (goal === 'savings') {
      if (policy.category === 'savings' || policy.category === 'endowment') {
        score += 35;
        rationale.push('Provides guaranteed payouts and capital safety without market volatility.');
      } else if (policy.category === 'ulip') {
        score += 15;
      }
    } else if (goal === 'wealth') {
      if (policy.category === 'ulip') {
        score += 35;
        rationale.push('Offers equity and balanced market exposure to build long-term wealth surpassing inflation.');
      } else if (policy.category === 'savings') {
        score += 15;
      }
    } else if (goal === 'retirement') {
      if (policy.category === 'retirement') {
        score += 40;
        rationale.push('Engineered specifically for guaranteed pension payouts and post-retirement financial security.');
      } else if (policy.category === 'savings') {
        score += 20;
      }
    } else if (goal === 'child-education') {
      if (policy.category === 'child') {
        score += 40;
        rationale.push('Includes built-in Premium Waiver and targeted milestone payouts timed for college admissions.');
      }
    } else if (goal === 'tax') {
      score += 20;
      rationale.push('Eligible for maximum tax deductions under Section 80C and exempt maturity under Section 10(10D).');
    }

    // Risk tolerance match
    if (riskTolerance === 'low') {
      if (policy.category === 'savings' || policy.category === 'endowment' || policy.id === 'sbi-life-saral-pension') {
        score += 15;
        rationale.push('Zero stock market risk — all maturity and income payouts are guaranteed.');
      } else if (policy.category === 'ulip') {
        score -= 20;
      }
    } else if (riskTolerance === 'high') {
      if (policy.category === 'ulip') {
        score += 20;
        rationale.push('Maximizes capital growth via top-performing SBI Life equity funds with switch flexibility.');
      }
    } else { // Moderate
      if (policy.category === 'savings' || policy.category === 'term' || policy.category === 'ulip') {
        score += 10;
      }
    }

    // Dependents impact
    if (dependents > 0 && policy.category === 'term') {
      score += 15;
      rationale.push(`Essential safety net for your ${dependents} financial dependent${dependents > 1 ? 's' : ''}.`);
    }

    // Budget alignment
    const quote = calculateIndicativePremium({
      policy,
      age,
      sumAssured: policy.category === 'term' ? idealLifeCover : Math.min(1000000, annualIncome * 2),
      policyTerm: Math.min(policy.maxPolicyTerm, 60 - age > 10 ? 60 - age : 20)
    });

    const isAffordable = quote.total <= budget * 1.25;
    if (isAffordable) {
      score += 10;
      rationale.push(`Fits comfortably within your indicated annual budget of ₹${budget.toLocaleString('en-IN')}.`);
    } else {
      score -= 10;
    }

    return {
      policy,
      score,
      eligible: true,
      rationale,
      suggestedCoverage: policy.category === 'term' ? idealLifeCover : 1500000,
      suggestedTerm: Math.min(policy.maxPolicyTerm, Math.max(15, 65 - age)),
      indicativeQuote: quote
    };
  });

  // Filter eligible and sort descending by score
  const ranked = scoredPolicies
    .filter(item => item.eligible)
    .sort((a, b) => b.score - a.score);

  return {
    idealLifeCover,
    coverageGap,
    recommendations: ranked.slice(0, 4),
    alternatives: ranked.slice(4, 7)
  };
}
