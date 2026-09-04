import React from 'react';

export const ConnectionsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-b from-[#4852d4] via-[#5c67f2] to-[#f4f6fc]">
      {/* Network connection nodes and subtle grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#c7d2fe" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Constellation connection lines */}
        <line x1="15%" y1="12%" x2="35%" y2="22%" stroke="url(#lineGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="35%" y1="22%" x2="50%" y2="8%" stroke="url(#lineGlow)" strokeWidth="2" />
        <line x1="50%" y1="8%" x2="70%" y2="18%" stroke="url(#lineGlow)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="70%" y1="18%" x2="88%" y2="14%" stroke="url(#lineGlow)" strokeWidth="2" />
        <line x1="20%" y1="28%" x2="50%" y2="8%" stroke="url(#lineGlow)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="80%" y1="28%" x2="50%" y2="8%" stroke="url(#lineGlow)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="30%" y1="40%" x2="50%" y2="35%" stroke="url(#lineGlow)" strokeWidth="1.5" />
        <line x1="70%" y1="40%" x2="50%" y2="35%" stroke="url(#lineGlow)" strokeWidth="1.5" />

        {/* Circular Orbit paths like in the image */}
        <circle cx="50%" cy="30%" r="180" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="8 8" />
        <circle cx="50%" cy="30%" r="280" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

        {/* Nodes */}
        <circle cx="15%" cy="12%" r="5" fill="#ffffff" />
        <circle cx="35%" cy="22%" r="4" fill="#ffffff" />
        <circle cx="50%" cy="8%" r="7" fill="#ffffff" />
        <circle cx="70%" cy="18%" r="4" fill="#ffffff" />
        <circle cx="88%" cy="14%" r="5" fill="#ffffff" />
        <circle cx="20%" cy="28%" r="3" fill="#ffffff" opacity="0.8" />
        <circle cx="80%" cy="28%" r="3" fill="#ffffff" opacity="0.8" />
      </svg>

      {/* Soft ambient light blooms */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-white/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-48 left-1/4 w-[280px] h-[280px] bg-indigo-300/15 blur-2xl rounded-full pointer-events-none" />
      <div className="absolute top-48 right-1/4 w-[280px] h-[280px] bg-blue-300/15 blur-2xl rounded-full pointer-events-none" />
    </div>
  );
};
