
import React, { useState } from 'react';
import { useStore } from '../store';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Portfolio: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides: overrides }) => {
    const { globalSettings, viewportMode, isPreviewMode } = useStore();
    const isMobileMode = viewportMode === 'mobile';

    // DNA Binding
    const gl02 = globalSettings['GL02'].params;
    const gl06 = globalSettings['GL06'].params;
    const gl07 = globalSettings['GL07'].params;
    const gl09 = globalSettings['GL09'].params;

    const data = overrides.data || { title: "PORTFOLIO", subtitle: "Visual presentation", items: [] };
    const layout = overrides.layout || { columns: '3', gap: '24', paddingY: '80' };
    const style = overrides.style || { hoverScale: '1.05', showCaptions: true, useGlobalRadius: true };

    const radius = style.useGlobalRadius ? `${gl07[0].value}px` : (style.borderRadius || '12px');

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const cols = isMobileMode ? '1' : (layout.columns || '3');

    const [fullScreenMedia, setFullScreenMedia] = useState<string | null>(null);

    const isVideo = (url: string) => {
        return url.includes('youtube.com') || url.includes('vimeo.com') || url.match(/\.(mp4|webm|ogg)$/i);
    };

    return (
        <section id={id} style={{ backgroundColor: style.bgFill || 'transparent' }} className="w-full px-6 transition-all duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto" style={{ paddingTop: `${layout.paddingY}px`, paddingBottom: `${layout.paddingY}px` }}>
                <motion.div
                    initial={{ opacity: 0, y: animEntranceY }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: animDuration }}
                    className="mb-12 text-center space-y-4"
                >
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight" style={{ color: gl02[3].value, fontFamily: 'var(--dna-font-family)' }}>
                        {data.title}
                    </h2>
                    <p className="text-lg opacity-60 font-medium max-w-2xl mx-auto" style={{ color: gl02[3].value }}>
                        {data.subtitle}
                    </p>
                </motion.div>

                <div
                    className="grid w-full"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        gap: `${layout.gap}px`
                    }}
                >
                    {(data.items || []).map((item: any, idx: number) => {
                        const isTilt = overrides.type === 'B0503';
                        const strength = parseFloat(overrides.physics?.strength) || 1;
                        const friction = parseFloat(overrides.physics?.friction) || 0.1;
                        const hasLink = item.link && item.link.trim() !== '';

                        const content = (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: animEntranceY }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: animDuration, delay: idx * animStagger }}
                                whileHover={isTilt ? {
                                    rotateX: 10 * strength,
                                    rotateY: 10 * strength,
                                    scale: 1.05
                                } : { scale: parseFloat(style.hoverScale) || 1.05 }}
                                className={`relative group overflow-hidden bg-black/[0.02] aspect-square ${hasLink ? 'cursor-pointer' : ''}`}
                                style={{
                                    borderRadius: radius,
                                    border: `${gl06[4].value}px solid rgba(0,0,0,${parseFloat(gl06[5].value) / 100})`,
                                    perspective: '1000px',
                                    transition: isTilt ? `transform ${0.5 + friction}s cubic-bezier(0.17, 0.67, 0.83, 0.67)` : undefined
                                }}
                                onClick={() => !hasLink && isPreviewMode && setFullScreenMedia(item.url)}
                            >
                                <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />

                                {style.showCaptions && (
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                        <span className="text-white/60 text-xs uppercase tracking-widest">{item.type}</span>
                                    </div>
                                )}

                                {item.showPlayButton && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                            <Play size={24} fill="currentColor" className="text-black ml-1" />
                                        </div>
                                    </div>
                                )}

                                {isVideo(item.url) && !item.showPlayButton && (
                                    <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                )}
                            </motion.div>
                        );

                        return hasLink ? (
                            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
                                {content}
                            </a>
                        ) : content;
                    })}
                </div>
            </div>

            <AnimatePresence>
                {fullScreenMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-8"
                        onClick={() => setFullScreenMedia(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <img src={fullScreenMedia} className="max-w-full max-h-full object-contain" alt="Selected" />
                            <button className="absolute top-0 right-0 p-4 text-white transition-transform">
                                <X size={32} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
