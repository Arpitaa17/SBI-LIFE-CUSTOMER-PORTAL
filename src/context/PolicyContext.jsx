import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_USER_POLICIES, 
  INITIAL_PAYMENT_TRANSACTIONS, 
  INITIAL_APPLICATIONS, 
  INITIAL_SUPPORT_TICKETS 
} from '../data/mockUserPolicies';

const PolicyContext = createContext();

export function PolicyProvider({ children }) {
  // 1. User Policies Portfolio
  const [userPolicies, setUserPolicies] = useState(() => {
    const saved = localStorage.getItem('sbi_user_policies');
    return saved ? JSON.parse(saved) : INITIAL_USER_POLICIES;
  });

  // 2. Payments & Transactions
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('sbi_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_TRANSACTIONS;
  });

  // 3. Online Applications
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('sbi_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // 4. Support Tickets
  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem('sbi_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  // 5. Comparison List (max 4)
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('sbi_compare_list');
    return saved ? JSON.parse(saved) : ['sbi-life-eshield-next', 'sbi-life-smart-platina-plus'];
  });

  const [dbConnected, setDbConnected] = useState(false);

  // Sync with Backend SQLite Database on Mount
  useEffect(() => {
    async function syncWithDatabase() {
      try {
        const fetchJsonSafely = async (url) => {
          try {
            const r = await fetch(url);
            const ct = r.headers.get('content-type') || '';
            if (r.ok && ct.includes('application/json')) {
              return await r.json();
            }
            return null;
          } catch {
            return null;
          }
        };

        const [polRes, payRes, appRes, tktRes] = await Promise.all([
          fetchJsonSafely('/api/user-policies'),
          fetchJsonSafely('/api/payments'),
          fetchJsonSafely('/api/applications'),
          fetchJsonSafely('/api/tickets')
        ]);

        if (Array.isArray(polRes) && polRes.length > 0) setUserPolicies(polRes);
        if (Array.isArray(payRes) && payRes.length > 0) setPayments(payRes);
        if (Array.isArray(appRes) && appRes.length > 0) setApplications(appRes);
        if (Array.isArray(tktRes) && tktRes.length > 0) setSupportTickets(tktRes);
        if (polRes || payRes || appRes || tktRes) {
          setDbConnected(true);
        }
      } catch (err) {
        console.warn('Backend SQLite sync offline, running in resilient local cache mode.', err);
      }
    }

    syncWithDatabase();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sbi_user_policies', JSON.stringify(userPolicies));
  }, [userPolicies]);

  useEffect(() => {
    localStorage.setItem('sbi_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('sbi_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('sbi_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('sbi_compare_list', JSON.stringify(compareList));
  }, [compareList]);

  // Comparison handlers
  const toggleCompare = (policyId) => {
    setCompareList(prev => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 policies at a time.');
          return prev;
        }
        return [...prev, policyId];
      }
    });
  };

  const clearCompare = () => setCompareList([]);

  // Submit new application workflow (Optimistic UI + SQLite API Mutation)
  const submitApplication = async (appData) => {
    const refNum = `SBIL-APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApp = {
      id: `app_${Date.now()}`,
      referenceNumber: refNum,
      ...appData,
      status: 'Underwriting Review',
      statusStep: 2,
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      lastUpdatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    setApplications(prev => [newApp, ...prev]);

    // Send to SQLite Backend
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
    } catch (e) {
      console.warn('Saved proposal locally:', e);
    }

    return newApp;
  };

  // Verified Payment processing after gateway confirmation (Optimistic UI + SQLite API Mutation)
  const completePayment = async ({ paymentId, policyId, paymentMethod }) => {
    const txnRef = `SBI-EPAY-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const receiptNum = `RCPT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const paidAt = new Date().toISOString().split('T')[0];

    // 1. Update Payment Transaction Record
    setPayments(prev => prev.map(item => {
      if (item.id === paymentId || (item.policyId === policyId && item.status === 'Pending')) {
        return {
          ...item,
          status: 'Paid',
          paymentDate: paidAt,
          paymentMethod: paymentMethod || 'SBI Net Banking / YONO',
          transactionRef: txnRef,
          receiptNumber: receiptNum,
          verified: true,
          daysUntilDue: 0
        };
      }
      return item;
    }));

    // 2. Update Associated Policy: increase premiums paid, decrease remaining, advance next due date by 1 year
    setUserPolicies(prev => prev.map(pol => {
      if (pol.id === policyId) {
        const nextYear = new Date(pol.nextDueDate || paidAt);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const nextDueDateStr = pol.remainingInstallments - 1 === 0 ? null : nextYear.toISOString().split('T')[0];

        return {
          ...pol,
          premiumsPaidCount: pol.premiumsPaidCount + 1,
          remainingInstallments: Math.max(0, pol.remainingInstallments - 1),
          totalPremiumsPaidToDate: pol.totalPremiumsPaidToDate + pol.totalAnnualOutflow,
          lastPaymentDate: paidAt,
          nextDueDate: pol.remainingInstallments - 1 === 0 ? null : nextDueDateStr
        };
      }
      return pol;
    }));

    // 3. Commit to SQLite database
    try {
      await fetch('/api/payments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, policyId, paymentMethod })
      });
    } catch (e) {
      console.warn('Payment committed locally:', e);
    }

    return { txnRef, receiptNum, paidAt };
  };

  // Link existing policy via Policy Number + DOB
  const linkPolicy = async (policyNumber, dob) => {
    if (userPolicies.some(p => p.policyNumber === policyNumber)) {
      throw new Error('This policy is already linked to your account portfolio.');
    }

    const newLinked = {
      id: `pol_${Date.now()}`,
      policyNumber,
      maskedNumber: `${policyNumber.slice(0, 4)}****${policyNumber.slice(-4)}`,
      policyName: 'SBI Life - Smart Bachat',
      uin: '111N108V04',
      category: 'savings',
      categoryName: 'Savings & Guaranteed Return',
      planOption: 'Endowment with Accidental Disability Waiver',
      status: 'Active',
      sumAssured: 800000,
      premiumAmount: 42000,
      frequency: 'Yearly',
      taxAmount: 945,
      totalAnnualOutflow: 42945,
      commencementDate: '2023-01-15',
      maturityDate: '2038-01-15',
      totalTermYears: 15,
      pptYears: 10,
      premiumsPaidCount: 3,
      totalInstallments: 10,
      remainingInstallments: 7,
      totalPremiumsPaidToDate: 128835,
      lastPaymentDate: '2026-01-10',
      nextDueDate: '2027-01-15',
      gracePeriodDays: 30,
      nomineeName: 'Priya Rajesh Sharma',
      nomineeRelation: 'Spouse',
      riders: [],
      documents: [
        { name: 'Policy Certificate', file: 'SBI_SmartBachat_Bond.pdf', size: '1.2 MB' }
      ],
      milestones: [
        { year: 2023, event: 'Policy Inception', completed: true },
        { year: 2033, event: 'PPT Completion', completed: false },
        { year: 2038, event: 'Maturity Payout', completed: false }
      ]
    };

    setUserPolicies(prev => [newLinked, ...prev]);

    // Commit to SQLite
    try {
      await fetch('/api/user-policies/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policyNumber, dob })
      });
    } catch (e) {
      console.warn('Policy linked in local cache:', e);
    }

    return newLinked;
  };

  // Support ticket
  const raiseSupportTicket = async (ticket) => {
    const newTkt = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-SBIL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      resolvedAt: null,
      lastReply: 'Your request has been routed to the SBI Life Customer Servicing Desk.',
      ...ticket
    };
    setSupportTickets(prev => [newTkt, ...prev]);

    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
    } catch (e) {
      console.warn('Ticket logged locally:', e);
    }

    return newTkt;
  };

  // Admin action: update application status
  const updateApplicationStatus = async (appId, newStatus, step, notes) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          statusStep: step || app.statusStep,
          notes: notes || app.notes,
          lastUpdatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        };
      }
      return app;
    }));

    try {
      await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, statusStep: step, notes })
      });
    } catch (e) {
      console.warn('Application updated in local state:', e);
    }
  };

  return (
    <PolicyContext.Provider value={{
      userPolicies,
      payments,
      applications,
      supportTickets,
      compareList,
      dbConnected,
      toggleCompare,
      clearCompare,
      submitApplication,
      completePayment,
      linkPolicy,
      raiseSupportTicket,
      updateApplicationStatus
    }}>
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicy() {
  const context = useContext(PolicyContext);
  if (!context) {
    throw new Error('usePolicy must be used within a PolicyProvider');
  }
  return context;
}
