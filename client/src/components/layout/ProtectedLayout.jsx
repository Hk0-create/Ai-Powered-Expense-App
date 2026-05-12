import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { cn } from '../../lib/utils';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
