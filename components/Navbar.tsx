
import React, { useState } from 'react';
import { useStore } from '../store';
import { LANGUAGE_NAMES } from '../utils/translations';
import { Sun, Moon, Globe, ChevronDown } from 'lucide-react';

/* Update Navbar component to accept 'type' prop and use it for glass effect logic instead of 'id' to fix type mismatch in ContentBlock.tsx */
export const Navbar: React.FC<{ id: string, type: string, localOverrides: any }> = ({ id, type, localOverrides }) => {
    const { globalSettings, toggleSiteTheme, currentLanguage, setCurrentLanguage } = useStore();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    // Get available languages from GL12
    const availableLanguages = (globalSettings['GL12']?.params[1]?.value || 'en,uk,ru').split(',');

    const data = localOverrides.data || {};
    const layout = localOverrides.layout || {};
    const style = localOverrides.style || {};

    // Inheritance Logic: Local (F-C06) ?? Global (GL11-P1)
    const isSticky = data.stickyLogic === 'true' || globalSettings['GL11']?.params[0]?.value === 'true';

    // Style Mappings (fixing mismatch with PropertyInspector)
    const height = layout.height ? parseInt(layout.height) : (style.height || layout['F-L04'] || 80);

    // Theme Awareness for Glass Defaults
    const themeMode = globalSettings['GL10']?.params[6]?.value || 'Dark';
    const isDark = themeMode === 'Dark';

    // Determine Glass State - Use 'type' for checking if it's the glass variant B0102 instead of the unique instance 'id'
    const isGlass = style.glassEffect === true || style['F-S06'] === 'true' || (style.glassEffect !== false && type === 'B0102');

    // Determine Background
    let bgColor = style.backgroundColor || style['F-S02'];
    if (!bgColor) {
        // Fallback Logic:
        // If Glass is ON, use semi-transparent based on theme.
        // If Glass is OFF, use opaque global background.
        if (isGlass) {
            bgColor = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
        } else {
            bgColor = 'var(--dna-bg)';
        }
    }

    const txtColor = style.textColor || 'var(--dna-text-prim)';

    const navStyle: React.CSSProperties = {
        height: `${height}px`,
        backgroundColor: bgColor,
        backdropFilter: isGlass ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${globalSettings['GL02']?.params[5]?.value || '#000000'}20`,
        width: layout['F-L06'] || '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${layout.paddingX || 40}px`,
        // Position handled by Wrapper (ContentBlock)
    };

    return (
        <nav style={{ ...navStyle, color: txtColor }}>
            <div className="font-black uppercase tracking-[0.3em] text-sm">
                {data.header || '000-GEN'}
            </div>
            <div className="flex gap-8 items-center">
                {(data.links || []).map((link: any, i: number) => (
                    <a
                        key={i}
                        href={link.url}
                        onClick={(e) => {
                            if (link.url?.startsWith('#')) {
                                e.preventDefault();
                                const element = document.getElementById(link.url.substring(1));
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                        {link.label}
                    </a>
                ))}

                {/* Language Switcher */}
                <div className="relative">
                    <button
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: txtColor }}
                    >
                        <Globe size={14} />
                        <span>{currentLanguage.toUpperCase()}</span>
                        <ChevronDown size={10} />
                    </button>

                    {langDropdownOpen && (
                        <div
                            className="absolute top-full right-0 mt-2 py-2 rounded-lg shadow-2xl border z-50 min-w-[160px]"
                            style={{
                                backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(12px)',
                                borderColor: globalSettings['GL02']?.params[5]?.value || '#00000020'
                            }}
                        >
                            {availableLanguages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setCurrentLanguage(lang);
                                        setLangDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-xs flex items-center gap-2 hover:bg-white/10 transition-colors"
                                    style={{
                                        color: txtColor,
                                        backgroundColor: currentLanguage === lang ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                                    }}
                                >
                                    <span className="text-base">{LANGUAGE_NAMES[lang]?.flag || '🌐'}</span>
                                    <span className="font-medium">{LANGUAGE_NAMES[lang]?.name || lang}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleSiteTheme}
                    className="opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: txtColor }}
                >
                    {isDark ? <Sun size={14} /> : <Moon size={14} />}
                </button>
            </div>
        </nav>
    );
};
