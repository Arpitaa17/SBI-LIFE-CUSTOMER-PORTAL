import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Bell, CheckCheck, CreditCard, Sparkles, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';

export default function NotificationDrawer({ isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'announcement':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0b2a59] text-white rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Notifications & Alerts</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread notices` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 p-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-white overflow-x-auto text-xs">
          {['all', 'payment', 'announcement', 'document'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full font-medium capitalize whitespace-nowrap transition ${
                filter === cat
                  ? 'bg-[#0b2a59] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No notifications in this category</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition relative ${
                  notif.read
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {formatDate(notif.date)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      {notif.actionUrl && notif.actionUrl !== '#' && (
                        <Link
                          to={notif.actionUrl}
                          onClick={() => {
                            markAsRead(notif.id);
                            onClose();
                          }}
                          className="font-bold text-sky-700 hover:underline flex items-center gap-1"
                        >
                          View Details →
                        </Link>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-[11px] text-slate-500 hover:text-slate-800"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-xs font-bold text-[#0b2a59] hover:underline"
          >
            Manage Notification Preferences & History →
          </Link>
        </div>
      </div>
    </div>
  );
}
