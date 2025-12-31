
import React from 'react';
import { useStore } from '../store';

export const Footer: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides: overrides }) => {
    const { globalSettings, uiTheme } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl07 = globalSettings['GL07'].params;

    const style = {
        paddingTop: (overrides.layout?.paddingTop || '80') + 'px',
        paddingBottom: (overrides.layout?.paddingBottom || '80') + 'px',
        backgroundColor: overrides.style?.bgFill || overrides.style?.background || (uiTheme.lightPanel === 'transparent' ? '#F9FAFB' : 'transparent'),
        color: overrides.style?.textColor || gl02[3].value,
        fontFamily: 'var(--dna-font-family)',
        borderTop: `1px solid ${gl02[5].value}20`
    };

    return (
        <footer style={style} className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-8 opacity-60">
                <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
                <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
                <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
            </div>
            <div className="text-[11px] uppercase tracking-widest opacity-30">
                © {new Date().getFullYear()} {overrides.data?.companyName || '000-GEN'} ARCHITECTURE. ALL RIGHTS RESERVED.
            </div>
        </footer>
    );
};
