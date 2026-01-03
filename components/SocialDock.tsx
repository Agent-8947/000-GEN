
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, Globe, Instagram, Youtube, Facebook, Send, MessageCircle, Hash, Twitch, Pin, MessageSquare } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
    telegram: Send,
    whatsapp: MessageCircle,
    discord: Hash,
    twitch: Twitch,
    pinterest: Pin,
    reddit: MessageSquare,
    tiktok: Globe, // TikTok doesn't have a lucide icon, using Globe as fallback
    globe: Globe
};

export const SocialDock: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings, uiTheme } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl09 = globalSettings['GL09'].params;
    const gl07 = globalSettings['GL07'].params;

    const accent = gl02[2].value;
    const textColor = localOverrides.style?.color || gl02[3].value;
    const bgColor = localOverrides.style?.bgFill || gl02[0].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);

    const data = localOverrides.data || { platforms: [] };
    const layout = localOverrides.layout || { position: 'center', paddingY: '20' };

    const isDock = layout.variant === 'dock';

    const containerStyle: React.CSSProperties = isDock ? {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: `${bgColor}CC`, // Glass effect
        backdropFilter: 'blur(12px)',
        padding: '8px 16px',
        borderRadius: '999px',
        border: `1px solid ${gl02[5].value}20`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    } : {
        paddingTop: `${layout.paddingY}px`,
        paddingBottom: `${layout.paddingY}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: layout.position === 'center' ? 'center' : 'flex-start',
        gap: '24px',
        width: '100%',
        fontFamily: 'var(--dna-font-family)'
    };

    return (
        <div id={id} style={containerStyle} className={isDock ? "" : "px-12"}>
            {(data.platforms || []).map((platform: any, i: number) => {
                const Icon = ICON_MAP[platform.type] || Globe;
                return (
                    <motion.a
                        key={i}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: animDuration, delay: i * animStagger }}
                        whileHover={{ y: -5, scale: 1.1 }}
                        className={`group relative ${isDock ? 'p-2' : 'p-3'} hover:bg-black/[0.03] transition-all`}
                        style={{ borderRadius: `${gl07[0].value}px` }}
                    >
                        <Icon
                            size={isDock ? 18 : 20}
                            strokeWidth={1.5}
                            style={{ color: textColor }}
                            className="transition-colors group-hover:brightness-75"
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
