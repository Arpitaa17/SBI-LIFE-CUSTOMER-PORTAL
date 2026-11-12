import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Bell, 
  User, 
  Search, 
  Scale, 
  Sparkles, 
  PhoneCall, 
  CreditCard, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  HelpCircle, 
  Lock,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { usePolicy } from '../context/PolicyContext';
import NotificationDrawer from './NotificationDrawer';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, toggleAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { compareList } = usePolicy();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Policies', path: '/explore' },
    { name: 'Compare', path: '/compare', badge: compareList.length > 0 ? compareList.length : null },
    { name: 'Find Right Policy', path: '/recommendations', icon: Sparkles, highlight: true },
    { name: 'My Dashboard', path: '/dashboard', authRequired: true },
    { name: 'My Policies', path: '/my-policies', authRequired: true },
    { name: 'Pay Premium', path: '/premium-payments' },
    { name: 'Support', path: '/support' }
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* 1. TOP UTILITY BAR (SBI Midnight Blue with Ambient Accent) */}
      <div className="bg-[#051838] text-white text-[11px] py-1.5 px-4 sm:px-8 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 font-medium">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="font-bold tracking-wider text-cyan-300 uppercase text-[10px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              State Bank of India Group
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">IRDAI Regn. No. 111</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              99.2% Claim Settlement Ratio
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-[11px]">
            <a href="tel:18002679090" className="flex items-center gap-1 text-slate-300 hover:text-white transition">
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              <span>Toll Free: <strong className="text-white">1800 267 9090</strong></span>
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/premium-payments" className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition">
              <CreditCard className="w-3 h-3" />
              <span>Quick Pay</span>
            </Link>
            <span className="text-slate-600">|</span>
            {/* View Switcher: Customer vs Admin */}
            <button
              onClick={toggleAdmin}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide transition border shadow-xs ${
                isAdmin 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20' 
                  : 'bg-blue-900/60 text-cyan-200 hover:text-white border-blue-700/60'
              }`}
              title="Click to toggle between Customer View and Admin Portal"
            >
              {isAdmin ? '🛡️ Admin Console (Active)' : '⚡ Switch to Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Frosted Glassmorphism with Modern Typography) */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Glow Ring */}
          <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0b2a59] via-[#092247] to-[#041226] flex items-center justify-center p-2 shadow-md group-hover:shadow-sky-500/20 transition-all duration-300 border border-blue-900/20 group-hover:scale-105">
                {/* SBI Keyhole Emblem SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" fill="#0091da" />
                  <circle cx="50" cy="50" r="21" fill="#ffffff" />
                  <rect x="44.5" y="50" width="11" height="35" fill="#ffffff" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-blue-600 rounded-2xl blur-xs opacity-0 group-hover:opacity-30 transition duration-300 pointer-events-none -z-10"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#0b2a59]">SBI LIFE</span>
                <span className="text-[10px] font-extrabold text-sky-700 tracking-wider uppercase bg-gradient-to-r from-sky-100 to-blue-50 px-2 py-0.5 rounded-full border border-sky-200/60 shadow-xs">
                  INSURANCE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wide font-medium">With Us, You're Sure</p>
            </div>
          </Link>

          {/* Search Bar with Keyboard Pill */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-sm relative mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search policies (e.g. eShield, Platina Plus)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/90 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <kbd className="absolute right-3 top-2 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 rounded-md shadow-xs">
                Ctrl K
              </kbd>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-semibold text-slate-600">
            {navLinks.map((link) => {
              if (link.authRequired && !isLoggedIn) return null;
              const isActive = location.pathname === link.path;
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-[#0b2a59] font-extrabold bg-blue-50/80 shadow-xs' 
                      : link.highlight
                      ? 'text-sky-800 bg-gradient-to-r from-sky-50 via-cyan-50/50 to-blue-50 hover:bg-sky-100/80 border border-sky-200/70 font-bold'
                      : 'hover:text-[#0b2a59] hover:bg-slate-100/80'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-amber-500 animate-bounce" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-gradient-to-r from-[#0b2a59] to-[#0091da] text-white rounded-full font-bold shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs ${
                  location.pathname === '/admin'
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300/80'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-800" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <button
              onClick={() => setNotifDrawerOpen(true)}
              className="relative p-2.5 rounded-full text-slate-600 hover:text-[#0b2a59] hover:bg-slate-100/80 transition cursor-pointer"
              title="Policy & Payment Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800 border border-slate-200/90 shadow-xs cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0b2a59] to-[#0091da] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block leading-tight">
                    <div className="font-bold text-slate-900 truncate max-w-[110px]">{user.name}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Verified
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown with Glass Shadow */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-sky-700 font-mono mt-0.5">Client ID: {user.id}</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
                        <LayoutDashboard className="w-4 h-4 text-sky-600" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link to="/my-policies" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>My Policies ({user.name.split(' ')[0]})</span>
                      </Link>
                      <Link to="/documents" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>Tax Certificates (80C)</span>
                      </Link>
                      <Link to="/support" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span>Servicing & Tickets</span>
                      </Link>
                    </div>

                    {isAdmin && (
                      <div className="px-1.5 py-1 border-t border-slate-100">
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-xs text-amber-950 bg-amber-50 hover:bg-amber-100 font-bold rounded-xl transition border border-amber-200/60">
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Admin Control Console</span>
                        </Link>
                      </div>
                    )}

                    <div className="p-1 border-t border-slate-100">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-shine px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#0b2a59] via-[#004b87] to-[#0091da] hover:opacity-95 text-white shadow-md hover:shadow-sky-500/20 transition-all"
              >
                Login / Register
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-[#0b2a59] rounded-xl hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-5 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <input
              type="text"
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isLoggedIn) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    {link.icon && <link.icon className="w-4 h-4 text-sky-600" />}
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] bg-[#0b2a59] text-white rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200"
              >
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Admin Console</span>
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={toggleAdmin}
              className="font-bold text-sky-700 hover:underline"
            >
              Role: {isAdmin ? 'Admin' : 'Customer'}
            </button>
            {isLoggedIn ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="font-bold text-rose-600 hover:underline"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="font-bold text-[#0b2a59] hover:underline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={notifDrawerOpen} 
        onClose={() => setNotifDrawerOpen(false)} 
      />
    </header>
  );
}
