import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  AlertTriangle, 
  Info, 
  Clock, 
  CheckCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { cn } from '../../lib/utils';

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'budget_alert':
      return {
        icon: AlertTriangle,
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-100',
      };
    case 'recurring_due':
      return {
        icon: Clock,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-100',
      };
    case 'weekly_insight':
    default:
      return {
        icon: Info,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50 border-indigo-100',
      };
  }
};

const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground hidden md:block">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-transparent focus-within:border-primary/30 transition-all">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-sm w-40 md:w-60"
          />
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-border text-muted-foreground ml-2">⌘K</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 rounded-full relative transition-colors",
              showNotifications ? "bg-primary/10 text-primary" : "hover:bg-slate-100 text-muted-foreground"
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-destructive text-white text-[9px] font-black rounded-full border border-white flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-slate-50/50">
                <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-medium">All caught up! No notifications.</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const style = getNotificationIcon(n.type);
                    return (
                      <div 
                        key={n._id}
                        onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                        className={cn(
                          "p-4 flex gap-3 hover:bg-slate-50/70 transition-colors cursor-pointer relative",
                          !n.isRead && "bg-indigo-50/20"
                        )}
                      >
                        <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center shrink-0", style.bg, style.color)}>
                          <style.icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-xs text-slate-900 truncate">{n.title}</h5>
                            <span className="text-[10px] font-medium text-slate-400 shrink-0">{formatTimeAgo(n.createdAt)}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                        </div>

                        {/* Unread indicator dot */}
                        {!n.isRead && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Popover Menu */}
        <div className="relative pl-2 border-l border-border ml-2" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-slate-50 p-1 rounded-xl transition-all cursor-pointer group"
          >
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-all overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User summary details header */}
              <div className="px-4 py-3 border-b border-border bg-slate-50/50">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button 
                  disabled
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-not-allowed"
                >
                  <UserIcon className="w-4 h-4" />
                  My Profile <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded ml-auto">Coming Soon</span>
                </button>
                <button 
                  disabled
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-not-allowed"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded ml-auto">Coming Soon</span>
                </button>
                
                <hr className="border-border my-1.5" />

                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-xl flex items-center gap-2 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
