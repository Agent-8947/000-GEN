
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, Globe, Instagram, Youtube } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    youtube: Youtube,
    globe: Globe
};

export const SocialDock: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl09 = globalSettings['GL09'].params;

    const accent = gl02[2].value;
    const textSec = gl02[4].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const data = localOverrides.data || { platforms: [] };
    const layout = localOverrides.layout || { position: 'center', paddingY: '40' };

    return (
        <div
            id={id}
            className={`w-full flex items-center gap-6 ${layout.position === 'center' ? 'justify-center' : 'justify-start px-12'}`}
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`,
                fontFamily: 'var(--dna-font-family)'
            }}
        >
            {(data.platforms || []).map((platform: any, i: number) => {
                const Icon = ICON_MAP[platform.type] || Globe;
                return (
                    <motion.a
                        key={i}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8, y: animEntranceY }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: animDuration, delay: i * animStagger }}
                        whileHover={{ y: -2 }}
                        className="group relative p-3 hover:bg-black/[0.03] transition-all"
                        style={{ borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                    >
                        <Icon
                            size={20}
                            strokeWidth={1.5}
                            style={{ color: textSec }}
                            className="group-hover:text-black transition-colors"
                        />
                        <div
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-4 transition-all"
                            style={{ backgroundColor: accent }}
                        />
                    </motion.a>
                )
            })}
        </div>
    );
};
