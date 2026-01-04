
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

export const FeaturedProject: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
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
        title: 'Featured Project',
        projectName: 'DNA Portfolio System',
        description: 'A cutting-edge portfolio builder with advanced DNA-based theming system. Features include real-time preview, drag-and-drop interface, and seamless export capabilities.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop',
        tags: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/example/project'
    };

    const layout = localOverrides.layout || { paddingY: '80', imagePosition: 'right' };
    const isImageRight = layout.imagePosition === 'right';

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
            <div className="max-w-7xl mx-auto">
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
                    </div>
                )}

                {/* Featured Project Card */}
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isImageRight ? '' : 'lg:grid-flow-dense'}`}>
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: animDuration, delay: 0.2 }}
                        className={isImageRight ? '' : 'lg:col-start-2'}
                    >
                        <h3
                            className="text-3xl md:text-4xl font-black uppercase mb-6"
                            style={{ color: accent, fontFamily: 'var(--dna-font-family)' }}
                        >
                            {data.projectName}
                        </h3>

                        <p className="text-lg opacity-70 mb-8 leading-relaxed" style={{ color: textPrim }}>
                            {data.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {data.tags?.map((tag: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="px-4 py-2 border font-bold text-sm uppercase tracking-wider"
                                    style={{
                                        borderColor: border,
                                        borderRadius: `${gl07[0].value}px`,
                                        color: textPrim,
                                        backgroundColor: 'rgba(0,0,0,0.02)'
                                    }}
                                >
                                    {tag}
                                </motion.div>
                            ))}
                        </div>

                        {/* Links */}
                        <div className="flex gap-4">
                            {data.liveUrl && (
                                <a
                                    href={data.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                    style={{
                                        backgroundColor: accent,
                                        color: '#000',
                                        borderRadius: `${gl07[0].value}px`
                                    }}
                                >
                                    <ExternalLink size={18} />
                                    Live Demo
                                </a>
                            )}
                            {data.githubUrl && (
                                <a
                                    href={data.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 border font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 group relative overflow-hidden"
                                    style={{
                                        borderColor: border,
                                        color: textPrim,
                                        borderRadius: `${gl07[0].value}px`
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <Github size={18} className="relative z-10" />
                                    <span className="relative z-10">Source Code</span>
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: animDuration, delay: 0.3 }}
                        className="relative group"
                    >
                        <div
                            className="overflow-hidden transition-all duration-500 group-hover:scale-105"
                            style={{ borderRadius: `${gl07[0].value}px` }}
                        >
                            <img
                                src={data.image}
                                alt={data.projectName}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        {/* Overlay on hover */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                            style={{
                                backgroundColor: `${accent}20`,
                                borderRadius: `${gl07[0].value}px`
                            }}
                        >
                            <div className="text-center">
                                <ExternalLink size={48} style={{ color: accent }} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
