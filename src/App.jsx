import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ExplorePoliciesPage from './pages/ExplorePoliciesPage';
import PolicyDetailsPage from './pages/PolicyDetailsPage';
import ComparePoliciesPage from './pages/ComparePoliciesPage';
import ApplyPolicyPage from './pages/ApplyPolicyPage';
import RecommendationEnginePage from './pages/RecommendationEnginePage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import MyPoliciesPage from './pages/MyPoliciesPage';
import PremiumPaymentsPage from './pages/PremiumPaymentsPage';
import MaturityTrackerPage from './pages/MaturityTrackerPage';
import NotificationsPage from './pages/NotificationsPage';
import DocumentsPage from './pages/DocumentsPage';
import CustomerSupportPage from './pages/CustomerSupportPage';
import AuthPage from './pages/AuthPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PolicyProvider } from './context/PolicyContext';
import { NotificationProvider } from './context/NotificationContext';

// Scroll to top helper on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <PolicyProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePoliciesPage />} />
                  <Route path="/policy/:id" element={<PolicyDetailsPage />} />
                  <Route path="/compare" element={<ComparePoliciesPage />} />
                  <Route path="/apply" element={<ApplyPolicyPage />} />
                  <Route path="/recommendations" element={<RecommendationEnginePage />} />
                  <Route path="/dashboard" element={<CustomerDashboardPage />} />
                  <Route path="/my-policies" element={<MyPoliciesPage />} />
                  <Route path="/premium-payments" element={<PremiumPaymentsPage />} />
                  <Route path="/timeline" element={<MaturityTrackerPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/support" element={<CustomerSupportPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/admin" element={<AdminPanelPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </PolicyProvider>
    </AuthProvider>
  );
}
