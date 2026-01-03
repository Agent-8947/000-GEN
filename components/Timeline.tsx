
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const Timeline: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl01 = globalSettings['GL01'].params;
    const gl02 = globalSettings['GL02'].params;
    const gl03 = globalSettings['GL03'].params;
    const gl09 = globalSettings['GL09'].params;

    // DNA Binding
    const fontName = gl01[7].value;
    const borderColor = gl02[5].value; // Border
    const textPrim = gl02[3].value;
    const textSec = gl02[4].value;
    const gap = parseFloat(gl03[1].value);

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const data = localOverrides.data || { items: [] };
    const layout = localOverrides.layout || { paddingY: '80' };

    return (
        <section
            id={id}
            className="w-full px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`
            }}
        >
            <div className="max-w-3xl mx-auto relative">
                {/* Vertical Line */}
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute left-[7px] top-2 bottom-2 w-px"
                    style={{ backgroundColor: borderColor, opacity: 0.3 }}
                />

                <div className="space-y-12" style={{ gap: `${gap}px` }}>
                    {(data.items || []).map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -animEntranceY }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: animDuration, delay: i * animStagger }}
                            className="flex gap-8 relative group"
                        >
                            {/* Dot */}
                            <div className="relative z-10 flex-shrink-0 mt-2">
                                <div
                                    className="w-4 h-4 rounded-full border-2 bg-white transition-all group-hover:scale-125"
                                    style={{ borderColor: borderColor }}
                                />
                                <div
                                    className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity"
                                    style={{ backgroundColor: borderColor }}
                                />
                            </div>

                            <div className="flex flex-col pb-4">
                                <div
                                    className="text-[10px] uppercase tracking-[0.4em] font-black mb-1 opacity-60"
                                    style={{
                                        color: textSec,
                                        fontFamily: fontName === 'Orbitron' ? 'var(--dna-font-family)' : 'inherit'
                                    }}
                                >
                                    {item.date}
                                </div>
                                <h3
                                    className="text-xl font-black uppercase tracking-tight mb-2"
                                    style={{
                                        color: textPrim,
                                        fontFamily: 'var(--dna-font-family)'
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    className="text-sm opacity-60 leading-relaxed max-w-xl"
                                    style={{ color: textSec }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
