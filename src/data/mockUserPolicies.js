// Mock Customer Portfolio of SBI Life Policies
// Synthetic data strictly compliant with realistic policy math and SBI Life schedules

export const INITIAL_USER_PROFILE = {
  id: 'usr_89213',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@example.com',
  mobile: '+91 98765 43210',
  panMasked: 'ABCDE****F',
  aadhaarMasked: '**** **** 8291',
  dob: '1988-06-15',
  age: 38,
  annualIncome: 1800000, // ₹18 Lakhs
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  kycStatus: 'Verified (IRDAI CKYC Registry)',
  bankAccountMasked: 'State Bank of India - **** 4590',
  ifscCode: 'SBIN0000300',
  role: 'customer'
};

export const INITIAL_USER_POLICIES = [
  {
    id: 'pol_101',
    policyNumber: '11209384812',
    maskedNumber: '1120****4812',
    policyName: 'SBI Life - eShield Next',
    uin: '111N123V02',
    category: 'term',
    categoryName: 'Term Insurance',
    planOption: 'Level Cover with Future-Proofing',
    status: 'Active',
    sumAssured: 15000000, // ₹1.5 Crores
    premiumAmount: 14850,
    frequency: 'Yearly',
    taxAmount: 2673, // 18% GST
    totalAnnualOutflow: 17523,
    commencementDate: '2021-04-10',
    maturityDate: '2056-04-10', // 35 years term
    totalTermYears: 35,
    pptYears: 35, // Regular pay
    premiumsPaidCount: 5,
    totalInstallments: 35,
    remainingInstallments: 30,
    totalPremiumsPaidToDate: 87615,
    lastPaymentDate: '2025-04-05',
    nextDueDate: '2027-04-10', // Local time is Oct 2026, next due is Apr 2027
    gracePeriodDays: 30,
    nomineeName: 'Priya Rajesh Sharma',
    nomineeRelation: 'Spouse',
    riders: [
      { name: 'Accidental Death Benefit Rider', cover: 5000000, active: true },
      { name: 'Criti Care 13 Non-Linked Rider', cover: 1500000, active: true }
    ],
    documents: [
      { name: 'Policy Bond (Signed Copy)', file: 'SBI_eShield_PolicyBond_11204812.pdf', size: '1.4 MB' },
      { name: 'Latest Premium Paid Certificate (FY 2025-26)', file: 'SBI_PPC_80C_2025_26.pdf', size: '320 KB' }
    ],
    milestones: [
      { year: 2021, event: 'Policy Inception & Risk Commencement', completed: true },
      { year: 2024, event: 'Future-proofing sum assured increase applied (+25%)', completed: true },
      { year: 2026, event: '5-Year Claim-Free Milestone Review', completed: true },
      { year: 2036, event: '15-Year Coverage Health Checkup Re-validation', completed: false },
      { year: 2056, event: 'Policy Expiry / Longevity Completion', completed: false }
    ]
  },
  {
    id: 'pol_102',
    policyNumber: '22839401923',
    maskedNumber: '2283****1923',
    policyName: 'SBI Life - Smart Platina Plus',
    uin: '111N132V03',
    category: 'savings',
    categoryName: 'Savings & Guaranteed Return',
    planOption: 'Guaranteed Income Option (25 Years)',
    status: 'Active',
    sumAssured: 1200000, // ₹12 Lakhs
    premiumAmount: 100000, // ₹1 Lakh p.a.
    frequency: 'Yearly',
    taxAmount: 4500, // 4.5% first year, 2.25% renewal
    totalAnnualOutflow: 102250,
    commencementDate: '2019-11-20',
    maturityDate: '2049-11-20', // 30 years
    totalTermYears: 30,
    pptYears: 10, // Limited pay 10 years
    premiumsPaidCount: 7,
    totalInstallments: 10,
    remainingInstallments: 3,
    totalPremiumsPaidToDate: 720000,
    lastPaymentDate: '2025-11-18',
    nextDueDate: '2026-11-20', // Coming up soon! In ~1 month!
    gracePeriodDays: 30,
    guaranteedAnnualIncome: 41500, // Starts after PPT
    maturityBenefitEstimated: 1100000, // 110% of premiums returned
    nomineeName: 'Aarav Sharma',
    nomineeRelation: 'Child',
    riders: [
      { name: 'Accidental Death Benefit Rider', cover: 1200000, active: true }
    ],
    documents: [
      { name: 'Policy Document with Benefit Illustration', file: 'SBI_SmartPlatina_Bond_22831923.pdf', size: '2.1 MB' },
      { name: 'Previous Renewal Receipt (Nov 2025)', file: 'SBI_Receipt_Nov2025.pdf', size: '410 KB' }
    ],
    milestones: [
      { year: 2019, event: 'Policy Issued & First Premium Credited', completed: true },
      { year: 2024, event: '5 Premiums Cleared - Surrender Value Guaranteed', completed: true },
      { year: 2029, event: 'Premium Payment Term (PPT) Concludes', completed: false },
      { year: 2030, event: 'Guaranteed Regular Income Payouts Commence (₹41,500/yr)', completed: false },
      { year: 2049, event: 'Maturity: Final Payout + 110% Total Premiums Refunded', completed: false }
    ]
  },
  {
    id: 'pol_103',
    policyNumber: '33918274092',
    maskedNumber: '3391****4092',
    policyName: 'SBI Life - Smart Scholar',
    uin: '111L073V04',
    category: 'child',
    categoryName: 'Child Insurance Plans',
    planOption: 'Twin Benefit Child Fund',
    status: 'Active',
    sumAssured: 600000,
    premiumAmount: 50000,
    frequency: 'Yearly',
    taxAmount: 0, // In ULIPs GST is in fund charges
    totalAnnualOutflow: 50000,
    commencementDate: '2022-08-15',
    maturityDate: '2037-08-15', // 15 years
    totalTermYears: 15,
    pptYears: 10,
    premiumsPaidCount: 4,
    totalInstallments: 10,
    remainingInstallments: 6,
    totalPremiumsPaidToDate: 200000,
    currentFundValue: 268400, // ULIP fund valuation
    lastPaymentDate: '2026-08-10',
    nextDueDate: '2027-08-15',
    gracePeriodDays: 30,
    childName: 'Aarav Sharma',
    childDob: '2016-04-12',
    nomineeName: 'Priya Rajesh Sharma',
    nomineeRelation: 'Spouse',
    riders: [
      { name: 'In-built Premium Payor Waiver Benefit', cover: 300000, active: true }
    ],
    documents: [
      { name: 'Unit Linked Policy Bond', file: 'SBI_SmartScholar_Bond.pdf', size: '1.8 MB' },
      { name: 'Fund Performance Statement (Sep 2026)', file: 'SBI_FundStatement_Sep2026.pdf', size: '520 KB' }
    ],
    milestones: [
      { year: 2022, event: 'Policy Inception for Child Education Fund', completed: true },
      { year: 2027, event: '5th Policy Year Loyalty Units Credited', completed: false },
      { year: 2032, event: 'Completion of Premium Payment Term', completed: false },
      { year: 2034, event: 'Child turns 18: Partial withdrawal eligibility for college entrance', completed: false },
      { year: 2037, event: 'Full Fund Value Maturity Payout for Master Degree', completed: false }
    ]
  },
  {
    id: 'pol_104',
    policyNumber: '44019283719',
    maskedNumber: '4401****3719',
    policyName: 'SBI Life - Shubh Nivesh',
    uin: '111N055V04',
    category: 'endowment',
    categoryName: 'Endowment Plans',
    planOption: 'Endowment with Deferred Maturity Option',
    status: 'Paid-up',
    sumAssured: 500000,
    premiumAmount: 32000,
    frequency: 'Yearly',
    taxAmount: 720,
    totalAnnualOutflow: 32720,
    commencementDate: '2015-02-14',
    maturityDate: '2030-02-14', // 15 years
    totalTermYears: 15,
    pptYears: 10,
    premiumsPaidCount: 5, // Paid for 5 years then converted to paid-up
    totalInstallments: 10,
    remainingInstallments: 0,
    totalPremiumsPaidToDate: 160000,
    lastPaymentDate: '2019-02-10',
    nextDueDate: null, // No further dues because policy is Paid-Up
    gracePeriodDays: 0,
    paidUpSumAssured: 250000, // Pro-rata sum assured
    nomineeName: 'Priya Rajesh Sharma',
    nomineeRelation: 'Spouse',
    riders: [],
    documents: [
      { name: 'Paid-up Status Endorsement Letter', file: 'SBI_PaidUp_Notice_44013719.pdf', size: '280 KB' }
    ],
    milestones: [
      { year: 2015, event: 'Policy Inception', completed: true },
      { year: 2019, event: 'Converted to Paid-Up Status as requested', completed: true },
      { year: 2030, event: 'Maturity Payout of Pro-rata Paid-Up Sum Assured + Accrued Bonus', completed: false }
    ]
  }
];

