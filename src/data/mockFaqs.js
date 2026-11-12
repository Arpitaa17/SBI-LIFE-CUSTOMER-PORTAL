// Official SBI Life Customer Support, FAQs, and IRDAI Grievance Redressal Data

export const FAQS = [
  {
    category: 'Policy Servicing',
    questions: [
      {
        q: 'How do I download my Section 80C Premium Paid Certificate for Income Tax returns?',
        a: 'You can download your Premium Paid Certificate (PPC) instantly from this portal under the "Documents & Receipts" section. The certificate is generated on official SBI Life letterhead and qualifies as valid proof of payment under Section 80C of the Income Tax Act.'
      },
      {
        q: 'What is the grace period for paying my renewal premium?',
        a: 'For policies with Yearly, Half-Yearly, and Quarterly payment frequencies, SBI Life provides a grace period of 30 calendar days from the premium due date. For monthly payment frequencies, a grace period of 15 days is provided. During this grace period, your life cover remains fully in force.'
      },
      {
        q: 'What happens if my policy lapses due to non-payment of premium?',
        a: 'If premium is not paid within the grace period, your policy lapses and the risk cover ceases. However, you can revive a lapsed policy within a revival period of 5 consecutive years from the date of the first unpaid premium by submitting a revival form, satisfactory proof of good health, and paying all overdue premiums with interest.'
      },
      {
        q: 'Can I change my Nominee after the policy has been issued?',
        a: 'Yes. The policyholder can modify or add nominees anytime during the policy term under Section 39 of the Insurance Act, 1938. You can initiate a Nominee Modification request directly through our Customer Support / Servicing section.'
      }
    ]
  },
  {
    category: 'Claims & Payouts',
    questions: [
      {
        q: 'What is the death claim settlement ratio of SBI Life?',
        a: 'SBI Life maintains one of the highest Claim Settlement Ratios in the Indian life insurance industry at 99.2% (as per IRDAI Annual Report). Most eligible death claims without investigation are settled within 24 to 48 hours of complete documentation.'
      },
      {
        q: 'What documents are required to register a Death Claim?',
        a: 'Mandatory documents include: (1) Original Policy Document, (2) Death Certificate issued by local municipal authority, (3) Claim Form (Form A), (4) Claimant / Nominee KYC and cancelled cheque for NEFT, and (5) Medical records / hospital discharge summary if death occurred in hospital.'
      },
      {
        q: 'How are maturity benefits credited?',
        a: 'Maturity proceeds and survival payouts are directly transferred via electronic bank transfer (NEFT/RTGS) to the policyholder registered bank account on the exact date of maturity.'
      }
    ]
  },
  {
    category: 'Online Payments & Gateway',
    questions: [
      {
        q: 'Which payment methods are accepted for online renewal?',
        a: 'SBI Life accepts SBI Net Banking, State Bank YONO, all major Indian bank netbanking portals, UPI (BHIM, Google Pay, PhonePe, Paytm), Visa/Mastercard/RuPay Credit and Debit Cards, and NACH/e-Mandate auto-debit.'
      },
      {
        q: 'My payment was deducted from my bank but policy status is not updated. What should I do?',
        a: 'In rare cases of bank network latency, the payment confirmation may take up to 2 hours. If your account was debited, the transaction will either be automatically reconciled within 24 hours or refunded to your originating account within 3-5 working days.'
      }
    ]
  }
];

export const GRIEVANCE_REPRESENTATIVES = {
  tollFreeCustomerCare: '1800 267 9090 (Available 9:00 AM to 9:00 PM, Mon-Sat)',
  alternateHelpline: '022 6645 6000',
  smsService: 'SMS "MYPOLICY" to 56161',
  customerServiceEmail: 'info@sbilife.co.in',
  headOfficeAddress: 'SBI Life Insurance Co. Ltd, Natraj, M.V. Road & Western Express Highway Junction, Andheri (East), Mumbai - 400 069',
  irdaiRegistrationNumber: 'IRDAI Reg. No. 111 (Issued on 29th March 2001)',
  cin: 'L99999MH2000PLC129113',
  escalationLevels: [
    {
      level: 'Level 1: Branch Grievance Redressal Officer',
      turnaround: 'Within 3 working days',
      email: 'gro@sbilife.co.in'
    },
    {
      level: 'Level 2: Head of Customer Service & Grievance',
      turnaround: 'Within 7 working days',
      email: 'headgrievance@sbilife.co.in'
    },
    {
      level: 'Level 3: IRDAI Bima Bharosa Portal',
      turnaround: 'Toll-free 155255 / complaints@irdai.gov.in',
      url: 'https://bimabharosa.irdai.gov.in'
    },
    {
      level: 'Level 4: Insurance Ombudsman',
      turnaround: 'Statutory quasi-judicial resolution',
      url: 'https://www.cioins.co.in/Ombudsman'
    }
  ]
};

export const BRANCH_LOCATIONS = [
  { city: 'Mumbai', state: 'Maharashtra', address: 'Fort Branch, Nariman Point, Ground Floor, SBI Heritage Bldg, Mumbai - 400021', phone: '022 2288 4100' },
  { city: 'New Delhi', state: 'Delhi NCR', address: 'Connaught Place Branch, 11 Parliament Street, SBI Main Bldg, New Delhi - 110001', phone: '011 2337 4000' },
  { city: 'Bengaluru', state: 'Karnataka', address: 'MG Road Branch, State Bank Compound, St. Marks Road, Bengaluru - 560001', phone: '080 2594 3000' },
  { city: 'Hyderabad', state: 'Telangana', address: 'Koti Branch, Bank Street, Gunfoundry, Hyderabad - 500095', phone: '040 2346 6000' },
  { city: 'Kolkata', state: 'West Bengal', address: 'Samriddhi Bhavan, 1 Strand Road, Kolkata - 700001', phone: '033 2248 1200' },
  { city: 'Chennai', state: 'Tamil Nadu', address: 'Rajaji Salai Branch, George Town, Chennai - 600001', phone: '044 2522 9000' },
  { city: 'Ahmedabad', state: 'Gujarat', address: 'Ashram Road Branch, Near Income Tax Circle, Ahmedabad - 380009', phone: '079 2658 8000' },
  { city: 'Pune', state: 'Maharashtra', address: 'Shivajinagar Branch, University Road, Pune - 411005', phone: '020 2553 4000' }
];
