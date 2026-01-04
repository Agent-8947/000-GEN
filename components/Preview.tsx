
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const Preview: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings, viewportMode } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl07 = globalSettings['GL07'].params;
    const gl09 = globalSettings['GL09'].params;

    const isMobileMode = viewportMode === 'mobile';
    const textPrim = gl02[3].value;
    const border = gl02[5].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const data = localOverrides.data || { title: 'Live Preview', url: '' };
    const layout = localOverrides.layout || { paddingY: '80', aspect: '16/9' };

    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: animEntranceY, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: animDuration }}
            className="w-full flex flex-col items-center px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`
            }}
        >
            {/* Container stays same size */}
            <div
                className="w-full max-w-5xl border overflow-hidden relative group transition-all duration-700 hover:shadow-2xl flex items-center justify-center"
                style={{
                    aspectRatio: layout.aspect === '16/9' ? '16/9' : '4/3',
                    borderColor: border,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: `${gl07[0].value}px`
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-[10px] uppercase tracking-[1em] opacity-5 font-black">
                        {isMobileMode ? 'Mobile_Viewport' : 'Desktop_Viewport'}
                    </div>
                </div>
                {data.url && (
                    <iframe src={data.url} className="w-full h-full border-none z-10 relative" title={data.title} />
                )}
            </div>
            <h3
                className="mt-8 text-xs font-black uppercase tracking-[0.4em] opacity-40"
                style={{ color: textPrim, fontFamily: 'var(--dna-font-family)' }}
            >
                {data.title}
            </h3>
        </motion.div>
    );
};