export const INITIAL_PAYMENT_TRANSACTIONS = [
  {
    id: 'txn_901',
    policyId: 'pol_102',
    policyNumber: '2283****1923',
    policyName: 'SBI Life - Smart Platina Plus',
    installmentNumber: 7,
    amount: 102250,
    dueDate: '2025-11-20',
    paymentDate: '2025-11-18',
    status: 'Paid',
    paymentMethod: 'SBI Net Banking',
    transactionRef: 'SBI-EPAY-8941092837',
    bankReference: 'IGABKJSL19',
    receiptNumber: 'RCPT-2025-11-89021',
    verified: true
  },
  {
    id: 'txn_902',
    policyId: 'pol_103',
    policyNumber: '3391****4092',
    policyName: 'SBI Life - Smart Scholar',
    installmentNumber: 4,
    amount: 50000,
    dueDate: '2026-08-15',
    paymentDate: '2026-08-10',
    status: 'Paid',
    paymentMethod: 'UPI (Google Pay / SBI UPI)',
    transactionRef: 'UPI-984019284710',
    bankReference: 'SBI9834190',
    receiptNumber: 'RCPT-2026-08-41029',
    verified: true
  },
  {
    id: 'txn_903',
    policyId: 'pol_101',
    policyNumber: '1120****4812',
    policyName: 'SBI Life - eShield Next',
    installmentNumber: 5,
    amount: 17523,
    dueDate: '2025-04-10',
    paymentDate: '2025-04-05',
    status: 'Paid',
    paymentMethod: 'SBI YONO / Debit Card',
    transactionRef: 'SBI-EPAY-1092847192',
    bankReference: 'SBI109284',
    receiptNumber: 'RCPT-2025-04-77192',
    verified: true
  },
  {
    id: 'txn_904',
    policyId: 'pol_102',
    policyNumber: '2283****1923',
    policyName: 'SBI Life - Smart Platina Plus',
    installmentNumber: 8,
    amount: 102250,
    dueDate: '2026-11-20', // Due in November 2026!
    paymentDate: null,
    status: 'Pending',
    paymentMethod: null,
    transactionRef: null,
    bankReference: null,
    receiptNumber: null,
    verified: false,
    daysUntilDue: 32
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Upcoming Premium Reminder: Smart Platina Plus',
    message: 'Your annual premium of ₹1,02,250 for Policy 2283****1923 is due on 20-Nov-2026. Pay early to ensure uninterrupted guaranteed income accruals.',
    category: 'payment',
    date: '2026-10-15',
    read: false,
    urgent: true,
    actionUrl: '/premium-payments'
  },
  {
    id: 'notif_2',
    title: 'Annual Bonus Declared: FY 2025-26',
    message: 'SBI Life announces simple reversionary bonus of 4.25% for participating endowment policies. Check your policy dashboard for revised accruals.',
    category: 'announcement',
    date: '2026-10-01',
    read: false,
    urgent: false,
    actionUrl: '/my-policies'
  },
  {
    id: 'notif_3',
    title: 'Premium Paid Certificate (80C) Ready for Download',
    message: 'Your official Income Tax Section 80C Premium Paid Certificate for FY 2025-26 is now available in your Documents section.',
    category: 'document',
    date: '2026-09-20',
    read: true,
    urgent: false,
    actionUrl: '/documents'
  },
  {
    id: 'notif_4',
    title: 'Payment Successful Confirmation',
    message: 'Premium payment of ₹50,000 for SBI Life - Smart Scholar (3391****4092) was successfully verified on 10-Aug-2026.',
    category: 'payment',
    date: '2026-08-10',
    read: true,
    urgent: false,
    actionUrl: '/premium-payments'
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app_8921',
    referenceNumber: 'SBIL-APP-2026-94812',
    policyId: 'sbi-life-eshield-next',
    policyName: 'SBI Life - eShield Next',
    planOption: 'Increasing Cover Option',
    applicantName: 'Rajesh Sharma',
    dob: '1988-06-15',
    annualIncome: 1800000,
    occupation: 'Salaried - IT Professional',
    coverageAmount: 20000000, // ₹2 Crores
    policyTerm: 35,
    ppt: 'Regular Pay',
    paymentFrequency: 'Yearly',
    calculatedBasePremium: 19800,
    gst: 3564,
    totalAnnualPremium: 23364,
    nomineeName: 'Priya Rajesh Sharma',
    nomineeRelationship: 'Spouse',
    nomineeAge: 35,
    medicalDisclosure: {
      tobaccoNicotine: false,
      chronicIllness: false,
      previousSurgeries: false,
      familyHeartHistory: false
    },
    kycType: 'DigiLocker CKYC',
    kycNumber: 'CKYC-90182749102',
    status: 'Underwriting Review',
    statusStep: 3, // 1: Submitted, 2: KYC Verified, 3: Underwriting Review, 4: Tele-Medical, 5: Policy Issued
    submittedAt: '2026-10-14 11:30 AM',
    lastUpdatedAt: '2026-10-16 04:15 PM',
    notes: 'Tele-medical verification scheduled for Oct 22, 2026.'
  }
];

export const INITIAL_SUPPORT_TICKETS = [
  {
    id: 'tkt_501',
    ticketNumber: 'TKT-SBIL-2026-1082',
    subject: 'Request to update Nominee mobile number and address',
    policyNumber: '1120****4812',
    category: 'Policy Servicing',
    status: 'Resolved',
    priority: 'Normal',
    createdAt: '2026-09-12 10:15 AM',
    resolvedAt: '2026-09-14 02:30 PM',
    lastReply: 'Your nominee contact details have been successfully updated in our master database.'
  },
  {
    id: 'tkt_502',
    ticketNumber: 'TKT-SBIL-2026-2194',
    subject: 'Inquiry regarding fund switch charges for Smart Scholar',
    policyNumber: '3391****4092',
    category: 'Fund Servicing',
    status: 'Open',
    priority: 'High',
    createdAt: '2026-10-17 09:20 AM',
    resolvedAt: null,
    lastReply: 'Our customer support executive is reviewing your fund switch ledger.'
  }
];
