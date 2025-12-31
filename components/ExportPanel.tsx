
import React from 'react';
import { useStore } from '../store';

export const ExportPanel: React.FC = () => {
  /* Fix: Correctly access theme mode from globalSettings as 'theme' property does not exist in store */
  const { globalSettings } = useStore();
  const isDark = globalSettings['GL10']?.params[6]?.value === 'Dark';
  
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
        STERILE EXPORT VOID: 
        Purged content. Monochrome container with 1px borders.
      */}
    </div>
  );
};
