import React, { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { token } = useAuth();

  const markAsRead = async (id) => {
    if (!token) return;
    try {
      await markNotificationAsRead(id, token);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  useEffect(() => {
    if (!token) return undefined;

    let active = true;
    const loadNotifications = async () => {
      try {
        const data = await getNotifications(token);
        if (active) {
          setNotifications(
            Array.isArray(data) ? data.filter((notification) => !notification.read) : []
          );
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (active) setNotifications([]);
      }
    };

    void loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition text-slate-300"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl border border-white/10 bg-[#0a0c10] p-4 shadow-2xl backdrop-blur-xl z-50">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">
              System Alerts
            </h3>
            <span className="text-[10px] font-bold text-[#DE984B] bg-[#DE984B]/10 px-2 py-1 rounded-full">
              {unreadCount} Unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">
                No recent notifications
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border text-xs transition ${
                    item.read
                      ? "bg-transparent border-white/5 text-gray-400"
                      : "bg-white/[0.04] border-[#1C5675]/40 text-slate-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-200">{item.title}</h4>
                    {!item.read && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="text-gray-400 hover:text-emerald-400"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-gray-400 leading-relaxed">{item.message}</p>
                  <p className="mt-1.5 text-[10px] text-gray-600">{timeAgo(item.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}