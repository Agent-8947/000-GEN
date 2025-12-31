
import React from 'react';
import { useStore } from '../store';

export const Logos: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides: overrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;

    const style = {
        paddingTop: (overrides.layout?.paddingY || '60') + 'px',
        paddingBottom: (overrides.layout?.paddingY || '60') + 'px',
        backgroundColor: overrides.style?.bgFill || overrides.style?.background || 'transparent',
    };

    const logos = overrides.data?.items || [
        { id: '1', name: 'Alpha' },
        { id: '2', name: 'Beta' },
        { id: '3', name: 'Gamma' },
        { id: '4', name: 'Delta' },
        { id: '5', name: 'Epsilon' }
    ];

    return (
        <section style={style} className="w-full flex flex-wrap justify-center items-center gap-12 px-10">
            {logos.map((logo: any) => (
                <div
                    key={logo.id}
                    className="text-[14px] font-black uppercase tracking-[0.3em] opacity-20 hover:opacity-100 transition-all cursor-default grayscale hover:grayscale-0"
                    style={{ color: gl02[3].value, fontFamily: 'var(--dna-font-family)' }}
                >
                    {logo.name}
                </div>
            ))}
        </section>
    );
};
