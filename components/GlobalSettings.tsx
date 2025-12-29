
import React from 'react';
import { useStore } from '../store';

export const GlobalSettings: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? 'bg-[#0A0A0A]' : 'bg-white';
  const borderColor = isDark ? 'border-[#1A1A1A]' : 'border-gray-100';
  const panelBorderColor = isDark ? 'border-[#1A1A1A]' : 'border-[#D1D5DB]';

  return (
    <div className={`w-[320px] h-full border-r ${panelBorderColor} ${bgColor} animate-[slideIn_0.3s_ease-out] transition-colors duration-500 relative`}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      <div className="p-8">
        <h2 className={`font-sans font-medium text-[12px] tracking-[0.4em] uppercase opacity-80 border-b border-ui ${borderColor} pb-5 mb-8 select-none text-current`}>
          000-GEN settings
        </h2>
      </div>

      {/* 
        The rest of the space remains a sterile void, 
        ready for further DNA parameter initialization.
      */}
    </div>
  );
};
