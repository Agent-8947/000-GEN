
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const Article: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides: overrides }) => {
    const { globalSettings } = useStore();

    // DNA Binding
    const gl01 = globalSettings['GL01'].params;
    const gl02 = globalSettings['GL02'].params;
    const gl09 = globalSettings['GL09'].params;

    const data = overrides.data || {
        title: "Article Title",
        subtitle: "Article Subtitle",
        body: "Article content goes here..."
    };

    const layout = overrides.layout || {
        maxWidth: '800',
        textAlign: 'left',
        paddingY: '80'
    };

    const style = overrides.style || {
        lineHeight: '1.6',
        useGlobalFont: true,
        fontSize: '16'
    };

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const containerStyle: React.CSSProperties = {
        paddingTop: `${layout.paddingY}px`,
        paddingBottom: `${layout.paddingY}px`,
        backgroundColor: overrides.style?.bgFill || 'transparent',
        color: overrides.style?.titleColor || gl02[3].value, // Text Prim
        textAlign: layout.textAlign as any || 'left',
        fontFamily: style.useGlobalFont ? 'var(--dna-font-family)' : (style.fontFamily || 'var(--dna-font-family)'),
        lineHeight: style.lineHeight || gl01[2].value,
        fontSize: (style.fontSize || gl01[0].value) + 'px'
    };

    return (
        <section
            id={id}
            style={containerStyle}
            className="w-full flex flex-col items-center px-6 transition-all duration-500"
        >
            <motion.div
                initial={{ opacity: 0, y: animEntranceY }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: animDuration }}
                className="w-full"
                style={{ maxWidth: `${layout.maxWidth}px` }}
            >
                <h2
                    className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight uppercase"
                    style={{ fontFamily: 'var(--dna-font-family)' }}
                >
                    {data.title}
                </h2>
                {data.subtitle && (
                    <p className="text-xl md:text-2xl opacity-60 mb-12 font-medium">
                        {data.subtitle}
                    </p>
                )}
                <div className="w-full h-px bg-black/10 mb-12" style={{ backgroundColor: gl02[5].value }} />
                <div
                    className="whitespace-pre-line text-lg md:text-xl opacity-80"
                    style={{ fontWeight: 400 }}
                >
                    {data.body}
                </div>
            </motion.div>
        </section>
    );
};
