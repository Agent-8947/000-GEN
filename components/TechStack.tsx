
import React, { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Database, Palette, Zap, Cloud, Shield } from 'lucide-react';

export const TechStack: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
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

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const data = localOverrides.data || {
        title: 'Technology Stack',
        description: 'Cutting-edge tools and frameworks powering our solutions',
        categories: [
            {
                id: 'frontend',
                name: 'Frontend',
                icon: 'code',
                color: '#3B82F6',
                technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
            },
            {
                id: 'backend',
                name: 'Backend',
                icon: 'database',
                color: '#10B981',
                technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis']
            },
            {
                id: 'design',
                name: 'Design',
                icon: 'palette',
                color: '#F59E0B',
                technologies: ['Figma', 'Adobe XD', 'Sketch', 'Blender', 'After Effects']
            },
            {
                id: 'devops',
                name: 'DevOps',
                icon: 'cloud',
                color: '#8B5CF6',
                technologies: ['Docker', 'Kubernetes', 'AWS', 'Vercel', 'GitHub Actions']
            },
            {
                id: 'tools',
                name: 'Tools',
                icon: 'zap',
                color: '#EC4899',
                technologies: ['Git', 'VS Code', 'Postman', 'Jira', 'Notion']
            },
            {
                id: 'security',
                name: 'Security',
                icon: 'shield',
                color: '#EF4444',
                technologies: ['OAuth', 'JWT', 'SSL/TLS', 'OWASP', 'Cloudflare']
            }
        ]
    };

    const layout = localOverrides.layout || { paddingY: '80' };

    const getIcon = (iconName: string) => {
        const icons: Record<string, any> = {
            code: Code2,
            database: Database,
            palette: Palette,
            zap: Zap,
            cloud: Cloud,
            shield: Shield
        };
        const IconComponent = icons[iconName] || Code2;
        return <IconComponent size={24} />;
    };

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
                        {data.description && (
                            <p className="text-lg opacity-50 max-w-2xl mx-auto" style={{ color: textPrim }}>
                                {data.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Interactive Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {data.categories?.map((category: any, index: number) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: animDuration }}
                            className="relative"
                        >
                            <button
                                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                                className="w-full p-4 md:p-6 border transition-all duration-300 hover:scale-105 active:scale-95 group"
                                style={{
                                    borderColor: selectedCategory === category.id ? category.color : border,
                                    borderRadius: `${gl07[0].value}px`,
                                    backgroundColor: selectedCategory === category.id ? `${category.color}10` : 'rgba(0,0,0,0.02)',
                                    borderWidth: selectedCategory === category.id ? '2px' : 'var(--ui-stroke-width)'
                                }}
                            >
                                {/* Icon */}
                                <div
                                    className="mb-0 md:mb-4 transition-all duration-300 flex justify-center"
                                    style={{
                                        color: selectedCategory === category.id ? category.color : textPrim,
                                        opacity: selectedCategory === category.id ? 1 : 0.5
                                    }}
                                >
                                    {getIcon(category.icon)}
                                </div>

                                {/* Name - Hidden on mobile */}
                                <div
                                    className="hidden md:block text-sm font-black uppercase transition-all duration-300"
                                    style={{
                                        color: selectedCategory === category.id ? category.color : textPrim,
                                        fontFamily: 'var(--dna-font-family)'
                                    }}
                                >
                                    {category.name}
                                </div>

                                {/* Count - Hidden on mobile */}
                                <div className="hidden md:block text-xs opacity-30 mt-1">
                                    {category.technologies?.length || 0} tools
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Technologies List */}
                <AnimatePresence mode="wait">
                    {selectedCategory && (
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-8 overflow-hidden"
                        >
                            <div
                                className="p-8 border"
                                style={{
                                    borderColor: data.categories.find((c: any) => c.id === selectedCategory)?.color || accent,
                                    borderRadius: `${gl07[0].value}px`,
                                    backgroundColor: `${data.categories.find((c: any) => c.id === selectedCategory)?.color || accent}05`,
                                    borderWidth: '2px'
                                }}
                            >
                                <h3
                                    className="text-2xl font-black uppercase mb-6"
                                    style={{
                                        color: data.categories.find((c: any) => c.id === selectedCategory)?.color || accent,
                                        fontFamily: 'var(--dna-font-family)'
                                    }}
                                >
                                    {data.categories.find((c: any) => c.id === selectedCategory)?.name}
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {data.categories
                                        .find((c: any) => c.id === selectedCategory)
                                        ?.technologies?.map((tech: string, idx: number) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="px-4 py-2 border font-bold text-sm"
                                                style={{
                                                    borderColor: data.categories.find((c: any) => c.id === selectedCategory)?.color || accent,
                                                    borderRadius: `${gl07[0].value}px`,
                                                    color: textPrim,
                                                    backgroundColor: 'rgba(255,255,255,0.5)'
                                                }}
                                            >
                                                {tech}
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
