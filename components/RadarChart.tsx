
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const RadarChart: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl09 = globalSettings['GL09'].params;

    const accent = gl02[2].value;
    const textSec = gl02[4].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const data = localOverrides.data || { axis: [] };
    const layout = localOverrides.layout || { size: '400', paddingY: '80' };

    const size = parseInt(layout.size);
    const center = size / 2;
    const radius = center * 0.8;

    // Calc points for a hexagon as a fallback if axis < 3
    const axisCount = Math.max(3, data.axis?.length || 6);
    const angleStep = (Math.PI * 2) / axisCount;

    const points = (data.axis || []).map((a: any, i: number) => {
        const val = (a.value || 50) / 100;
        const x = center + Math.cos(i * angleStep - Math.PI / 2) * radius * val;
        const y = center + Math.sin(i * angleStep - Math.PI / 2) * radius * val;
        return `${x},${y}`;
    }).join(' ');

    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

    return (
        <section
            id={id}
            className="w-full flex flex-col items-center group overflow-visible"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`,
                fontFamily: 'var(--dna-font-family)'
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: animEntranceY }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: animDuration }}
                className="relative transition-all duration-500 group-hover:scale-[1.05]"
            >
                <svg width={size} height={size} className="overflow-visible">
                    {/* Grid */}
                    {gridLevels.map((lvl, idx) => {
                        const lvlRadius = radius * lvl;
                        const polyPoints = Array.from({ length: axisCount }).map((_, i) => {
                            const x = center + Math.cos(i * angleStep - Math.PI / 2) * lvlRadius;
                            const y = center + Math.sin(i * angleStep - Math.PI / 2) * lvlRadius;
                            return `${x},${y}`;
                        }).join(' ');
                        return <polygon key={idx} points={polyPoints} fill="none" stroke="black" strokeWidth="0.5" strokeOpacity="0.05" />;
                    })}

                    {/* Axis Lines */}
                    {Array.from({ length: axisCount }).map((_, i) => {
                        const x = center + Math.cos(i * angleStep - Math.PI / 2) * radius;
                        const y = center + Math.sin(i * angleStep - Math.PI / 2) * radius;
                        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="black" strokeWidth="0.5" strokeOpacity="0.05" />;
                    })}

                    {/* The Chart */}
                    <motion.polygon
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: animDuration, delay: 0.3 }}
                        points={points}
                        fill={accent}
                        fillOpacity="0.1"
                        stroke={accent}
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />

                    {/* Labels */}
                    {(data.axis || []).map((a: any, i: number) => {
                        const x = center + Math.cos(i * angleStep - Math.PI / 2) * (radius + 20);
                        const y = center + Math.sin(i * angleStep - Math.PI / 2) * (radius + 20);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                className="text-[10px] font-black uppercase tracking-widest opacity-40"
                                style={{ fill: textSec }}
                            >
                                {a.label}
                            </text>
                        );
                    })}
                </svg>
            </motion.div>
            <div className="mt-8 text-[10px] uppercase font-black tracking-[0.6em] opacity-10">Diagnostic_Visual_Matrix</div>
        </section>
    );
};
