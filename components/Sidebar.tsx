
import React from 'react';
import { CircleDot, Plus } from 'lucide-react';
import { useStore } from '../store';

export const Sidebar: React.FC = () => {
  const { theme, isGlobalOpen, toggleGlobal, isBlockListOpen, toggleBlockList } = useStore();
  const isDark = theme === 'dark';

  const borderColor = isDark ? 'border-[#1A1A1A]' : 'border-[#D1D5DB]';
  const bgColor = isDark ? 'bg-[#0A0A0A]' : 'bg-white';

  return (
    <aside className={`w-[60px] h-full flex flex-col items-center py-6 border-r ${borderColor} ${bgColor} z-50 transition-colors duration-500`}>
      <div className="flex flex-col items-center gap-4">
        {/* Master Logo Button */}
        <button 
          onClick={toggleGlobal}
          className={`p-1.5 transition-all duration-300 relative group flex items-center justify-center ${
            isGlobalOpen 
              ? 'text-blue-500' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
          aria-label="Master Architecture Settings"
        >
          <CircleDot size={28} strokeWidth={1} />
          {isGlobalOpen && (
            <div className="absolute left-[-15px] top-1/4 w-[2px] h-1/2 bg-blue-500" />
          )}
          {!isGlobalOpen && (
            <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 w-[0px] h-0 bg-gray-500 transition-all group-hover:w-[2px] group-hover:h-4" />
          )}
        </button>

        {/* Add Block Button relocated from Canvas */}
        <button 
          onClick={toggleBlockList}
          className={`p-1.5 transition-all duration-300 relative group flex items-center justify-center ${
            isBlockListOpen 
              ? 'text-blue-500' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
          aria-label="Add New Block"
        >
          <Plus size={28} strokeWidth={1} />
          {isBlockListOpen && (
            <div className="absolute left-[-15px] top-1/4 w-[2px] h-1/2 bg-blue-500" />
          )}
          {!isBlockListOpen && (
            <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 w-[0px] h-0 bg-gray-500 transition-all group-hover:w-[2px] group-hover:h-4" />
          )}
        </button>
      </div>
    </aside>
  );
};
