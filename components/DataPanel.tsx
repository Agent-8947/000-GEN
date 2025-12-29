
import React from 'react';
import { useStore } from '../store';

export const DataPanel: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? 'bg-[#0A0A0A]' : 'bg-white';
  const borderColor = isDark ? 'border-[#1A1A1A]' : 'border-[#D1D5DB]';

  return (
    <div className={`w-[320px] h-full border-l ${borderColor} ${bgColor} animate-[slideInRight_0.3s_ease-out] transition-colors duration-500 relative`}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      {/* 
        STERILE DATA VOID: 
        Unified IO space. Monochrome container with 1px borders.
        Ready for import/export architecture implementation.
      */}
    </div>
  );
};
