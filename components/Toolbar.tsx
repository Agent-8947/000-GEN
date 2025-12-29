
import React from 'react';
import { Monitor, Smartphone, Grid3X3 } from 'lucide-react';
import { useStore } from '../store';

export const Toolbar: React.FC = () => {
    const { theme, viewportMode, setViewport, gridMode, cycleGrid } = useStore();
    const isMobile = viewportMode === 'mobile';
    const isDark = theme === 'dark';

    const baseClass = "p-2.5 transition-all duration-200 flex items-center justify-center active:scale-95 group relative";
    const activeClass = "bg-blue-500/10 text-blue-600 rounded-md";
    const inactiveClass = "text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/5";

    const Tooltip = ({ label }: { label: string }) => (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 dark:bg-white/90 text-white dark:text-black text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            {label}
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80 dark:border-t-white/90" />
        </div>
    );

    return (
        <div className="mt-6 mb-4 z-50 flex items-center bg-white dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-lg p-1 gap-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <button
                onClick={() => setViewport('desktop')}
                className={`${baseClass} ${!isMobile ? activeClass : inactiveClass}`}
                title="Desktop View"
            >
                <Monitor size={18} strokeWidth={2} />
                <Tooltip label="Desktop" />
            </button>
            <button
                onClick={() => setViewport('mobile')}
                className={`${baseClass} ${isMobile ? activeClass : inactiveClass}`}
                title="Mobile View"
            >
                <Smartphone size={18} strokeWidth={2} />
                <Tooltip label="Mobile" />
            </button>

            <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-1" />

            <button
                onClick={cycleGrid}
                className={`${baseClass} ${gridMode !== 'off' ? (
                    gridMode === 'columns' ? 'bg-indigo-500/10 text-indigo-600 rounded-md' :
                        gridMode === 'mobile' ? 'bg-blue-500/10 text-blue-600 rounded-md' :
                            'bg-violet-500/10 text-violet-600 rounded-md'
                ) : inactiveClass}`}
                title={`Grid Mode: ${gridMode.toUpperCase()} (G)`}
            >
                <Grid3X3 size={18} strokeWidth={2} />
                <Tooltip label={`Mode: ${gridMode}`} />
            </button>
        </div>
    );
};
