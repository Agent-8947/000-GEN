
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Methodology: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl07 = globalSettings['GL07'].params;
    const gl09 = globalSettings['GL09'].params;

    const textPrim = gl02[3].value;
    const accent = gl02[2].value;
    const border = gl02[5].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const data = localOverrides.data || {
        title: 'Our Methodology',
        description: 'A systematic approach to delivering exceptional results',
        steps: [
            {
                number: '01',
                title: 'Discovery',
                description: 'Understanding your vision, goals, and requirements through in-depth consultation'
            },
            {
                number: '02',
                title: 'Strategy',
                description: 'Crafting a comprehensive plan aligned with your objectives and market needs'
            },
            {
                number: '03',
                title: 'Design',
                description: 'Creating stunning visuals and user experiences that captivate and convert'
            },
            {
                number: '04',
                title: 'Development',
                description: 'Building robust, scalable solutions with cutting-edge technologies'
            },
            {
                number: '05',
                title: 'Launch',
                description: 'Deploying your project with precision and ongoing support'
            }
        ]
    };

    const layout = localOverrides.layout || { paddingY: '80', style: 'vertical' };

    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: animEntranceY }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: animDuration }}
            className="w-full px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`
            }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                {data.title && (
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black uppercase mb-6"
                            style={{ color: textPrim, fontFamily: 'var(--dna-font-family)' }}
                        >
                            {data.title}
                        </motion.h2>
                        {data.description && (
                            <p className="text-lg opacity-50 max-w-2xl mx-auto" style={{ color: textPrim }}>
                                {data.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Steps */}
                <div className={layout.style === 'horizontal' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
                    {data.steps?.map((step: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: animDuration }}
                            className="relative group"
                        >
                            <div
                                className="p-8 border transition-all duration-500 hover:shadow-2xl relative overflow-hidden"
                                style={{
                                    borderColor: border,
                                    borderRadius: `${gl07[0].value}px`,
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    borderWidth: 'var(--ui-stroke-width)'
                                }}
                            >
                                {/* Hover gradient */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `linear-gradient(135deg, ${accent}05, transparent)`
                                    }}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Number */}
                                    <div
                                        className="text-6xl font-black opacity-10 mb-4"
                                        style={{ color: accent, fontFamily: 'var(--dna-font-family)' }}
                                    >
                                        {step.number}
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-2xl font-black uppercase mb-4 flex items-center gap-3"
                                        style={{ color: textPrim, fontFamily: 'var(--dna-font-family)' }}
                                    >
                                        <CheckCircle2 size={20} style={{ color: accent }} />
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm opacity-60 leading-relaxed" style={{ color: textPrim }}>
                                        {step.description}
                                    </p>

                                    {/* Arrow indicator for vertical layout */}
                                    {layout.style === 'vertical' && index < data.steps.length - 1 && (
                                        <div className="flex justify-center mt-6">
                                            <ArrowRight
                                                size={24}
                                                className="rotate-90 opacity-20"
                                                style={{ color: accent }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
