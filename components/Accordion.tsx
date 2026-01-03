import React, { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export const Accordion: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings, uiTheme } = useStore();
    const [openId, setOpenId] = useState<string | null>(null);

    const data = localOverrides.data || { items: [] };
    const layout = localOverrides.layout || { paddingY: '80', maxWidth: '800' };

    const gl02 = globalSettings['GL02'].params;
    const radius = globalSettings['GL07'].params[0].value;

    // Theme colors
    const textPrim = gl02[3].value; // GL02 P4
    const textSec = gl02[4].value;  // GL02 P5
    const accent = gl02[2].value;   // GL02 P3
    const borderColor = gl02[5].value; // GL02 P6
    const surface = gl02[1].value;  // GL02 P2

    return (
        <section
            id={id}
            className="w-full px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`,
                backgroundColor: localOverrides.style?.bgFill || localOverrides.style?.background || localOverrides.style?.backgroundColor || 'transparent',
                color: textPrim
            }}
        >
            <div className="mx-auto" style={{ maxWidth: `${layout.maxWidth}px` }}>
                {data.title && (
                    <h2 className="text-3xl font-black mb-16 uppercase tracking-widest text-center" style={{ color: textPrim }}>
                        {data.title}
                    </h2>
                )}

                <div className="space-y-4">
                    {(data.items || []).map((item: any) => {
                        const isOpen = openId === item.id;
                        return (
                            <div
                                key={item.id}
                                className="overflow-hidden border transition-all duration-500"
                                style={{
                                    borderColor: isOpen ? accent : `${borderColor}30`,
                                    borderRadius: `${radius}px`,
                                    backgroundColor: isOpen ? `${surface}40` : 'transparent',
                                    boxShadow: isOpen ? `0 10px 30px -10px ${accent}20` : 'none'
                                }}
                            >
                                <button
                                    onClick={() => setOpenId(isOpen ? null : item.id)}
                                    className="w-full flex items-center justify-between p-6 text-left transition-colors"
                                    style={{ color: isOpen ? accent : textPrim }}
                                >
                                    <span className="font-bold uppercase tracking-widest text-sm">
                                        {item.question}
                                    </span>
                                    <div className="transition-transform duration-300" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)' }}>
                                        {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: parseFloat(globalSettings['GL09'].params[0].value) || 0.3,
                                                ease: 'circOut'
                                            }}
                                        >
                                            <div
                                                className="px-6 pb-8 text-sm leading-relaxed font-medium"
                                                style={{ color: textSec }}
                                            >
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
