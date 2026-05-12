import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import ProtectedLayout from '../components/layout/ProtectedLayout';

// Pages - Lazy loaded for better performance
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Budget = lazy(() => import('../pages/Budget'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Landing = lazy(() => import('../pages/Landing'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Default redirect for protected area */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<div className="p-20 text-center text-2xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
