import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  Github
} from 'lucide-react';
import { cn } from '../lib/utils';

const Landing = () => {
  return (
    <div className="bg-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <Sparkles className="w-8 h-8" />
          <span>SpendSense AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#security" className="hover:text-primary transition-colors">Security</a>
          <a href="#tech" className="hover:text-primary transition-colors">Tech Stack</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">Sign In</Link>
          <Link to="/register" className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-primary px-4 py-2 rounded-full text-xs font-bold mb-8 animate-bounce">
          <Zap className="w-3 h-3 fill-primary" />
          POWERED BY GEMINI 1.5 FLASH
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
          Financial Tracking <br />
          <span className="text-primary italic">Reimagined with AI.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-12 leading-relaxed">
          The only expense manager that uses generative intelligence to categorize, analyze, and forecast your wealth in real-time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-slate-300 flex items-center justify-center gap-2">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="https://github.com" className="w-full sm:w-auto border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>
        
        {/* Hero Mockup Placeholder */}
        <div className="mt-24 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10" />
          <div className="bg-white border border-border p-4 rounded-[2.5rem] shadow-2xl shadow-slate-300">
            <div className="bg-slate-50 rounded-[2rem] aspect-video flex items-center justify-center border border-border">
               <div className="text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-primary" />
                 </div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dashboard Preview</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Everything you need <br /> to master your money.</h2>
            <p className="text-slate-500 font-medium">Four core pillars of financial intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: "AI Core", desc: "Auto-tagging and natural language parsing using Gemini 1.5 Flash.", color: "bg-indigo-500" },
              { icon: Zap, title: "Analytics", desc: "Deep trend analysis and real-time category breakdowns.", color: "bg-amber-500" },
              { icon: ShieldCheck, title: "Security", desc: "JWT rotation with httpOnly cookies for bulletproof auth.", color: "bg-emerald-500" },
              { icon: BarChart3, title: "Forecast", desc: "Linear regression coupled with AI for month-end predictions.", color: "bg-rose-500" }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg", f.color)}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Sparkles className="w-6 h-6" />
          <span>SpendSense AI</span>
        </div>
        <p className="text-sm text-slate-400 font-medium">© 2025 SpendSense AI. Built for the modern builder.</p>
        <div className="flex items-center gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
           {/* Simple placeholders for social links */}
           <div className="w-5 h-5 bg-slate-900 rounded-full" />
           <div className="w-5 h-5 bg-slate-900 rounded-full" />
           <div className="w-5 h-5 bg-slate-900 rounded-full" />
        </div>
      </footer>
    </div>
  );
};

export default Landing;
