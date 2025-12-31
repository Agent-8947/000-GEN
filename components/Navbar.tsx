
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Menu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    id: string;
    type: string;
    localOverrides: any;
}

export const Navbar: React.FC<NavbarProps> = ({ id, type, localOverrides: overrides }) => {
    const { globalSettings, viewportMode, toggleSiteTheme, updateBlockLocal } = useStore();
    const isMobileMode = viewportMode === 'mobile';

    // Site Theme Logic (GL10 - P7)
    const siteTheme = globalSettings['GL10']?.params[6]?.value || 'Dark';
    const isDark = siteTheme === 'Dark';

    // DNA Binding Engine
    const gl01 = globalSettings['GL01'].params; // Typography
    const gl02 = globalSettings['GL02'].params; // Colors
    const gl03 = globalSettings['GL03'].params; // Spacing
    const gl04 = globalSettings['GL04'].params; // Buttons
    const gl07 = globalSettings['GL07'].params; // Radius
    const gl09 = globalSettings['GL09'].params; // Animation
    const gl06 = globalSettings['GL06'].params; // Effects

    // Robust check for B0102 type
    const isB0102 = type === 'B0102';

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

    const glassBlur = parseFloat(gl06[2]?.value || '0');
    const glassOpacity = parseFloat(gl06[3]?.value || '100') / 100;

    // Forced Normalization & Refurbishment Logic (HARD LIMITS)
    const blockStyle = overrides.style || {};
    const isSticky = globalSettings['GL11']?.params[0]?.value === 'true';
    const showGlass = blockStyle.glassEffect !== false;

    // Normalization: clamp(60px, height, 80px) for B0102
    const rawHeight = blockStyle.height || (isB0102 ? 64 : 80);
    const blockHeight = isB0102 ? Math.min(Math.max(rawHeight, 60), 80) : rawHeight;

    // Normalization: borderRadius || 50
    const blockRadius = blockStyle.borderRadius !== undefined ? blockStyle.borderRadius : (isB0102 ? 50 : 0);

    const blockBg = blockStyle.backgroundColor || (isDark ? 'rgba(30,30,30,1)' : 'rgba(255,255,255,1)');
    const textColor = blockStyle.textColor || (isDark ? '#FFFFFF' : '#111827');

    const btnStyle = blockStyle.button || { useGlobalDNA: true, scale: 1.0, paddingX: 20, paddingY: 10 };

    // Logic: Force scale(1.0) and 12x24 if NOT using Global DNA
    const btnScale = btnStyle.useGlobalDNA ? (parseFloat(gl04[0].value) || 1.0) : (btnStyle.scale || 1.0);
    const btnPadY = btnStyle.useGlobalDNA ? (parseInt(gl04[1].value) || 12) : (btnStyle.paddingY || 12);
    const btnPadX = btnStyle.useGlobalDNA ? (parseInt(gl04[2].value) || 24) : (btnStyle.paddingX || 24);
    const btnFontSize = btnStyle.useGlobalDNA ? (parseInt(gl04[3].value) || 13) : (btnStyle.fontSize || 13);
    const btnFontWeight = btnStyle.useGlobalDNA ? 700 : (btnStyle.fontWeight === 'bold' ? 700 : 500);

    const posX = blockStyle.positionX || 0;
    const posY = blockStyle.positionY || 0;
    const isDraggable = blockStyle.isDraggable !== false;

    const navStyleB0102: React.CSSProperties = isSticky ? {
        position: 'fixed',
        top: '24px',
        left: '50%',
        width: '90%',
        maxWidth: '1200px',
        zIndex: 9999,
        height: blockHeight + 'px',
        background: showGlass ? (blockBg.includes('rgba') ? blockBg.replace(/[\d.]+\)$/, '0.6)') : `${blockBg}88`) : blockBg,
        backdropFilter: showGlass ? 'blur(16px)' : 'none',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: blockRadius + 'px',
        boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        padding: '0 24px',
        fontFamily: 'var(--dna-font-family)',
        color: textColor,
    } : {
        position: 'relative',
        margin: '24px auto',
        width: '90%',
        maxWidth: '1200px',
        zIndex: 10,
        height: blockHeight + 'px',
        background: showGlass ? (blockBg.includes('rgba') ? blockBg.replace(/[\d.]+\)$/, '0.6)') : `${blockBg}88`) : blockBg,
        backdropFilter: showGlass ? 'blur(16px)' : 'none',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: blockRadius + 'px',
        boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        padding: '0 24px',
        fontFamily: 'var(--dna-font-family)',
        color: textColor,
    };

    const navStyleB0101: React.CSSProperties = isSticky ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: blockHeight + 'px',
        background: (showGlass || glassBlur > 0) ? `rgba(${isDark ? '30,30,30' : '255,255,255'},${glassOpacity})` : blockBg,
        backdropFilter: (showGlass || glassBlur > 0) ? `blur(${glassBlur || 16}px)` : 'none',
        paddingLeft: (overrides.layout?.paddingX || 40) + 'px',
        paddingRight: (overrides.layout?.paddingX || 40) + 'px',
        borderBottom: `1px solid ${gl02[5].value}20`,
        fontFamily: 'var(--dna-font-family)',
        borderRadius: blockRadius + 'px',
        color: textColor
    } : {
        position: 'relative',
        zIndex: 10,
        height: blockHeight + 'px',
        background: (showGlass || glassBlur > 0) ? `rgba(${isDark ? '30,30,30' : '255,255,255'},${glassOpacity})` : blockBg,
        backdropFilter: (showGlass || glassBlur > 0) ? `blur(${glassBlur || 16}px)` : 'none',
        paddingLeft: (overrides.layout?.paddingX || 40) + 'px',
        paddingRight: (overrides.layout?.paddingX || 40) + 'px',
        borderBottom: `1px solid ${gl02[5].value}20`,
        fontFamily: 'var(--dna-font-family)',
        width: '100%',
        borderRadius: blockRadius + 'px',
        color: textColor
    };

    if (isB0102) {
        // ELITE NAVBAR (B0102) - Floating Center Design
        return (
            <motion.nav
                id={id}
                drag={isDraggable}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                    updateBlockLocal(id, 'style.positionX', posX + info.offset.x);
                    updateBlockLocal(id, 'style.positionY', posY + info.offset.y);
                }}
                whileDrag={{ scale: 1.02, opacity: 0.9, boxShadow: isDark ? '0 30px 60px -10px rgba(0,0,0,0.7)' : '0 30px 60px -10px rgba(0,0,0,0.25)', cursor: 'grabbing' }}
                initial={{ y: -50, opacity: 0, x: isSticky ? '-50%' : '0' }}
                animate={{
                    y: posY,
                    opacity: 1,
                    x: isSticky ? `calc(-50% + ${posX}px)` : posX
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    ...navStyleB0102,
                    animation: 'none',
                    transition: 'box-shadow 0.3s ease, background 0.3s ease',
                    cursor: isDraggable ? 'grab' : 'default'
                }}
                className="flex items-center"
            >
                <style>{`
                    .elite-logo-text {
                        background: linear-gradient(135deg, ${gl02[2].value}, ${gl02[2].value}88);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                `}</style>

                {/* Left: Logo */}
                <div className="flex-1 flex items-center gap-3">
                    {safeData.showIcon !== false && (
                        <div
                            style={{ backgroundColor: gl02[2].value }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20"
                        >
                            G
                        </div>
                    )}
                    <div
                        style={{ ...logoStyle, fontFamily: 'var(--dna-font-family)' }}
                        className="opacity-90 whitespace-nowrap elite-logo-text font-black"
                    >
                        {safeData.logo}
                    </div>
                </div>

                {/* Center: Links */}
                {!isMobileMode && (
                    <div className="flex-none flex items-center gap-8 justify-center">
                        {(safeData.links || []).map((link: any) => {
                            const lStyle = getTypoStyle(link.typo, { fontSize: '14px', fontWeight: '600', letterSpacing: '0.02em', lineHeight: '1' });
                            return (
                                <motion.a
                                    key={link.id}
                                    href={link.type === 'anchor' ? `#${link.value}` : link.value}
                                    style={{ ...lStyle, color: textColor }}
                                    whileHover={{ y: -2 }}
                                    className="relative opacity-70 hover:opacity-100 transition-all group py-2"
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    <motion.div
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full"
                                        initial={{ width: 0 }}
                                        whileHover={{ width: '100%' }}
                                        style={{ backgroundColor: gl02[2].value }}
                                    />
                                </motion.a>
                            );
                        })}
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex-1 flex items-center gap-4 justify-end">
                    <button onClick={toggleSiteTheme} style={{ color: textColor }} className="p-2 opacity-60 hover:opacity-100 transition-all rounded-full">
                        {!isDark ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
                    </button>
                    {!isMobileMode && safeData.showActionButton !== false && (
                        <button
                            style={{
                                backgroundColor: isDark ? '#FFFFFF' : gl02[2].value,
                                color: isDark ? '#000000' : '#FFFFFF',
                                padding: `${btnPadY}px ${btnPadX}px`,
                                borderRadius: btnStyle.useGlobalDNA ? (gl07[3].value + 'px') : '999px',
                                fontSize: `${btnFontSize}px`,
                                fontWeight: btnFontWeight,
                                fontFamily: 'var(--dna-font-family)',
                                boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)',
                                transform: `scale(${btnScale})`
                            }}
                            className="hover:scale-110 active:scale-95 transition-all flex items-center justify-center whitespace-nowrap"
                        >
                            {safeData.ctaText || 'Action'}
                        </button>
                    )}
                </div>
            </motion.nav>
        );
    }

    // STANDARD NAVBAR (B0101) - Classic Full Width Design
    return (
        <motion.nav
            id={id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                ...navStyleB0101,
                animation: 'none',
                transition: 'all 0.3s ease'
            }}
            className="flex items-center justify-between"
        >
            {/* Left: Logo + Branding */}
            <div className="flex items-center gap-4">
                {safeData.showIcon !== false && (
                    <div
                        style={{ backgroundColor: gl02[2].value }}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
                    >
                        {safeData.logo?.[0] || 'G'}
                    </div>
                )}
                <div
                    style={{ ...logoStyle, color: textColor, fontFamily: 'var(--dna-font-family)' }}
                    className="opacity-100 whitespace-nowrap"
                >
                    {safeData.logo}
                </div>
            </div>

            {/* Right: Menu + Actions */}
            <div className="flex items-center gap-8">
                {!isMobileMode && (
                    <div className="hidden md:flex items-center gap-6">
                        {(safeData.links || []).map((link: any) => {
                            const lStyle = getTypoStyle(link.typo, { fontSize: '14px', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2' });
                            return (
                                <a
                                    key={link.id}
                                    href={link.type === 'anchor' ? `#${link.value}` : link.value}
                                    style={{ ...lStyle, color: textColor }}
                                    className="opacity-70 hover:opacity-100 transition-all py-2 border-b-2 border-transparent hover:border-current"
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button onClick={toggleSiteTheme} style={{ color: textColor }} className="p-2 opacity-70 hover:opacity-100 transition-all">
                        {!isDark ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
                    </button>

                    {!isMobileMode && safeData.showActionButton !== false && (
                        <button
                            style={{
                                backgroundColor: gl02[2].value,
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: gl07[0].value + 'px',
                                fontSize: '14px',
                                fontWeight: 600,
                                fontFamily: 'var(--dna-font-family)'
                            }}
                            className="hover:brightness-110 active:scale-95 transition-all shadow-sm"
                        >
                            {safeData.actionButtonText || 'Start'}
                        </button>
                    )}

                    {isMobileMode && (
                        <button style={{ color: textColor }} className="p-2">
                            <Menu size={24} />
                        </button>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};
