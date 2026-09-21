import React from 'react';

interface IslamicEmblemProps {
  size?: number;
  className?: string;
}

export const IslamicEmblem: React.FC<IslamicEmblemProps> = ({ size = 42, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#087F6B] to-[#045C4E] p-0.5 shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-white"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Rim */}
        <circle cx="50" cy="50" r="46" stroke="#E6ECEA" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
        <circle cx="50" cy="50" r="42" stroke="#19B89A" strokeWidth="1.5" />
        
        {/* 8-pointed star / Rub el Hizb geometry */}
        <g transform="translate(50,50)">
          <rect x="-24" y="-24" width="48" height="48" rx="3" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.9" />
          <rect x="-24" y="-24" width="48" height="48" rx="3" stroke="#19B89A" strokeWidth="1.5" fill="none" transform="rotate(45)" opacity="0.95" />
        </g>

        {/* Center decorative motif */}
        <circle cx="50" cy="50" r="16" fill="#045C4E" stroke="#19B89A" strokeWidth="1" />
        
        {/* Stylized Dome / Crescent Motif in center */}
        <path
          d="M50 38 C 45 42, 45 48, 50 54 C 55 48, 55 42, 50 38 Z"
          fill="#FFFFFF"
        />
        <circle cx="50" cy="46" r="2.5" fill="#19B89A" />
        
        {/* Tiny stars */}
        <circle cx="50" cy="36" r="1" fill="#FFFFFF" />
        <circle cx="44" cy="58" r="1" fill="#FFFFFF" opacity="0.8" />
        <circle cx="56" cy="58" r="1" fill="#FFFFFF" opacity="0.8" />
        <circle cx="50" cy="61" r="1.2" fill="#19B89A" />
      </svg>
    </div>
  );
};
