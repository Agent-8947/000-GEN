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

    return (
        <section
            id={id}
            className="w-full px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`,
                backgroundColor: localOverrides.style?.background || 'transparent'
            }}
        >
            <div className="mx-auto" style={{ maxWidth: `${layout.maxWidth}px` }}>
                {data.title && (
                    <h2 className="text-2xl font-black mb-12 uppercase tracking-tighter text-center" style={{ color: gl02[3].value }}>
                        {data.title}
                    </h2>
                )}

                <div className="space-y-4">
                    {(data.items || []).map((item: any) => {
                        const isOpen = openId === item.id;
                        return (
                            <div
                                key={item.id}
                                className="overflow-hidden border transition-all duration-300"
                                style={{
                                    borderColor: uiTheme.elements,
                                    borderRadius: `${radius}px`,
                                    backgroundColor: isOpen ? 'rgba(0,0,0,0.02)' : 'transparent'
                                }}
                            >
                                <button
                                    onClick={() => setOpenId(isOpen ? null : item.id)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-bold uppercase tracking-tight text-sm opacity-80">
                                        {item.question}
                                    </span>
                                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: parseFloat(globalSettings['GL09'].params[0].value) || 0.3,
                                                ease: (() => {
                                                    const easeId = globalSettings['GL09'].params[5].value;
                                                    switch (easeId) {
                                                        case '1': return 'easeInOut';
                                                        case '2': return 'circOut';
                                                        case '3': return [0.34, 1.56, 0.64, 1]; // backOut
                                                        case '4': return 'linear';
                                                        case '5': return [0.175, 0.885, 0.32, 1.275]; // bounce-ish
                                                        default: return 'easeInOut';
                                                    }
                                                })()
                                            }}
                                            className="px-6 pb-6 text-sm opacity-40 leading-relaxed font-mono"
                                        >
                                            {item.answer}
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
