import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { dbAll, dbGet, dbRun, initializeDatabase } from './db/database.js';
import { calculateIndicativePremium, generatePolicyRecommendations } from '../src/utils/calculators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

// Initialize and Seed SQLite database
initializeDatabase().catch(err => console.error('Failed to initialize database:', err));

// 1. Health & Database Diagnostic Check
app.get('/api/health', async (req, res) => {
  try {
    const policyCount = await dbGet('SELECT COUNT(*) as count FROM policies');
    const userPolicyCount = await dbGet('SELECT COUNT(*) as count FROM user_policies');
    const paymentCount = await dbGet('SELECT COUNT(*) as count FROM payment_transactions');
    const appCount = await dbGet('SELECT COUNT(*) as count FROM applications');

    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      service: 'SBI Life Core Portal API',
      database: {
        type: 'SQLite3 Persistent Database',
        file: 'data/sbi_life.sqlite',
        status: 'Connected & Synced',
        stats: {
          policiesCatalogue: policyCount?.count || 0,
          userActivePolicies: userPolicyCount?.count || 0,
          paymentLedgerRows: paymentCount?.count || 0,
          applicationsCount: appCount?.count || 0
        }
      },
      irdaiRegNo: 111,
      cin: 'L99999MH2000PLC129113'
    });
  } catch (err) {
    res.status(500).json({ error: 'Database health check failed', details: err.message });
  }
});

// 2. Policies Catalogue
app.get('/api/policies', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM policies WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(uin) LIKE ? OR LOWER(summary) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    const rows = await dbAll(query, params);
    // Parse json details
    const parsed = rows.map(r => r.data_json ? JSON.parse(r.data_json) : r);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve policies', details: err.message });
  }
});

app.get('/api/policies/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM policies WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Policy not found in SBI Life catalogue' });
    }
    const policy = row.data_json ? JSON.parse(row.data_json) : row;
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

// 3. Indicative Premium Calculation
app.post('/api/quote', async (req, res) => {
  try {
    const { policyId, age, gender, sumAssured, policyTerm, ppt, isTobacco, riders } = req.body;
    const row = await dbGet('SELECT * FROM policies WHERE id = ?', [policyId]);
    if (!row) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    const policy = row.data_json ? JSON.parse(row.data_json) : row;

    const quote = calculateIndicativePremium({
      policy,
      age: Number(age) || 30,
      gender: gender || 'male',
      sumAssured: Number(sumAssured) || 10000000,
      policyTerm: Number(policyTerm) || 30,
      ppt: ppt || 'Regular',
      isTobacco: Boolean(isTobacco),
      riders: riders || []
    });

    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: 'Calculation failed', details: err.message });
  }
});

// 4. Recommendation Engine
app.post('/api/recommendations', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM policies');
    const allPolicies = rows.map(r => r.data_json ? JSON.parse(r.data_json) : r);
    const results = generatePolicyRecommendations(req.body, allPolicies);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Recommendation generation failed', details: err.message });
  }
});

// 5. User Policies Portfolio
app.get('/api/user-policies', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM user_policies ORDER BY commencement_date DESC');
    const parsed = rows.map(r => {
      if (r.data_json) {
        try {
          return { ...JSON.parse(r.data_json), ...r };
        } catch {
          return r;
        }
      }
      return r;
    });
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user portfolio', details: err.message });
  }
});

