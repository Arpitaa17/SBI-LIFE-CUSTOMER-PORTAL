import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { VERIFIED_POLICIES } from '../../src/data/verifiedPolicies.js';
import { 
  INITIAL_USER_PROFILE,
  INITIAL_USER_POLICIES, 
  INITIAL_PAYMENT_TRANSACTIONS, 
  INITIAL_APPLICATIONS, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_NOTIFICATIONS 
} from '../../src/data/mockUserPolicies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'sbi_life.sqlite');
console.log(`Connecting to SQLite Database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SBI Life SQLite Persistent Database.');
  }
});

// Helper for promise-based queries
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Initialize Tables and Seed Initial Verified Data
 */
export async function initializeDatabase() {
  db.serialize(async () => {
    // 1. Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        mobile TEXT,
        pan_masked TEXT,
        aadhaar_masked TEXT,
        dob TEXT,
        annual_income INTEGER,
        city TEXT,
        state TEXT,
        pincode TEXT,
        kyc_status TEXT,
        role TEXT DEFAULT 'customer'
      )
    `);

    // 2. Policies Catalogue table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS policies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        uin TEXT NOT NULL,
        category TEXT NOT NULL,
        category_name TEXT NOT NULL,
        tagline TEXT,
        summary TEXT,
        customer_profile TEXT,
        min_entry_age INTEGER,
        max_entry_age INTEGER,
        min_policy_term INTEGER,
        max_policy_term INTEGER,
        min_sum_assured INTEGER,
        max_sum_assured INTEGER,
        death_benefit TEXT,
        maturity_benefit TEXT,
        tax_benefits TEXT,
        official_url TEXT,
        brochure_url TEXT,
        data_json TEXT
      )
    `);

    // 3. User Policies Portfolio table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS user_policies (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        policy_number TEXT NOT NULL,
        masked_number TEXT NOT NULL,
        policy_name TEXT NOT NULL,
        uin TEXT,
        category TEXT,
        category_name TEXT,
        plan_option TEXT,
        status TEXT NOT NULL,
        sum_assured INTEGER,
        premium_amount INTEGER,
        frequency TEXT,
        total_annual_outflow INTEGER,
        commencement_date TEXT,
        maturity_date TEXT,
        total_term_years INTEGER,
        ppt_years INTEGER,
        premiums_paid_count INTEGER,
        total_installments INTEGER,
        remaining_installments INTEGER,
        total_premiums_paid_to_date INTEGER,
        last_payment_date TEXT,
        next_due_date TEXT,
        nominee_name TEXT,
        nominee_relation TEXT,
        data_json TEXT
      )
    `);

    // 4. Payment Transactions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id TEXT PRIMARY KEY,
        policy_id TEXT,
        policy_number TEXT,
        policy_name TEXT,
        installment_number INTEGER,
        amount INTEGER,
        due_date TEXT,
        payment_date TEXT,
        status TEXT NOT NULL,
        payment_method TEXT,
        transaction_ref TEXT,
        receipt_number TEXT,
        verified INTEGER DEFAULT 0
      )
    `);

    // 5. Applications table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        reference_number TEXT UNIQUE NOT NULL,
        policy_id TEXT,
        policy_name TEXT,
        plan_option TEXT,
        applicant_name TEXT,
        dob TEXT,
        annual_income INTEGER,
        occupation TEXT,
        coverage_amount INTEGER,
        policy_term INTEGER,
        ppt TEXT,
        payment_frequency TEXT,
        calculated_base_premium INTEGER,
        gst INTEGER,
        total_annual_premium INTEGER,
        nominee_name TEXT,
        nominee_relationship TEXT,
        nominee_age INTEGER,
        kyc_type TEXT,
        kyc_number TEXT,
        status TEXT NOT NULL,
        status_step INTEGER DEFAULT 1,
        submitted_at TEXT,
        last_updated_at TEXT,
        notes TEXT
      )
    `);

    // 6. Support Tickets table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id TEXT PRIMARY KEY,
        ticket_number TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        policy_number TEXT,
        category TEXT,
        status TEXT NOT NULL,
        priority TEXT DEFAULT 'Normal',
        created_at TEXT,
        resolved_at TEXT,
        last_reply TEXT,
        description TEXT
      )
    `);

    // 7. Notifications table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        category TEXT,
        date TEXT,
        read INTEGER DEFAULT 0,
        urgent INTEGER DEFAULT 0,
        action_url TEXT
      )
    `);

    // 8. Audit logs table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        performed_by TEXT,
        details TEXT,
        timestamp TEXT
      )
    `);

    console.log('Database tables verified / created.');

    // Seed Data if tables are empty
    const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
    if (userCount && userCount.count === 0) {
      console.log('Seeding initial data into SQLite database...');
      
      // Seed User
      await dbRun(`
        INSERT INTO users (id, name, email, mobile, pan_masked, aadhaar_masked, dob, annual_income, city, state, pincode, kyc_status, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        INITIAL_USER_PROFILE.id,
        INITIAL_USER_PROFILE.name,
        INITIAL_USER_PROFILE.email,
        INITIAL_USER_PROFILE.mobile,
        INITIAL_USER_PROFILE.panMasked,
        INITIAL_USER_PROFILE.aadhaarMasked,
        INITIAL_USER_PROFILE.dob,
        INITIAL_USER_PROFILE.annualIncome,
        INITIAL_USER_PROFILE.city,
        INITIAL_USER_PROFILE.state,
        INITIAL_USER_PROFILE.pincode,
        INITIAL_USER_PROFILE.kycStatus,
        INITIAL_USER_PROFILE.role
      ]);

      // Seed Policies
      for (const p of VERIFIED_POLICIES) {
        await dbRun(`
          INSERT INTO policies (id, name, uin, category, category_name, tagline, summary, customer_profile, min_entry_age, max_entry_age, min_policy_term, max_policy_term, min_sum_assured, max_sum_assured, death_benefit, maturity_benefit, tax_benefits, official_url, brochure_url, data_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          p.id, p.name, p.uin, p.category, p.categoryName, p.tagline, p.summary, p.customerProfile,
          p.minEntryAge, p.maxEntryAge, p.minPolicyTerm, p.maxPolicyTerm, p.minSumAssured, p.maxSumAssured,
          p.deathBenefit, p.maturityBenefit, p.taxBenefits, p.officialUrl, p.brochureUrl, JSON.stringify(p)
        ]);
      }

      // Seed User Policies
      for (const pol of INITIAL_USER_POLICIES) {
        await dbRun(`
          INSERT INTO user_policies (id, user_id, policy_number, masked_number, policy_name, uin, category, category_name, plan_option, status, sum_assured, premium_amount, frequency, total_annual_outflow, commencement_date, maturity_date, total_term_years, ppt_years, premiums_paid_count, total_installments, remaining_installments, total_premiums_paid_to_date, last_payment_date, next_due_date, nominee_name, nominee_relation, data_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          pol.id, INITIAL_USER_PROFILE.id, pol.policyNumber, pol.maskedNumber, pol.policyName, pol.uin,
          pol.category, pol.categoryName, pol.planOption, pol.status, pol.sumAssured, pol.premiumAmount,
          pol.frequency, pol.totalAnnualOutflow, pol.commencementDate, pol.maturityDate, pol.totalTermYears,
          pol.pptYears, pol.premiumsPaidCount, pol.totalInstallments, pol.remainingInstallments,
          pol.totalPremiumsPaidToDate, pol.lastPaymentDate, pol.nextDueDate, pol.nomineeName, pol.nomineeRelation,
          JSON.stringify(pol)
        ]);
      }

      // Seed Payments
      for (const pay of INITIAL_PAYMENT_TRANSACTIONS) {
        await dbRun(`
          INSERT INTO payment_transactions (id, policy_id, policy_number, policy_name, installment_number, amount, due_date, payment_date, status, payment_method, transaction_ref, receipt_number, verified)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          pay.id, pay.policyId, pay.policyNumber, pay.policyName, pay.installmentNumber, pay.amount,
          pay.dueDate, pay.paymentDate, pay.status, pay.paymentMethod, pay.transactionRef, pay.receiptNumber,
          pay.verified ? 1 : 0
        ]);
      }

      // Seed Applications
      for (const app of INITIAL_APPLICATIONS) {
        await dbRun(`
          INSERT INTO applications (id, reference_number, policy_id, policy_name, plan_option, applicant_name, dob, annual_income, occupation, coverage_amount, policy_term, ppt, payment_frequency, calculated_base_premium, gst, total_annual_premium, nominee_name, nominee_relationship, nominee_age, kyc_type, kyc_number, status, status_step, submitted_at, last_updated_at, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          app.id, app.referenceNumber, app.policyId, app.policyName, app.planOption, app.applicantName,
          app.dob, app.annualIncome, app.occupation, app.coverageAmount, app.policyTerm, app.ppt,
          app.paymentFrequency, app.calculatedBasePremium, app.gst, app.totalAnnualPremium, app.nomineeName,
          app.nomineeRelationship, app.nomineeAge, app.kycType, app.kycNumber, app.status, app.statusStep,
          app.submittedAt, app.lastUpdatedAt, app.notes
        ]);
      }

      // Seed Support Tickets
      for (const tkt of INITIAL_SUPPORT_TICKETS) {
        await dbRun(`
          INSERT INTO support_tickets (id, ticket_number, subject, policy_number, category, status, priority, created_at, resolved_at, last_reply, description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          tkt.id, tkt.ticketNumber, tkt.subject, tkt.policyNumber, tkt.category, tkt.status, tkt.priority,
          tkt.createdAt, tkt.resolvedAt, tkt.lastReply, tkt.subject
        ]);
      }

      // Seed Notifications
      for (const n of INITIAL_NOTIFICATIONS) {
        await dbRun(`
          INSERT INTO notifications (id, title, message, category, date, read, urgent, action_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          n.id, n.title, n.message, n.category, n.date, n.read ? 1 : 0, n.urgent ? 1 : 0, n.actionUrl
        ]);
      }

      // Initial audit log
      await dbRun(`
        INSERT INTO audit_logs (id, action, performed_by, details, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `, [
        `log_${Date.now()}`,
        'SYSTEM_INITIALIZATION',
        'SYSTEM',
        'Initialized SBI Life SQLite Database with seed catalogue and mock records.',
        new Date().toISOString()
      ]);

      console.log('Database successfully seeded with verified records.');
    }
  });
}

export default db;
