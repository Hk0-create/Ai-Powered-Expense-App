import React, { useState } from 'react';
import { Wand2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import api from '../../api/axiosInstance';
import { cn } from '../../lib/utils';

const NLInputBar = ({ onParsed }) => {
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = async (e) => {
    e.preventDefault();
    if (!input.trim() || isParsing) return;

    try {
      setIsParsing(true);
      const { data } = await api.post('/ai/parse-nl', { text: input });
      onParsed(data.data);
      setInput('');
    } catch (error) {
      console.error('NL Parsing Error:', error);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full -z-10" />
      
      <form 
        onSubmit={handleParse}
        className="flex items-center gap-3 bg-white border border-border rounded-full px-5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all"
      >
        <div className="flex items-center gap-2 text-primary">
          {isParsing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5" />
          )}
        </div>
        
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your expense... (e.g. 'Lunch at KFC for 850 yesterday')"
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground placeholder:font-normal h-8"
          disabled={isParsing}
        />

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            AI POWERED
          </span>
          <button 
            type="submit"
            disabled={!input.trim() || isParsing}
            className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NLInputBar;
