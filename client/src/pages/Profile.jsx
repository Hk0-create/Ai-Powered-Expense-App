import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Globe, Save, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { toast } from 'react-hot-toast';

const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED', 'SAR'];

const Profile = () => {
  const { user, login } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'PKR',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.put('/auth/profile', profileForm);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setIsSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-r from-primary to-indigo-700 rounded-2xl p-6 text-white flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-indigo-100 text-sm">{user?.email}</p>
          <span className="mt-2 inline-block bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold">
            {user?.currency || 'PKR'} Account
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-border p-8 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg">Personal Information</h3>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
            <div className="relative mt-1.5">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl border border-border p-8 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg">Change Password</h3>

          {[
            { name: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
            { name: 'newPassword', label: 'New Password', placeholder: '••••••••' },
            { name: 'confirmPassword', label: 'Confirm New Password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name}>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{field.label}</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={passwordForm[field.name]}
                  onChange={e => setPasswordForm(p => ({ ...p, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isSavingPassword}
            className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all disabled:opacity-50"
          >
            {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Change Password
          </button>
        </form>
      )}

      {tab === 'preferences' && (
        <div className="bg-white rounded-2xl border border-border p-8 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg">Currency & Preferences</h3>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Currency</label>
            <div className="relative mt-1.5">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={profileForm.currency}
                onChange={e => setProfileForm(p => ({ ...p, currency: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notification Preferences</p>
            {[
              { label: 'Budget limit alerts', key: 'budgetAlert' },
              { label: 'Anomaly detection alerts', key: 'anomalyAlert' },
              { label: 'Weekly AI spending insights', key: 'weeklyInsight' },
            ].map(pref => (
              <label key={pref.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-border cursor-pointer hover:bg-slate-100">
                <span className="text-sm font-medium">{pref.label}</span>
                <div className="w-11 h-6 bg-primary rounded-full relative transition-all">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleProfileSave}
            disabled={isSavingProfile}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
