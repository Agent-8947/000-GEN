
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const Stats: React.FC<{ id: string, type: string, localOverrides: any }> = ({ id, type, localOverrides }) => {
    const { globalSettings, viewportMode } = useStore();
    const gl01 = globalSettings['GL01'].params;
    const gl02 = globalSettings['GL02'].params;
    const gl03 = globalSettings['GL03'].params;
    const gl09 = globalSettings['GL09'].params;

    const isMobile = viewportMode === 'mobile';

    // DNA Binding for Fonts
    const fontName = gl01[7].value;
    const numericFont = (fontName === 'Orbitron' || fontName === 'Code')
        ? 'var(--dna-font-family)'
        : "'Orbitron', sans-serif";

    const data = localOverrides.data || { stats: [] };
    const layout = localOverrides.layout || { columns: '2', paddingY: '80' };

    const gridCols = isMobile ? '1' : layout.columns;
    const gap = gl03[1].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);
    const animEntranceY = parseFloat(gl09[2].value);

    return (
        <section
            id={id}
            className="w-full px-6 transition-all duration-500"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`
            }}
        >
            <div
                className="max-w-7xl mx-auto grid"
                style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                    gap: `${gap}px`
                }}
            >
                {(data.stats || []).map((stat: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: animEntranceY }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: animDuration, delay: i * animStagger }}
                        className="flex flex-col items-center justify-center text-center p-8 bg-black/[0.02] border border-black/5 hover:bg-black/[0.04] transition-all"
                        style={{ borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                    >
                        <div
                            className="text-5xl md:text-6xl font-black mb-2 tracking-tighter"
                            style={{
                                fontFamily: numericFont,
                                color: gl02[2].value // Accent Color
                            }}
                        >
                            {stat.value}
                        </div>
                        <div
                            className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] opacity-60"
                            style={{ color: gl02[3].value }} // Text Prim
                        >
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