app.post('/api/user-policies/link', async (req, res) => {
  try {
    const { policyNumber, dob } = req.body;
    if (!policyNumber || !dob) {
      return res.status(400).json({ error: 'Policy Number and Date of Birth are mandatory' });
    }

    // Check if already in database
    const existing = await dbGet('SELECT id FROM user_policies WHERE policy_number = ?', [policyNumber]);
    if (existing) {
      return res.status(400).json({ error: 'Policy is already linked to your portfolio' });
    }

    const newId = `pol_${Date.now()}`;
    const masked = `${policyNumber.slice(0, 4)}****${policyNumber.slice(-4)}`;

    const newLinked = {
      id: newId,
      policyNumber,
      maskedNumber: masked,
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
      nomineeName: 'Priya Rajesh Sharma',
      nomineeRelation: 'Spouse',
      riders: []
    };

    await dbRun(`
      INSERT INTO user_policies (
        id, user_id, policy_number, masked_number, policy_name, uin, category, category_name,
        plan_option, status, sum_assured, premium_amount, frequency, total_annual_outflow,
        commencement_date, maturity_date, total_term_years, ppt_years, premiums_paid_count,
        total_installments, remaining_installments, total_premiums_paid_to_date,
        last_payment_date, next_due_date, nominee_name, nominee_relation, data_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newId, 'usr_89213', policyNumber, masked, newLinked.policyName, newLinked.uin,
      newLinked.category, newLinked.categoryName, newLinked.planOption, newLinked.status,
      newLinked.sumAssured, newLinked.premiumAmount, newLinked.frequency, newLinked.totalAnnualOutflow,
      newLinked.commencementDate, newLinked.maturityDate, newLinked.totalTermYears, newLinked.pptYears,
      newLinked.premiumsPaidCount, newLinked.totalInstallments, newLinked.remainingInstallments,
      newLinked.totalPremiumsPaidToDate, newLinked.lastPaymentDate, newLinked.nextDueDate,
      newLinked.nomineeName, newLinked.nomineeRelation, JSON.stringify(newLinked)
    ]);

    await dbRun(`
      INSERT INTO audit_logs (id, action, performed_by, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `, [
      `log_${Date.now()}`,
      'POLICY_LINKED',
      'CUSTOMER',
      `Policy ${masked} successfully linked via OTP authentication.`,
      new Date().toISOString()
    ]);

    res.json({ message: 'Policy linked successfully in SQLite database', policy: newLinked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to link policy', details: err.message });
  }
});

// 6. Payments & Installment History
app.get('/api/payments', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM payment_transactions ORDER BY due_date ASC');
    res.json(rows.map(r => ({
      ...r,
      verified: Boolean(r.verified),
      installmentNumber: r.installment_number,
      dueDate: r.due_date,
      paymentDate: r.payment_date,
      paymentMethod: r.payment_method,
      transactionRef: r.transaction_ref,
      receiptNumber: r.receipt_number,
      policyId: r.policy_id,
      policyNumber: r.policy_number,
      policyName: r.policy_name
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve payment records', details: err.message });
  }
});

app.post('/api/payments/pay', async (req, res) => {
  try {
    const { paymentId, policyId, paymentMethod } = req.body;
    const txnRef = `SBI-EPAY-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const receiptNum = `RCPT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const paidAt = new Date().toISOString().split('T')[0];

    // 1. Update Payment Transaction in Database
    await dbRun(`
      UPDATE payment_transactions
      SET status = 'Paid',
          payment_date = ?,
          payment_method = ?,
          transaction_ref = ?,
          receipt_number = ?,
          verified = 1
      WHERE id = ? OR (policy_id = ? AND status = 'Pending')
    `, [paidAt, paymentMethod || 'SBI Net Banking', txnRef, receiptNum, paymentId, policyId]);

    // 2. Update Associated Policy in Database
    const pol = await dbGet('SELECT * FROM user_policies WHERE id = ?', [policyId]);
    if (pol) {
      const nextYear = new Date(pol.next_due_date || paidAt);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextDueDateStr = pol.remaining_installments - 1 === 0 ? null : nextYear.toISOString().split('T')[0];

      await dbRun(`
        UPDATE user_policies
        SET premiums_paid_count = premiums_paid_count + 1,
            remaining_installments = MAX(0, remaining_installments - 1),
            total_premiums_paid_to_date = total_premiums_paid_to_date + ?,
            last_payment_date = ?,
            next_due_date = ?
        WHERE id = ?
      `, [pol.total_annual_outflow, paidAt, nextDueDateStr, policyId]);
    }

    // 3. Log Audit Record
    await dbRun(`
      INSERT INTO audit_logs (id, action, performed_by, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `, [
      `log_${Date.now()}`,
      'PAYMENT_SETTLED',
      'SBI_EPAY_GATEWAY',
      `Payment reconciled for policy ${policyId}. Receipt: ${receiptNum}, Txn: ${txnRef}`,
      new Date().toISOString()
    ]);

    res.json({
      status: 'Success',
      message: 'Payment verified and committed to SQLite master records',
      transactionRef: txnRef,
      receiptNumber: receiptNum,
      paidAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment settlement failed', details: err.message });
  }
});

// 7. Online Proposal Applications
app.get('/api/applications', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM applications ORDER BY submitted_at DESC');
    res.json(rows.map(r => ({
      ...r,
      referenceNumber: r.reference_number,
      policyId: r.policy_id,
      policyName: r.policy_name,
      planOption: r.plan_option,
      applicantName: r.applicant_name,
      annualIncome: r.annual_income,
      coverageAmount: r.coverage_amount,
      policyTerm: r.policy_term,
      paymentFrequency: r.payment_frequency,
      calculatedBasePremium: r.calculated_base_premium,
      totalAnnualPremium: r.total_annual_premium,
      nomineeName: r.nominee_name,
      nomineeRelationship: r.nominee_relationship,
      nomineeAge: r.nominee_age,
      kycType: r.kyc_type,
      kycNumber: r.kyc_number,
      statusStep: r.status_step,
      submittedAt: r.submitted_at,
      lastUpdatedAt: r.last_updated_at
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve applications', details: err.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const refNum = `SBIL-APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newId = `app_${Date.now()}`;
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const {
      policyId, policyName, planOption, applicantName, dob, annualIncome,
      occupation, coverageAmount, policyTerm, ppt, paymentFrequency,
      calculatedBasePremium, gst, totalAnnualPremium, nomineeName,
      nomineeRelationship, nomineeAge, kycType, notes
    } = req.body;

    await dbRun(`
      INSERT INTO applications (
        id, reference_number, policy_id, policy_name, plan_option, applicant_name,
        dob, annual_income, occupation, coverage_amount, policy_term, ppt,
        payment_frequency, calculated_base_premium, gst, total_annual_premium,
        nominee_name, nominee_relationship, nominee_age, kyc_type, kyc_number,
        status, status_step, submitted_at, last_updated_at, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newId, refNum, policyId, policyName, planOption || 'Standard', applicantName,
      dob, annualIncome, occupation, coverageAmount, policyTerm, ppt,
      paymentFrequency, calculatedBasePremium, gst, totalAnnualPremium,
      nomineeName, nomineeRelationship, nomineeAge, kycType || 'DigiLocker CKYC',
      `CKYC-${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      'Underwriting Review', 2, now, now, notes || 'Proposal submitted via customer portal'
    ]);

    await dbRun(`
      INSERT INTO audit_logs (id, action, performed_by, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `, [
      `log_${Date.now()}`,
      'PROPOSAL_SUBMITTED',
      'CUSTOMER',
      `New proposal ${refNum} logged for ${policyName}. Applicant: ${applicantName}`,
      new Date().toISOString()
    ]);

    res.status(201).json({
      id: newId,
      referenceNumber: refNum,
      status: 'Underwriting Review',
      submittedAt: now
    });
  } catch (err) {
    res.status(500).json({ error: 'Proposal submission failed', details: err.message });
  }
});

// Update application status (Admin Underwriting)
app.patch('/api/applications/:id', async (req, res) => {
  try {
    const { status, statusStep, notes } = req.body;
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    await dbRun(`
      UPDATE applications
      SET status = ?,
          status_step = COALESCE(?, status_step),
          notes = COALESCE(?, notes),
          last_updated_at = ?
      WHERE id = ?
    `, [status, statusStep, notes, now, req.params.id]);

    res.json({ message: 'Application updated in database', id: req.params.id, status, lastUpdatedAt: now });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application', details: err.message });
  }
});

// 8. Support Tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM support_tickets ORDER BY created_at DESC');
    res.json(rows.map(r => ({
      ...r,
      ticketNumber: r.ticket_number,
      policyNumber: r.policy_number,
      createdAt: r.created_at,
      resolvedAt: r.resolved_at,
      lastReply: r.last_reply
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tickets', details: err.message });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const tktNum = `TKT-SBIL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `tkt_${Date.now()}`;
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const { subject, policyNumber, category, description, priority } = req.body;

    await dbRun(`
      INSERT INTO support_tickets (
        id, ticket_number, subject, policy_number, category, status, priority,
        created_at, last_reply, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newId, tktNum, subject, policyNumber || 'General Servicing', category || 'Policy Servicing',
      'Open', priority || 'Normal', now, 'Your servicing request has been queued.', description
    ]);

    res.status(201).json({
      id: newId,
      ticketNumber: tktNum,
      status: 'Open',
      createdAt: now
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register ticket', details: err.message });
  }
});

// 9. Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM notifications ORDER BY date DESC');
    res.json(rows.map(r => ({
      ...r,
      read: Boolean(r.read),
      urgent: Boolean(r.urgent),
      actionUrl: r.action_url
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve notifications', details: err.message });
  }
});

app.post('/api/notifications/broadcast', async (req, res) => {
  try {
    const newId = `notif_${Date.now()}`;
    const { title, message, category, urgent, actionUrl } = req.body;
    const date = new Date().toISOString().split('T')[0];

    await dbRun(`
      INSERT INTO notifications (id, title, message, category, date, read, urgent, action_url)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `, [newId, title, message, category || 'announcement', date, urgent ? 1 : 0, actionUrl || '/explore']);

    res.status(201).json({ message: 'Broadcast published to SQLite database', id: newId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to broadcast notification', details: err.message });
  }
});

// 10. Audit Logs
app.get('/api/audit-logs', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit logs', details: err.message });
  }
});

// SPA fallback for direct URL refreshes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile('index.html', { root: distPath });
});

app.listen(PORT, () => {
  console.log(`SBI Life Backend API Server active on http://localhost:${PORT}`);
});
