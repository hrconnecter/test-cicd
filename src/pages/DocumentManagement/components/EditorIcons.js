import React from 'react';

// Custom icons for the editor toolbar
export const SignatureIcon = () => (
  <svg viewBox="0 0 18 18" width="18" height="18">
    <path d="M2,12 L16,12 M8,2 C6,4 5,6 5,8 C5,10 6,12 8,14 C10,12 11,10 11,8 C11,6 10,4 8,2 Z" 
      fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const WatermarkIcon = () => (
  <svg viewBox="0 0 18 18" width="18" height="18">
    <path d="M3,3 L15,15 M15,3 L3,15" 
      fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <rect x="3" y="3" width="12" height="12" 
      fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

export const TableIcon = () => (
  <svg viewBox="0 0 18 18" width="18" height="18">
    <rect x="2" y="2" width="14" height="14" 
      fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="2" y1="6" x2="16" y2="6" 
      stroke="currentColor" strokeWidth="1" />
    <line x1="2" y1="10" x2="16" y2="10" 
      stroke="currentColor" strokeWidth="1" />
    <line x1="6" y1="2" x2="6" y2="16" 
      stroke="currentColor" strokeWidth="1" />
    <line x1="10" y1="2" x2="10" y2="16" 
      stroke="currentColor" strokeWidth="1" />
  </svg>
);
