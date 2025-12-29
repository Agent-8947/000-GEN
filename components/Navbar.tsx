
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Menu, Sun, Moon } from 'lucide-react';

interface NavbarProps {
    data?: any;
    layout?: any;
    style?: any;
    effects?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ data: localData, layout: localLayout }) => {
    const { globalSettings, contentBlocks, viewportMode, updateParam } = useStore();
    const isMobileMode = viewportMode === 'mobile';

    // Site Theme Logic (GL11)
    const siteTheme = globalSettings['GL11']?.params[0]?.value || 'Light';
    const isDark = siteTheme === 'Dark';

    // In our system, the block object contains all overrides
    const block = contentBlocks.find(b => b.type === 'B0101' || b.type === 'Navbar');
    const overrides = block?.localOverrides || {};

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
    const gl09_P1 = gl09[0]?.value || '0.6';
    const gl09_P2 = gl09[1]?.value || '0.1';
    const gl09_P3 = gl09[2]?.value || '20';
    const gl09_P4 = gl09[3]?.value || '0.95';
    const gl09_P5 = gl09[4]?.value || '10';
    const gl09_P7 = gl09[6]?.value || '0.3';

    const isLocalAnim = overrides.animation?.useGlobal === false;
    const entranceType = isLocalAnim ? overrides.animation.entranceType : 'slide-down';

    useEffect(() => {
        setMotionKey(p => p + 1);
    }, [gl09_P1, gl09_P2, gl09_P3, gl09_P4, gl09_P5, gl09_P7, entranceType]);

    const getEntranceStyle = (index: number) => {
        let transform = 'none';
        let opacity = 0;
        let filter = 'none';

        if (entranceType === 'slide-down') transform = `translateY(-100%)`;
        else if (entranceType === 'fade-blur') filter = `blur(${gl09_P5}px)`;
        else if (entranceType === 'scale-reveal') transform = `scale(${gl09_P4})`;

        return {
            opacity,
            transform,
            filter,
            transition: `all ${gl09_P1}s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${index * parseFloat(gl09_P2)}s`,
            animation: `nb-entrance-${block?.id}-${motionKey} ${gl09_P1}s cubic-bezier(0.16, 1, 0.3, 1) ${index * parseFloat(gl09_P2)}s forwards`,
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

    const px = overrides.layout?.paddingX || gl03[2]?.value || '40';
    const py = overrides.layout?.paddingY || '0';

    const glassBlur = parseFloat(gl06[2]?.value || '0');
    const glassOpacity = parseFloat(gl06[3]?.value || '100') / 100;
    const shadowIntensity = parseFloat(gl06[0]?.value || '0');
    const shadowBlur = parseFloat(gl06[1]?.value || '0');

    const flow = parseFloat(gl03[6]?.value || '1.0');
    const baseTypo = parseFloat(gl01[0]?.value || '16');
    const computedSize = isMobileMode ? (baseTypo * flow) : baseTypo;

    const style = {
        height: overrides.layout?.height || '80px',
        background: glassBlur > 0
            ? `rgba(255,255,255,${glassOpacity})`
            : (overrides.style?.background || gl02[1]?.value || '#FFFFFF'),
        backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px)` : 'none',
        boxShadow: shadowIntensity > 0 ? `0px ${shadowIntensity / 2}px ${shadowBlur}px rgba(0,0,0,0.05)` : 'none',
        paddingLeft: (overrides.layout?.paddingX || gl03[2]?.value || '40') + 'px',
        paddingRight: (overrides.layout?.paddingX || gl03[2]?.value || '40') + 'px',
        paddingTop: (overrides.layout?.paddingY || '0') + 'px',
        paddingBottom: (overrides.layout?.paddingY || '0') + 'px',
        textColor,
        fontFamily: 'Space Grotesk',
        fontSize: overrides.style?.fontSize || (computedSize + 'px'),
        fontWeight: overrides.style?.fontWeight || gl01[3]?.value,
        tracking: (gl01[4]?.value || '0') + 'em',
        borderRadius: overrides.style?.borderRadius || (gl07[0]?.value + 'px')
    };

    const effects = {
        blur: overrides.effects?.blur || '20px',
        shadowAlpha: overrides.effects?.shadowAlpha || '0.05',
        animation: overrides.effects?.animation || 'fade-in'
    };

    const sticky = overrides.layout?.sticky !== false;

    return (
        <nav
            id={block?.id}
            style={{
                ...style,
                ...effects,
                position: sticky ? 'sticky' : 'relative',
                top: 0,
                ...getEntranceStyle(0),
                zIndex: overrides.layout?.zIndex || 1000
            }}
            className={`w-full flex items-center justify-between border-b border-black/[0.05] transition-all duration-300`}
        >
            <style>{`
                @keyframes nb-entrance-${block?.id}-${motionKey} {
                    to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
            `}</style>
            {/* Logo Section */}
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
                        fontFamily: style.fontFamily,
                        color: textColor,
                        ...logoStyle
                    }}
                    className="opacity-90 whitespace-nowrap"
                >
                    {safeData.logo}
                </div>
            </div>

            {/* Navigation Links */}
            {!isMobileMode && (
                <div className="hidden md:flex items-center gap-8">
                    {(safeData.links || []).map((link: any, index: number) => {
                        const lStyle = getTypoStyle(link.typo, {
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            letterSpacing: style.tracking,
                            lineHeight: '1',
                            textTransform: 'none' as const
                        });

                        return (
                            <a
                                key={link.id}
                                href={link.type === 'anchor' ? `#${link.value}` : link.value}
                                target={link.type === 'url' ? '_blank' : undefined}
                                rel={link.type === 'url' ? 'noopener noreferrer' : undefined}
                                style={{ ...lStyle, color: textColor, transitionDuration: `${gl09_P7}s`, ...getEntranceStyle(index + 1) }}
                                className="relative opacity-70 hover:opacity-100 transition-all group py-2"
                            >
                                <span className="relative z-10">{link.label}</span>
                                <div
                                    className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
                                    style={{ backgroundColor: textColor }}
                                />
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Action Group */}
            <div className="flex items-center gap-4">
                {isMobileMode ? (
                    <button
                        style={{ color: textColor }}
                        className="p-2 opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <Menu size={parseFloat(gl08[0].value) || 24} />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => useStore.getState().toggleSiteTheme()}
                            style={{ color: textColor }}
                            className="p-2 opacity-60 hover:opacity-100 transition-all hover:bg-black/5 rounded-full"
                            title={!isDark ? 'Switch to Dark' : 'Switch to Light'}
                        >
                            {!isDark ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
                        </button>
                        {safeData.showActionButton !== false && (
                            <button
                                style={(() => {
                                    const useGlobal = overrides.btnUseGlobal !== false;
                                    const b = useGlobal ? {
                                        size: gl04[0].value,
                                        padX: gl04[1].value,
                                        padY: gl04[2].value,
                                        font: gl04[3].value,
                                        stroke: gl04[4].value,
                                        radius: gl04[5].value,
                                        shadow: gl04[6].value
                                    } : (overrides.btnStyles || {
                                        size: "1.0", padX: "24", padY: "12", font: "12", stroke: "1", radius: "4", shadow: "false"
                                    });

                                    return {
                                        padding: `${parseFloat(b.padY) * parseFloat(b.size)}px ${parseFloat(b.padX) * parseFloat(b.size)}px`,
                                        backgroundColor: gl02[2]?.value || '#3B82F6',
                                        color: 'white',
                                        borderRadius: b.radius + 'px',
                                        fontSize: (parseFloat(b.font) * parseFloat(b.size)) + 'px',
                                        fontWeight: 600,
                                        minHeight: isMobileMode ? '48px' : '0',
                                        border: `${b.stroke}px solid rgba(255,255,255,0.1)`,
                                        boxShadow: b.shadow === 'true' ? '0 4px 14px 0 rgba(0, 0, 0, 0.15)' : 'none',
                                        transitionDuration: `${gl09_P7}s`
                                    };
                                })()}
                                className="hover:scale-105 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center whitespace-nowrap"
                            >
                                {safeData.actionButtonText || 'Action'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};
