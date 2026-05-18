import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  Github,
  Cpu,
  Twitter,
  Linkedin,
  Heart,
  Target,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from '../components/shared/Logo';

const Landing = () => {
  return (
    <div className="bg-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <Logo className="w-8 h-8" />
          <span>SpendSense AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#security" className="hover:text-primary transition-colors">Security</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
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
          SPENDSENSE COGNITIVE ENGINE
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
              { icon: Cpu, title: "AI Core", desc: "Auto-tagging and natural language parsing powered by SpendSense Cognitive Intelligence.", color: "bg-indigo-500" },
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

      {/* Security Section */}
      <section id="security" className="bg-slate-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-full text-xs font-bold mb-6">
              <ShieldCheck className="w-4 h-4" />
              ENTERPRISE-GRADE SECURITY
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              Your financial data. <br />
              <span className="text-indigo-400">Locked and shielded.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed font-medium mb-10 max-w-lg">
              SpendSense AI is designed from the ground up with a security-first architecture. We never store raw passwords, and your transaction intelligence is fully isolated and strictly audited.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Rotate-on-Demand JWTs", desc: "Short-lived JSON Web Tokens with client-side state isolation for secure request authorization." },
                { title: "HttpOnly Refresh Cookies", desc: "Session recovery stored inside HTTP-only, secure cookies, completely immune to XSS token theft." },
                { title: "Strict End-to-End Cryptography", desc: "All sensitive API queries and financial models are encrypted in-transit using TLS 1.3 encryption protocols." }
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1 font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-200 mb-1">{s.title}</h5>
                    <p className="text-sm text-slate-400 font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" />
            <div className="relative bg-slate-950 border border-slate-800 p-8 md:p-12 rounded-3xl">
              <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">Zero-Trust Architecture</h3>
              <p className="text-slate-400 leading-relaxed font-medium text-sm mb-8">
                Our servers run isolated sandboxes where every API route validates inputs against rigorous schemas, guarding you against SQL injections and common vulnerability vectors.
              </p>
              <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-sm">
                  100%
                </div>
                <div>
                  <h6 className="font-bold text-slate-200 text-sm">Non-custodial Audits</h6>
                  <p className="text-xs text-slate-500 font-medium">Automatic daily vulnerability scans enabled.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-32 bg-slate-50 border-t border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="bg-white border border-border p-6 rounded-[2.5rem] shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50/70 p-6 rounded-[2rem] text-center">
                  <h4 className="text-3xl font-black text-indigo-600 mb-1">AI-First</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Natural Language Parsing</p>
                </div>
                <div className="bg-emerald-50/70 p-6 rounded-[2rem] text-center">
                  <h4 className="text-3xl font-black text-emerald-600 mb-1">Instant</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Categorization</p>
                </div>
                <div className="bg-amber-50/70 p-6 rounded-[2rem] text-center col-span-2">
                  <h4 className="text-4xl font-black text-amber-600 mb-1">Zero effort</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Smart Financial Intelligence</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-xs font-bold mb-6">
              <Heart className="w-4 h-4 fill-rose-500" />
              ABOUT SPENDSENSE AI
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Reimagining personal wealth <br />
              <span className="text-primary italic">for the modern builder.</span>
            </h2>
            <p className="text-slate-500 leading-relaxed font-medium mb-8">
              SpendSense AI was born out of a simple problem: traditional expense trackers make you manually fill out tedious forms, pick dates, and assign tags. We believed that personal finance should adapt to human language, not the other way around.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 mb-1">Our Mission</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">To automate financial tracking so you can focus on building true wealth.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 mb-1">Zero Placeholders</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Built with premium, fully-functional interfaces and robust APIs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Logo className="w-6 h-6" />
          <span>SpendSense AI</span>
        </div>
        <p className="text-sm text-slate-400 font-medium">© 2025 SpendSense AI. Built for the modern builder.</p>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
            title="Twitter / X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
