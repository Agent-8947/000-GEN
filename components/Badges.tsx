
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const Badges: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl03 = globalSettings['GL03'].params;
    const gl09 = globalSettings['GL09'].params;

    const textPrim = gl02[3].value;
    const accent = gl02[2].value;
    const gap = localOverrides.layout?.gap || gl03[1].value;
    const paddingY = localOverrides.layout?.paddingY || '40';

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const tags = localOverrides.data?.tags || [];

    return (
        <div
            id={id}
            className="w-full flex flex-wrap justify-center overflow-hidden"
            style={{
                gap: `${gap}px`,
                paddingTop: `${paddingY}px`,
                paddingBottom: `${paddingY}px`
            }}
        >
            {tags.map((tag: string, i: number) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.5, y: animEntranceY }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: animDuration, delay: i * animStagger }}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    className="px-4 py-1.5 border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-default"
                    style={{
                        color: textPrim,
                        borderColor: i === 0 ? accent : 'rgba(0,0,0,0.1)',
                        fontFamily: 'var(--dna-font-family)',
                        borderRadius: `${globalSettings['GL07'].params[0].value}px`
                    }}
                >
                    {tag}
                </motion.span>
            ))}
        </div>
    );
};
