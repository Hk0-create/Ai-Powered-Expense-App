import React from 'react';

const Logo = ({ className = "w-8 h-8", fillClass = "text-primary" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo 600 */}
          <stop offset="50%" stopColor="#6366F1" /> {/* Indigo 500 */}
          <stop offset="100%" stopColor="#4F46E5" /> {/* Indigo 600 */}
        </linearGradient>
      </defs>
      
      {/* Outer rounded geometric grid representing security & intelligence */}
      <circle cx="16" cy="16" r="14" fill="url(#logoGrad)" opacity="0.15" />
      
      {/* Financial Growth Trend Line */}
      <path 
        d="M23 11.5L16.5 18L12.5 14L7 19.5" 
        stroke="url(#logoGrad)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Main target node */}
      <circle cx="23" cy="11.5" r="3" fill="#4F46E5" />
      
      {/* Asset growth bars at the bottom */}
      <path 
        d="M11 22V24M16 20V24M21 17V24" 
        stroke="url(#logoGrad)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;
