import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Smartphone, 
  User, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [formData, setFormData] = useState({
    email: 'rajesh.sharma@example.com',
    password: '••••••••',
    fullName: 'Rajesh Sharma',
    mobile: '+91 98765 43210',
    otp: ''
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      return;
    }

    login({ email: formData.email });
    navigate('/dashboard');
  };

  const handleQuickCustomerLogin = () => {
    login({ email: 'rajesh.sharma@example.com' });
    navigate('/dashboard');
  };

  const handleQuickAdminLogin = () => {
    login({ email: 'admin@sbilife.co.in' });
    navigate('/admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#0b2a59] text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          SBI Life Customer Portal
        </h1>
        <p className="text-xs text-slate-500">
          Secure, multi-factor encrypted access to your policy records
        </p>
      </div>

      {/* Demo Quick Logins */}
      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-sky-900">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>One-Click Demo Account Access</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleQuickCustomerLogin}
            className="p-2.5 rounded-xl bg-white border border-sky-300 hover:bg-sky-100 font-bold text-sky-900 transition text-center shadow-xs"
          >
            Customer View (Rajesh)
          </button>
          <button
            onClick={handleQuickAdminLogin}
            className="p-2.5 rounded-xl bg-[#0b2a59] text-white hover:bg-[#0091da] font-bold transition text-center shadow-xs"
          >
            Admin Panel View
          </button>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Toggle Mode */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login' ? 'bg-white text-[#0b2a59] shadow-xs' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register' ? 'bg-white text-[#0b2a59] shadow-xs' : 'text-slate-500'
            }`}
          >
            Register Online
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="e.g. Rajesh Sharma"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Registered Email or Client ID</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                placeholder="rajesh.sharma@example.com"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                placeholder="••••••••"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {otpSent && (
            <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-xl animate-in fade-in">
              <label className="block font-bold text-blue-900">Enter Multi-Factor OTP (MFA)</label>
              <input
                type="text"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                className="w-full p-2 bg-white border border-blue-300 rounded-lg text-center font-mono font-bold tracking-widest text-base"
                placeholder="123456"
                required
              />
              <span className="text-[10px] text-blue-700 block text-center">
                Demo OTP: Enter any 6 digits to verify
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#0b2a59] hover:bg-[#0091da] text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md text-xs"
          >
            <span>{otpSent ? 'Authenticate & Sign In' : 'Send 2FA Secure OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-slate-400 text-[11px]">
          <span>Protected by 256-Bit SSL • Certified IRDAI Security Compliance</span>
        </div>
      </div>
    </div>
  );
}
