import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await api.get('/transactions', {
          params: { search: searchQuery, limit: 5 }
        });
        setSearchResults(data.data.transactions || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleModalKeyDown = (e) => {
    const totalItems = searchQuery.trim() ? searchResults.length : 4;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        if (searchResults[selectedIndex]) {
          navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
          setShowSearchModal(false);
        }
      } else {
        const paths = ['/dashboard', '/transactions', '/analytics', '/budget'];
        navigate(paths[selectedIndex]);
        setShowSearchModal(false);
      }
    }
  };

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
        {/* Search Bar Button */}
        <div 
          onClick={() => setShowSearchModal(true)}
          className="hidden sm:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-transparent hover:border-primary/20 cursor-pointer transition-all w-44 md:w-64 group shadow-sm hover:shadow"
        >
          <Search className="w-4 h-4 text-muted-foreground mr-2 group-hover:text-primary transition-colors" />
          <span className="text-sm text-muted-foreground flex-1 select-none">Search transactions...</span>
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-border text-muted-foreground ml-2 shadow-xs">⌘K</span>
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

      {/* SpendSense AI Command Palette / Spotlight Search */}
      {showSearchModal && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200"
          onKeyDown={handleModalKeyDown}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowSearchModal(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            {/* Search Input Box */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 shrink-0">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions by merchant or description..."
                className="bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 w-full shrink-0"
              />
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold border border-slate-200 shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="max-h-[350px] overflow-y-auto p-2">
              {isSearching ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs">Searching database...</p>
                </div>
              ) : searchQuery.trim() ? (
                searchResults.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm">No transactions found for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try searching another term, e.g. "Pizza" or "Imtiaz"</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Matching Transactions
                    </div>
                    {searchResults.map((tx, idx) => (
                      <div
                        key={tx._id}
                        onClick={() => {
                          navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
                          setShowSearchModal(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                          idx === selectedIndex ? "bg-indigo-50/70 text-primary font-medium" : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-600 shrink-0">
                            {tx.category}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-xs truncate">{tx.merchant || 'General'}</p>
                            {tx.description && <p className="text-[10px] text-slate-400 truncate max-w-[240px]">{tx.description}</p>}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className={cn("font-mono font-bold text-xs", tx.type === 'income' ? "text-emerald-600" : "text-slate-900")}>
                            {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} PKR
                          </p>
                          <p className="text-[9px] text-slate-400">
                            {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Actions & Navigation
                  </div>
                  {[
                    { label: 'Go to Dashboard', path: '/dashboard', desc: 'View financial summary, alerts & metrics' },
                    { label: 'View Transactions', path: '/transactions', desc: 'Browse, edit, and delete transactions' },
                    { label: 'View Analytics', path: '/analytics', desc: 'Visualize spending trends and breakdowns' },
                    { label: 'Budget Manager', path: '/budget', desc: 'Set limit & analyze budget vs actual costs' }
                  ].map((action, idx) => (
                    <div
                      key={action.path}
                      onClick={() => {
                        navigate(action.path);
                        setShowSearchModal(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                        idx === selectedIndex ? "bg-indigo-50/70 text-primary font-medium" : "hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <div>
                        <p className="font-bold text-xs">{action.label}</p>
                        <p className="text-[10px] text-slate-400">{action.desc}</p>
                      </div>
                      <span className={cn("text-xs font-bold transition-all", idx === selectedIndex ? "text-primary translate-x-1" : "text-slate-300")}>
                        Go →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Command Palette Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium shrink-0">
              <div className="flex gap-4">
                <span><kbd className="bg-white border px-1 rounded shadow-sm font-sans font-bold">↑↓</kbd> to navigate</span>
                <span><kbd className="bg-white border px-1 rounded shadow-sm font-sans font-bold">Enter</kbd> to select</span>
              </div>
              <div>
                <span>Press <kbd className="bg-white border px-1 rounded shadow-sm font-sans font-bold">Esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
