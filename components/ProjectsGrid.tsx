
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

export const ProjectsGrid: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
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
        title: 'Projects',
        description: 'A collection of my recent work and experiments',
        projects: [
            {
                id: '1',
                name: 'E-Commerce Platform',
                description: 'Modern online shopping experience with real-time inventory',
                image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop',
                tags: ['React', 'Node.js', 'MongoDB'],
                liveUrl: 'https://example.com',
                githubUrl: 'https://github.com'
            },
            {
                id: '2',
                name: 'Task Management App',
                description: 'Collaborative workspace for teams with real-time updates',
                image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
                tags: ['Vue.js', 'Firebase', 'Tailwind'],
                liveUrl: 'https://example.com',
                githubUrl: 'https://github.com'
            },
            {
                id: '3',
                name: 'Analytics Dashboard',
                description: 'Data visualization platform with interactive charts',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
                tags: ['Next.js', 'D3.js', 'PostgreSQL'],
                liveUrl: 'https://example.com',
                githubUrl: 'https://github.com'
            },
            {
                id: '4',
                name: 'Social Media App',
                description: 'Connect and share with friends in real-time',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
                tags: ['React Native', 'GraphQL', 'AWS'],
                liveUrl: 'https://example.com',
                githubUrl: 'https://github.com'
            }
        ]
    };

    const layout = localOverrides.layout || { paddingY: '80', columns: '2' };
    const columns = parseInt(layout.columns) || 2;

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
                <div className="text-center mb-16">
                    {data.title && (
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black uppercase mb-6"
                            style={{ color: textPrim, fontFamily: 'var(--dna-font-family)' }}
                        >
                            {data.title}
                        </motion.h2>
                    )}
                    {data.description && (
                        <p className="text-lg opacity-50 max-w-2xl mx-auto" style={{ color: textPrim }}>
                            {data.description}
                        </p>
                    )}
                </div>

                {/* Projects Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-8`}>
                    {data.projects?.map((project: any, index: number) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: animDuration }}
                            className="group relative border overflow-hidden"
                            style={{
                                borderColor: border,
                                borderRadius: `${gl07[0].value}px`,
                                backgroundColor: 'rgba(0,0,0,0.02)'
                            }}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden aspect-video">
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Overlay */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4"
                                    style={{ backgroundColor: `${accent}90` }}
                                >
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={20} style={{ color: accent }} />
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Github size={20} style={{ color: accent }} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3
                                    className="text-xl font-black uppercase mb-3"
                                    style={{ color: textPrim, fontFamily: 'var(--dna-font-family)' }}
                                >
                                    {project.name}
                                </h3>
                                <p className="text-sm opacity-60 mb-4 leading-relaxed" style={{ color: textPrim }}>
                                    {project.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {project.tags?.map((tag: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
                                            style={{
                                                backgroundColor: `${accent}10`,
                                                color: accent,
                                                borderRadius: `${gl07[0].value}px`
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
