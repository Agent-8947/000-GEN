
import React from 'react';
import { useStore } from '../store';

export const Canvas: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  
  const borderColor = isDark ? 'border-[#2A2A2A]' : 'border-[#D1D5DB]';
  const gridColor = isDark ? 'text-white/[0.04]' : 'text-black/[0.06]';

  return (
    <div className={`w-full h-full relative overflow-hidden bg-dot-grid ${gridColor} transition-colors duration-500`}>
      {/* 
        STERILE CANVAS: 
        All UI controls moved to sidebar.
        This space is reserved for architecture visualization only.
      */}

      {/* Decorative Corner Markers */}
      <div className={`absolute bottom-6 right-6 w-4 h-4 border-r border-b ${borderColor} opacity-30`} />
      <div className={`absolute top-6 right-6 w-4 h-4 border-r border-t ${borderColor} opacity-30`} />
      <div className={`absolute bottom-6 left-6 w-4 h-4 border-l border-b ${borderColor} opacity-30`} />
      <div className={`absolute top-6 left-6 w-4 h-4 border-l border-t ${borderColor} opacity-30`} />
    </div>
  );
};
