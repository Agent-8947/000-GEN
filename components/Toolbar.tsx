
import React, { useEffect } from 'react';
import { Monitor, Smartphone, Grid3X3, Zap, Camera, Undo2, Redo2 } from 'lucide-react';
import { useStore } from '../store';

export const Toolbar: React.FC = () => {
    const {
        viewportMode, setViewport,
        gridMode, cycleGrid,
        optimizeLayout, saveSnapshot,
        triggerIOFeedback,
        undo, redo, past, future
    } = useStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    redo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const isMobile = viewportMode === 'mobile';

    const baseClass = "p-2.5 transition-all duration-200 flex items-center justify-center active:scale-95 group relative";
    const activeClass = "bg-blue-500/10 text-blue-600 rounded-md";
    const inactiveClass = "text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/5";
    const disabledClass = "opacity-30 cursor-not-allowed pointer-events-none";

    return (
        <div className="mt-6 mb-4 z-50 flex items-center bg-white dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-lg p-1 gap-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <button
                onClick={undo}
                disabled={past.length === 0}
                className={`${baseClass} ${inactiveClass} ${past.length === 0 ? disabledClass : 'hover:text-blue-500'}`}
            >
                <Undo2 size={18} strokeWidth={2} />
            </button>

            <button
                onClick={redo}
                disabled={future.length === 0}
                className={`${baseClass} ${inactiveClass} ${future.length === 0 ? disabledClass : 'hover:text-blue-500'}`}
            >
                <Redo2 size={18} strokeWidth={2} />
            </button>

            <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-1" />

            <button
                onClick={() => setViewport('desktop')}
                className={`${baseClass} ${!isMobile ? activeClass : inactiveClass}`}
            >
                <Monitor size={18} strokeWidth={2} />
            </button>
            <button
                onClick={() => setViewport('mobile')}
                className={`${baseClass} ${isMobile ? activeClass : inactiveClass}`}
            >
                <Smartphone size={18} strokeWidth={2} />
            </button>

            <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-1" />

            <button
                onClick={cycleGrid}
                className={`${baseClass} ${gridMode !== 'off' ? activeClass : inactiveClass}`}
            >
                <Grid3X3 size={18} strokeWidth={2} />
            </button>

            <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-1" />

            <button
                onClick={() => {
                    optimizeLayout();
                    triggerIOFeedback();
                }}
                className={`${baseClass} ${inactiveClass} hover:text-amber-500`}
            >
                <Zap size={18} strokeWidth={2} />
            </button>

            <button
                onClick={() => {
                    saveSnapshot();
                    triggerIOFeedback();
                }}
                className={`${baseClass} ${inactiveClass} hover:text-emerald-500`}
            >
                <Camera size={18} strokeWidth={2} />
            </button>
        </div>
    );
};
