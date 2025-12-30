
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Menu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    id: string;
    type: string;
    localOverrides: any;
}

export const Navbar: React.FC<NavbarProps> = ({ id, localOverrides: overrides }) => {
    const { globalSettings, viewportMode, toggleSiteTheme } = useStore();
    const isMobileMode = viewportMode === 'mobile';

    // Site Theme Logic (GL11)
    const siteTheme = globalSettings['GL11']?.params[0]?.value || 'Light';
    const isDark = siteTheme === 'Dark';

    // DNA Binding Engine
    const gl01 = globalSettings['GL01'].params; // Typography
    const gl02 = globalSettings['GL02'].params; // Colors
    const gl03 = globalSettings['GL03'].params; // Spacing
    const gl04 = globalSettings['GL04'].params; // Buttons
    const gl07 = globalSettings['GL07'].params; // Radius
    const gl08 = globalSettings['GL08'].params; // Icons
    const gl09 = globalSettings['GL09'].params; // Animation
    const gl06 = globalSettings['GL06'].params; // Effects

    const safeData = overrides.data || {
        logo: '000-GEN',
        showIcon: true,
        iconType: 'default',
        showActionButton: true,
        actionButtonText: 'Action',
        links: []
    };

    // Motion Engine
    const [motionKey, setMotionKey] = useState(0);
    const animDuration = parseFloat(gl09[0].value);
    const animStagger = parseFloat(gl09[1].value);
    const animOffset = parseFloat(gl09[2].value);
    const animScale = parseFloat(gl09[3].value);

    const isLocalAnim = overrides.animation?.useGlobal === false;
    const entranceType = isLocalAnim ? overrides.animation.entranceType : 'slide-down';

    useEffect(() => {
        setMotionKey(p => p + 1);
    }, [animDuration, animStagger, animOffset, animScale, entranceType]);

    const getEntranceStyle = (index: number) => {
        let transform = 'none';
        let opacity = 0;
        let filter = 'none';

        if (entranceType === 'slide-down') transform = `translateY(-100%)`;
        else if (entranceType === 'fade-blur') filter = `blur(10px)`;
        else if (entranceType === 'scale-reveal') transform = `scale(${animScale})`;

        return {
            opacity,
            transform,
            filter,
            transition: `all ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${index * animStagger}s`,
            animation: `nb-entrance-${id}-${motionKey} ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) ${index * animStagger}s forwards`,
            pointerEvents: 'auto' as const
        };
    };

    const getTypoStyle = (typo: any, defaults: any) => {
        const useGlobal = !typo || typo.useGlobal !== false;
        if (useGlobal) return defaults;
        return {
            fontSize: typo.fontSize + 'px',
            fontWeight: typo.fontWeight,
            letterSpacing: typo.letterSpacing + 'em',
            lineHeight: typo.lineHeight,
            textTransform: (typo.uppercase || gl01[5].value === 'true') ? 'uppercase' as const : 'none' as const,
            WebkitFontSmoothing: gl01[6].value === 'true' ? 'antialiased' : 'auto'
        };
    };

    const logoStyle = getTypoStyle(safeData.logoTypo, {
        fontSize: '20px',
        fontWeight: gl01[3]?.value || '700',
        letterSpacing: (parseFloat(gl01[4]?.value) || 0) + 'em',
        lineHeight: '1.1',
        textTransform: gl01[5]?.value === 'true' ? 'uppercase' as const : 'none' as const,
        WebkitFontSmoothing: gl01[6]?.value === 'true' ? 'antialiased' : 'auto'
    });

    const textColor = overrides.textColor || gl02[3]?.value || '#111827';
    const glassBlur = parseFloat(gl06[2]?.value || '0');
    const glassOpacity = parseFloat(gl06[3]?.value || '100') / 100;

    const isFloating = overrides.layout?.variant === 'floating';

    const navStyle = {
        height: overrides.layout?.height || '80px',
        background: glassBlur > 0
            ? `rgba(255,255,255,${glassOpacity})`
            : (overrides.style?.background || (isDark ? '#1A1A1A' : '#FFFFFF')),
        backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px)` : 'none',
        paddingLeft: (overrides.layout?.paddingX || gl03[2]?.value || '40') + 'px',
        paddingRight: (overrides.layout?.paddingX || gl03[2]?.value || '40') + 'px',
        borderBottom: isFloating ? 'none' : `1px solid ${gl02[5].value}20`,
        fontFamily: 'var(--dna-font-family)',
        maxWidth: isFloating ? '90%' : '100%',
        margin: isFloating ? '20px auto 0' : '0',
        borderRadius: isFloating ? (parseFloat(gl07[0].value) * 2.5) + 'px' : '0px',
        boxShadow: isFloating ? '0 10px 40px rgba(0,0,0,0.1)' : 'none',
        border: isFloating ? `1px solid ${gl02[5].value}15` : 'none'
    };

    return (
        <nav
            id={id}
            style={{
                ...navStyle,
                position: overrides.layout?.sticky !== false ? (isFloating ? 'fixed' : 'sticky') : 'relative',
                top: isFloating ? '20px' : 0,
                left: isFloating ? '50%' : 0,
                transform: isFloating ? 'translateX(-50%)' : 'none',
                ...getEntranceStyle(0),
                zIndex: overrides.layout?.zIndex || 1000
            }}
            className={`w-full flex items-center justify-between transition-all duration-300`}
        >
            <style>{`
                @keyframes nb-entrance-${id}-${motionKey} {
                    to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
            `}</style>

            <div className="flex items-center gap-3">
                {safeData.showIcon !== false && (
                    <div className="flex items-center justify-center overflow-hidden">
                        {safeData.iconType === 'custom' && safeData.customIconUrl ? (
                            <img src={safeData.customIconUrl} className="h-8 w-8 object-contain" alt="Logo" />
                        ) : (
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs ring-4 ring-blue-500/10">
                                G
                            </div>
                        )}
                    </div>
                )}
                <div
                    style={{
                        color: textColor,
                        ...logoStyle,
                        fontFamily: 'var(--dna-font-family)'
                    }}
                    className="opacity-90 whitespace-nowrap"
                >
                    {safeData.logo}
                </div>
            </div>

            {!isMobileMode && (
                <div className="hidden md:flex items-center gap-8">
                    {(safeData.links || []).map((link: any, index: number) => {
                        const lStyle = getTypoStyle(link.typo, {
                            fontSize: '14px',
                            fontWeight: '500',
                            letterSpacing: '0',
                            lineHeight: '1',
                            textTransform: 'none' as const
                        });

                        const isMagnetic = overrides.layout?.variant === 'magnetic';
                        const strength = parseFloat(overrides.physics?.strength) || 1;
                        const friction = parseFloat(overrides.physics?.friction) || 0.1;

                        return (
                            <motion.a
                                key={link.id}
                                href={link.type === 'anchor' ? `#${link.value}` : link.value}
                                target={link.type === 'url' ? '_blank' : undefined}
                                rel={link.type === 'url' ? 'noopener noreferrer' : undefined}
                                style={{ ...lStyle, color: textColor, ...getEntranceStyle(index + 1) }}
                                whileHover={isMagnetic ? {
                                    x: (Math.random() - 0.5) * 10 * strength,
                                    y: (Math.random() - 0.5) * 10 * strength,
                                    scale: 1.1,
                                    transition: { type: 'spring', stiffness: 400 * (1 - friction), damping: 10 * (1 + friction) }
                                } : { scale: 1.05 }}
                                className="relative opacity-70 hover:opacity-100 transition-all group py-2"
                            >
                                <span className="relative z-10">{link.label}</span>
                                <div
                                    className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
                                    style={{ backgroundColor: gl02[2].value }}
                                />
                            </motion.a>
                        );
                    })}
                </div>
            )}

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSiteTheme}
                    style={{ color: textColor }}
                    className="p-2 opacity-60 hover:opacity-100 transition-all hover:bg-black/5 rounded-full"
                >
                    {!isDark ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
                </button>

                {!isMobileMode && safeData.showActionButton !== false && (
                    <button
                        style={{
                            backgroundColor: gl02[2].value,
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: gl07[0].value + 'px',
                            fontSize: '12px',
                            fontWeight: 600,
                            fontFamily: 'var(--dna-font-family)'
                        }}
                        className="hover:scale-105 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center whitespace-nowrap"
                    >
                        {safeData.actionButtonText || 'Action'}
                    </button>
                )}

                {isMobileMode && (
                    <button style={{ color: textColor }} className="p-2 opacity-70 hover:opacity-100">
                        <Menu size={24} />
                    </button>
                )}
            </div>
        </nav>
    );
};
