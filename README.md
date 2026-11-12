# 🏛️ SBI Life Insurance — All-in-One Policy Management & Recommendation Portal

A modern, production-grade, full-stack financial technology web platform built for **SBI Life Insurance Company Limited** (IRDAI Regn. No. 111 | CIN: L99999MH2000PLC129113).

This platform caters to both prospective insurance buyers and existing SBI Life policyholders with end-to-end policy exploration, multi-policy comparative analysis, 5-stage digital onboarding/KYC, premium payment tracking with electronic receipts, personalized financial recommendation engine (HLV calculator), and a secure administrative underwriting portal.

---

## 🚀 Live Demo & Deployment
- **Live Netlify Frontend:** [https://jade-centaur-09f2ff.netlify.app](https://jade-centaur-09f2ff.netlify.app)
- **Local Dev Server:** `http://localhost:3000` (Vite Hot-Reload)
- **Local API & SQLite Server:** `http://localhost:5000` (Express.js REST APIs)

---

## 🛠️ Complete Tech Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | **React 19**, **Vite 8**, **React Router DOM v7** |
| **Styling & Design** | **Tailwind CSS v4**, Custom Design System (Official SBI Indigo `#0B2A59` & Sky Blue `#0091DA`), Lucide React Icons |
| **State & Store** | Context API (`PolicyContext`, `AuthContext`, `NotificationContext`) + Persistent Storage & Fallback Cache |
| **Backend Engine** | **Node.js**, **Express.js v5** (RESTful API architecture) |
| **Database** | **SQLite3** (`data/sbi_life.sqlite`) with 8 normalized relational tables & seeded authentic data |
| **Compliance & Math** | Pure JS Fiduciary Financial Calculators (Human Life Value, IRR, Premium quotation algorithms adhering to IRDAI guidelines) |

---

## 📁 Project Directory Structure

```plaintext
sbi-life-portal/
├── index.html                   # HTML5 Entry Point with Google Fonts & Meta tags
├── package.json                 # Project dependencies, scripts & metadata
├── package-lock.json            # Deterministic package dependency tree
├── vite.config.js               # Vite bundler configuration & backend API proxy
├── netlify.toml                 # Netlify deployment rules & SPA routing
├── .gitignore                   # Standard production git exclusions
├── README.md                    # Comprehensive technical documentation
│
├── public/                      # Static assets & routing fallbacks
│   └── _redirects               # Netlify 200 rewrite for Single Page App
│
├── src/                         # React Frontend Source Code
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Main router setup (15 dedicated routes)
│   ├── index.css                # Global CSS & Tailwind styling setup
│   │
│   ├── components/              # Modular UI Components
│   │   ├── Navbar.jsx           # Global navigation with search, badges & role switch
│   │   ├── Footer.jsx           # Corporate footer with statutory IRDAI notices
│   │   ├── PolicyCard.jsx       # Card component for insurance catalogue
│   │   ├── PremiumCalculatorWidget.jsx # Interactive real-time premium calculator
│   │   ├── PaymentModal.jsx     # SBI ePay gateway checkout workflow
│   │   ├── ReceiptModal.jsx     # Printable 80C premium receipt generator
│   │   └── NotificationDrawer.jsx # Slide-out alerts & servicing notification tray
│   │
│   ├── pages/                   # 15 Full-Featured Page Views
│   │   ├── HomePage.jsx                 # Hero section, CSR stats & quick links
│   │   ├── ExplorePoliciesPage.jsx      # Filterable catalogue across 6 categories
│   │   ├── PolicyDetailsPage.jsx        # Detailed policy benefits, riders & UINs
│   │   ├── ComparePoliciesPage.jsx      # Side-by-side comparison matrix (up to 4)
│   │   ├── ApplyPolicyPage.jsx          # 5-step proposal & KYC onboarding wizard
│   │   ├── RecommendationEnginePage.jsx # HLV questionnaire & personalized plans
│   │   ├── CustomerDashboardPage.jsx    # User dashboard, metrics & status counters
│   │   ├── MyPoliciesPage.jsx           # Policy portfolio, tenure & installment bars
│   │   ├── PremiumPaymentsPage.jsx      # Installment schedule, calendar & pay now
│   │   ├── MaturityTrackerPage.jsx      # Visual milestone journey to policy maturity
│   │   ├── NotificationsPage.jsx        # Servicing notifications & alert settings
│   │   ├── DocumentsPage.jsx            # Instant policy bonds & 80C tax certificates
│   │   ├── CustomerSupportPage.jsx      # FAQs, grievance redressal & ticket logger
│   │   ├── AuthPage.jsx                 # Secure login, signup & role switcher
│   │   └── AdminPanelPage.jsx           # Underwriting desk, payment reconciliation
│   │
│   ├── context/                 # Context Providers
│   │   ├── AuthContext.jsx              # Session state, user profiles & role guards
│   │   ├── PolicyContext.jsx            # Central store syncing API & localStorage
│   │   └── NotificationContext.jsx      # Real-time notification badge manager
│   │
│   ├── data/                    # Authentic Seed Data
│   │   ├── verifiedPolicies.js          # Official SBI Life catalogue with UINs
│   │   ├── mockUserPolicies.js          # Active customer portfolio seed dataset
│   │   └── mockFaqs.js                  # Categorized FAQs & servicing answers
│   │
│   └── utils/                   # Business Logic & Algorithms
│       ├── calculators.js               # HLV, premium calculation & recommendation algorithms
│       └── formatters.js                # Currency (INR), date & masked string formatters
│
├── server/                      # Express.js REST API Backend
│   ├── index.js                 # API server routes & controllers
│   └── db/
│       └── database.js          # SQLite3 schema creation & database seeding
│
└── data/                        # Persistent SQLite Database Storage
    └── sbi_life.sqlite          # SQLite file containing 8 tables
```

---

## 🌟 Key Functional Modules (15 Pages)

1. **Home (`/`)**: Corporate hero with claim settlement statistics (98.05%), product highlights, quick action portals, and compliance announcements.
2. **Explore Policies (`/explore`)**: Categorized by Term, Savings, ULIP, Retirement, Child, and Whole Life. Dynamic multi-criteria filters for age, budget, term, and sum assured.
3. **Policy Details (`/policy/:id`)**: Comprehensive policy brochure view with IRDAI UINs, death/maturity benefit illustrations, eligible riders, and instant quotes.
4. **Compare Policies (`/compare`)**: Side-by-side comparative matrix of 2 to 4 products highlighting lock-in periods, tax deductions, guaranteed vs variable returns.
5. **Online Application Wizard (`/apply`)**: Full 5-stage proposal journey with personal disclosures, nominee details, CKYC simulation, and instant application reference generation.
6. **Smart Recommendation Engine (`/recommendations`)**: Calculates Human Life Value (HLV) based on age, income, dependents, liabilities, and risk tolerance to prescribe ranked policies.
7. **Customer Dashboard (`/dashboard`)**: Metric cards summarizing active sum assured, paid installments, pending renewals, and upcoming payment calendar.
8. **My Policies Portfolio (`/my-policies`)**: Detailed policy cards with progress bars tracking policy tenure and paid vs remaining installments. Allows linking existing physical policies.
9. **Premium Installment Tracker (`/premium-payments`)**: Payment ledger with verified status changes (`Paid`, `Pending`, `Overdue`), instant payment gateway checkout, and e-receipts.
10. **Policy Maturity Timeline (`/timeline`)**: Visual chronological roadmap from commencement to premium term completion, bonus vesting, and final maturity settlement.
11. **Servicing Notifications (`/notifications`)**: Alert logs for upcoming dues, application status updates, and downloadable communications with SMS/Email preferences.
12. **Tax & Policy Documents (`/documents`)**: Single-click generation and download of signed Policy Bond Certificates and Section 80C Tax Deduction certificates.
13. **Customer Support & Grievance Desk (`/support`)**: IRDAI grievance redressal matrix, branch locator, searchable FAQ repository, and support ticket submission form.
14. **Authentication & Multi-Factor Auth (`/auth`)**: Role-based access control allowing instant switching between Customer and Underwriting Administrator profiles.
15. **Administrative Underwriting Panel (`/admin`)**: Operational console for underwriting teams to approve/reject proposals, monitor payment transactions, and inspect audit logs.

---

## ⚖️ Statutory Disclosures & Compliance
- **IRDAI Reg. No. 111:** Every product explicitly displays its registered IRDAI Unique Identification Number (UIN).
- **Insurance Act, 1938 (Section 41):** Prominent statutory notices prohibiting rebates.
- **Insurance Act, 1938 (Section 45):** Transparent customer guidelines on policy indisputability.
- **Income Tax Act, 1961:** Accurate guidance on Section 80C deductions and Section 10(10D) tax exemptions.

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Installation
```bash
# Clone the repository or extract the project zip
cd sbi-life-portal

# Install frontend and backend dependencies
npm install
```

### 2. Running in Development Mode
```bash
# Terminal 1: Start the React + Vite frontend (Port 3000)
npm run dev

# Terminal 2: Start the Express.js + SQLite backend (Port 5000)
npm run server
```

The frontend will be accessible at `http://localhost:3000` with instant hot-module replacement and API proxying to `http://localhost:5000`.

### 3. Production Build
```bash
# Create an optimized production bundle in dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## 📄 License & Attribution
Designed & developed as a high-fidelity demonstration of an enterprise-grade Insurance & FinTech portal. All trademarks, logos, and product names belong to **SBI Life Insurance Company Limited**.
