
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const Testimonials: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl03 = globalSettings['GL03'].params;
    const gl09 = globalSettings['GL09'].params;

    const textPrim = gl02[3].value;
    const textSec = gl02[4].value;
    const border = gl02[5].value;
    const gap = gl03[1].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const data = localOverrides.data || { items: [] };
    const layout = localOverrides.layout || { columns: '3', paddingY: '80', speed: '40' };
    const isMarquee = localOverrides.type === 'B2202';

    if (isMarquee) {
        return (
            <section
                id={id}
                className="w-full overflow-hidden"
                style={{
                    paddingTop: `${layout.paddingY}px`,
                    paddingBottom: `${layout.paddingY}px`,
                    backgroundColor: localOverrides.style?.background || 'transparent'
                }}
            >
                <div className="flex whitespace-nowrap">
                    <motion.div
                        className="flex gap-8 px-4"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            duration: 1000 / (parseFloat(layout.speed) || 40),
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {[...data.items, ...data.items, ...data.items].map((item: any, i: number) => (
                            <div
                                key={i}
                                className="inline-block p-8 bg-white border min-w-[350px] whitespace-normal"
                                style={{ borderColor: border, borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                            >
                                <p className="text-lg leading-relaxed mb-8 font-medium italic" style={{ color: textPrim }}>
                                    "{item.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black/5" />
                                    <div>
                                        <div className="text-sm font-black uppercase tracking-widest" style={{ color: textPrim }}>{item.name}</div>
                                        <div className="text-[10px] uppercase tracking-widest opacity-40" style={{ color: textSec }}>{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section
            id={id}
            className="w-full px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`,
                fontFamily: 'var(--dna-font-family)',
                backgroundColor: localOverrides.style?.background || 'transparent'
            }}
        >
            <div
                className="max-w-7xl mx-auto grid"
                style={{
                    gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                    gap: `${gap}px`
                }}
            >
                {(data.items || []).map((item: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: animEntranceY }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: animDuration, delay: i * animStagger }}
                        whileHover={{ y: -2 }}
                        className="p-8 bg-white border transition-all duration-300 hover:shadow-xl group"
                        style={{ borderColor: border, borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                    >
                        <div className="text-3xl mb-6 opacity-20">"</div>
                        <p
                            className="text-lg leading-relaxed mb-8 font-medium italic"
                            style={{ color: textPrim }}
                        >
                            {item.quote}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-black/5" />
                            <div>
                                <div className="text-sm font-black uppercase tracking-widest" style={{ color: textPrim }}>{item.name}</div>
                                <div className="text-[10px] uppercase tracking-widest opacity-40" style={{ color: textSec }}>{item.role}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
