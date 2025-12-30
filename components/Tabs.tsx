import React, { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export const Tabs: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings, uiTheme } = useStore();
    const data = localOverrides.data || { tabs: [] };
    const [activeTabId, setActiveTabId] = useState(data.tabs?.[0]?.id || '');

    const layout = localOverrides.layout || { paddingY: '120' };
    const gl02 = globalSettings['GL02'].params;
    const radius = globalSettings['GL07'].params[0].value;

    const activeTab = data.tabs?.find((t: any) => t.id === activeTabId);

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
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 mb-12 p-1 bg-black/[0.03] rounded-2xl w-fit mx-auto" style={{ borderRadius: `${radius}px` }}>
                    {(data.tabs || []).map((tab: any) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`px-8 py-3 text-xs font-black uppercase tracking-widest transition-all relative z-0`}
                            style={{ color: activeTabId === tab.id ? '#FFF' : 'rgba(0,0,0,0.3)' }}
                        >
                            <span className="relative z-10">{tab.label}</span>
                            {activeTabId === tab.id && (
                                <motion.div
                                    layoutId={`tabs-${id}`}
                                    className="absolute inset-0 bg-black -z-10 shadow-lg"
                                    style={{ borderRadius: `${Math.max(0, parseInt(radius) - 4)}px` }}
                                    transition={{
                                        type: 'spring',
                                        bounce: 0.2,
                                        duration: parseFloat(globalSettings['GL09'].params[0].value) || 0.6,
                                        ease: (() => {
                                            const easeId = globalSettings['GL09'].params[5].value;
                                            switch (easeId) {
                                                case '1': return 'easeInOut';
                                                case '2': return 'circOut';
                                                case '3': return 'backOut';
                                                case '4': return 'linear';
                                                default: return 'easeInOut';
                                            }
                                        })()
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="relative min-h-[200px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTabId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: parseFloat(globalSettings['GL09'].params[0].value) || 0.4,
                                ease: (() => {
                                    const easeId = globalSettings['GL09'].params[5].value;
                                    switch (easeId) {
                                        case '1': return 'easeInOut';
                                        case '2': return 'circOut';
                                        case '3': return 'backOut';
                                        case '4': return 'linear';
                                        default: return 'easeInOut';
                                    }
                                })()
                            }}
                            className="text-center"
                        >
                            <div className="text-sm font-mono opacity-50 leading-loose max-w-2xl mx-auto">
                                {activeTab?.content}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
