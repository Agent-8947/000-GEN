
import React from 'react';
import { useStore } from '../store';
import { Sun, Moon, ArrowLeftRight, RefreshCcw } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { theme, toggleTheme, isDataPanelOpen, toggleDataPanel, refreshCanvas } = useStore();
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? 'bg-[#0A0A0A]' : 'bg-white';
  const borderColor = isDark ? 'border-[#1A1A1A]' : 'border-[#D1D5DB]';
  const hoverColor = isDark ? 'hover:text-white' : 'hover:text-black';

  return (
    <aside className={`w-[60px] h-full border-l ${borderColor} ${bgColor} z-50 flex flex-col items-center py-6 transition-colors duration-500`}>
      <div className="flex flex-col items-center">
        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
          className={`p-3 mb-6 transition-all duration-300 text-gray-500 ${hoverColor}`}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun size={22} strokeWidth={1} />
          ) : (
            <Moon size={22} strokeWidth={1} />
          )}
        </button>

        {/* Unified Data Panel Button (IO) */}
        <button 
          onClick={toggleDataPanel}
          className={`p-3 mb-4 transition-all duration-300 relative group flex items-center justify-center ${
            isDataPanelOpen 
              ? 'text-blue-500' 
              : `text-gray-500 ${hoverColor}`
          }`}
          aria-label="Data Exchange"
        >
          <ArrowLeftRight size={24} strokeWidth={1} />
          {isDataPanelOpen && (
            <div className="absolute right-[-15px] top-1/4 w-[2px] h-1/2 bg-blue-500" />
          )}
          {!isDataPanelOpen && (
            <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-[0px] h-0 bg-gray-500 transition-all group-hover:w-[2px] group-hover:h-4" />
          )}
        </button>

        {/* Local Canvas Refresh Button */}
        <button 
          onClick={refreshCanvas}
          className={`p-3 mt-4 text-gray-500 ${hoverColor} transition-all hover:rotate-180 duration-700 flex items-center justify-center`}
          aria-label="Refresh Workspace"
        >
          <RefreshCcw size={24} strokeWidth={1} />
        </button>
      </div>
    </aside>
  );
};
