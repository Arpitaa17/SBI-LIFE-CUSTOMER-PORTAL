// Formatting helpers for Indian Financial & Insurance Standards

export function formatINR(amount, options = {}) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Number(amount);
  
  if (options.compact) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
  }

  // Standard Indian comma separation
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function maskPolicyNumber(num) {
  if (!num) return 'SBI-****';
  const str = String(num);
  if (str.length <= 4) return str;
  return `${str.slice(0, 4)}****${str.slice(-4)}`;
}

export function maskAadhaar(num) {
  if (!num) return '**** **** ****';
  const clean = String(num).replace(/\s/g, '');
  return `**** **** ${clean.slice(-4)}`;
}

export function calculateRemainingYears(maturityDateString) {
  if (!maturityDateString) return 0;
  const target = new Date(maturityDateString);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  if (diffTime <= 0) return 0;
  return (diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
}

export function calculateElapsedYears(commencementDateString) {
  if (!commencementDateString) return 0;
  const start = new Date(commencementDateString);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  if (diffTime <= 0) return 0;
  return (diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
}
