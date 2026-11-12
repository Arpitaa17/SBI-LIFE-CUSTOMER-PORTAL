import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  CreditCard, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Trash2, 
  Settings, 
  Check, 
  Smartphone, 
  Mail, 
  MessageSquare
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all');

  // Channel preferences
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    annualBonusAnnouncements: true,
    dueRemindersDaysBefore: 15
  });
  const [prefSaved, setPrefSaved] = useState(false);

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const handleSavePref = (e) => {
    e.preventDefault();
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-[#0091da]" />
            <span>Customer Communications & Alerts</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Notifications & Policy Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official servicing updates, premium reminders, policy bonus declarations, and digital receipts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-[#0b2a59] text-white rounded-xl text-xs font-bold hover:bg-[#0091da] transition flex items-center gap-1.5 shadow-xs"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold scrollbar-none">
        {['all', 'payment', 'announcement', 'document'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`py-2 px-4 rounded-xl capitalize transition ${
              filter === cat
                ? 'bg-[#0091da] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat} {cat === 'all' && `(${notifications.length})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Bell className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="font-bold text-slate-700 text-sm">No Notifications in This Category</h4>
            <p className="text-xs text-slate-400">All alerts are up-to-date.</p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition flex items-start gap-4 ${
                notif.read
                  ? 'bg-white border-slate-200'
                  : 'bg-blue-50/70 border-blue-200 ring-1 ring-blue-100'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 flex-shrink-0 mt-0.5">
                {notif.category === 'payment' && <CreditCard className="w-5 h-5 text-amber-600" />}
                {notif.category === 'document' && <FileText className="w-5 h-5 text-sky-600" />}
                {notif.category === 'announcement' && <Sparkles className="w-5 h-5 text-purple-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {notif.title}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatDate(notif.date)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  {notif.actionUrl && notif.actionUrl !== '#' ? (
                    <Link
                      to={notif.actionUrl}
                      onClick={() => markAsRead(notif.id)}
                      className="font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                    >
                      <span>Take Action →</span>
                    </Link>
                  ) : <div></div>}

                  <div className="flex items-center gap-3">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-slate-500 hover:text-slate-800 font-semibold"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Channel Preferences Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Settings className="w-5 h-5 text-sky-700" />
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Communication & Consent Preferences</h3>
            <p className="text-xs text-slate-500">Configure how and when SBI Life notifies you about your policies.</p>
          </div>
        </div>

        {prefSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Preferences saved successfully to customer profile.</span>
          </div>
        )}

        <form onSubmit={handleSavePref} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-600" />
                <span className="font-bold text-slate-800">Email Alerts</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                className="rounded text-sky-600"
              />
            </label>

            <label className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800">SMS Reminders</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.sms}
                onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
                className="rounded text-sky-600"
              />
            </label>

            <label className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="font-bold text-slate-800">WhatsApp Updates</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.whatsapp}
                onChange={(e) => setPreferences({ ...preferences, whatsapp: e.target.checked })}
                className="rounded text-sky-600"
              />
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0b2a59] hover:bg-[#0091da] text-white rounded-xl text-xs font-bold transition shadow"
            >
              Save Notification Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
