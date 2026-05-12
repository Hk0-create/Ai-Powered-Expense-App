import React from 'react';
import { Bell, Search, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ onMenuClick }) => {
  const { user } = useAuth();

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
        <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-transparent focus-within:border-primary/30 transition-all">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-sm w-40 md:w-60"
          />
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-border text-muted-foreground ml-2">⌘K</span>
        </div>

        <button className="p-2 hover:bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-border ml-2">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground">{user?.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
