import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Shared Landing/Auth Header could go here */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
