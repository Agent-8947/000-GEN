import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

interface SkillItem {
    name: string;
    level: number;
}

interface SkillGroup {
    id: string;
    title: string;
    items: SkillItem[];
}

interface SkillsProps {
    id: string;
    type: string;
    localOverrides: any;
}

export const Skills: React.FC<SkillsProps> = ({ id, type, localOverrides }) => {
    const { globalSettings, uiTheme } = useStore();
    const { data, layout, style } = localOverrides || {};

    // GL01: Typography
    const baseSize = parseInt(globalSettings['GL01'].params[0].value);
    const scaleRatio = parseFloat(globalSettings['GL01'].params[1].value);
    const fontWeights = {
        heading: globalSettings['GL01'].params[3].value,
        body: '400'
    };

    // GL02: Colors
    const surfaceColor = globalSettings['GL02'].params[1].value;
    const accentColor = globalSettings['GL02'].params[2].value;
    const textPrim = globalSettings['GL02'].params[3].value;
    const textSec = globalSettings['GL02'].params[4].value;

    // GL03: Spacing
    const gridUnit = parseInt(globalSettings['GL03'].params[0].value);
    const containerWidth = parseInt(globalSettings['GL03'].params[5].value);
    const flowMultiplier = parseFloat(globalSettings['GL03'].params[6].value);

    // GL07: Radius
    const globalRadius = parseInt(globalSettings['GL07'].params[0].value);
    const borderRadius = style?.useGlobalRadius !== false ? globalRadius : (parseInt(style?.borderRadius || '0'));

    // GL09: Animation
    const hoverScale = parseFloat(globalSettings['GL09'].params[3].value) || 1.05;

    // Animation Logic
    const useGlobalAnim = localOverrides.animation?.useGlobal !== false;
    const duration = useGlobalAnim ? 0.5 : parseFloat(localOverrides.animation?.duration || '0.6');
    const stagger = useGlobalAnim ? 0.05 : parseFloat(localOverrides.animation?.stagger || '0.1');
    const entranceY = useGlobalAnim ? 20 : parseInt(localOverrides.animation?.entranceY || '20');

    // Local Layout Overrides
    const columns = parseInt(layout?.columns || '3');
    const gap = parseInt(layout?.gap || '32');
    const paddingTop = parseInt(layout?.paddingTop || '80');
    const paddingBottom = parseInt(layout?.paddingBottom || '80');

    // Helper to calculate font sizes
    const getFontSize = (level: number) => Math.round(baseSize * Math.pow(scaleRatio, level));

    const isBento = type === 'B0302' || layout?.grid === 'bento';

    return (
        <div
            className="w-full relative"
            style={{
                paddingTop: `${paddingTop}px`,
                paddingBottom: `${paddingBottom}px`,
                backgroundColor: style?.bgFill || style?.background || style?.backgroundColor || 'transparent',
                color: style?.color || textPrim
            }}
        >
            <div
                className="mx-auto px-6 md:px-10"
                style={{ maxWidth: `${containerWidth}px` }}
            >
                <div
                    className={isBento ? "grid auto-rows-[150px] grid-cols-2 md:grid-cols-4 gap-4" : "grid"}
                    style={!isBento ? {
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap: `${gap}px`
                    } : { gap: `${gap}px` }}
                >
                    {data?.groups?.map((group, gIdx) => (
                        <div key={group.id} className="flex flex-col gap-6">
                            <h3
                                className="font-bold uppercase tracking-tight"
                                style={{
                                    fontSize: `${getFontSize(1)}px`,
                                    color: textPrim,
                                    fontFamily: 'var(--dna-font-family)'
                                }}
                            >
                                {group.title}
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                {group.items.map((item, iIdx) => (
                                    <motion.div
                                        key={`${group.id}-${iIdx}`}
                                        initial={{ opacity: 0, y: entranceY }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{
                                            duration: duration,
                                            delay: (gIdx * 0.2) + (iIdx * stagger),
                                            ease: "easeOut"
                                        }}
                                        className="relative overflow-hidden group cursor-default"
                                        style={{
                                            backgroundColor: surfaceColor,
                                            borderRadius: `${borderRadius}px`,
                                            padding: `${gridUnit * 1.5}px ${gridUnit * 2}px`,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {/* Progress Background */}
                                        <div
                                            className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ backgroundColor: `${accentColor}20` }}
                                        >
                                            <div
                                                className="h-full"
                                                style={{
                                                    width: `${item.level}%`,
                                                    backgroundColor: accentColor
                                                }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between gap-4 relative z-10">
                                            <span
                                                className="font-medium"
                                                style={{
                                                    fontSize: `${getFontSize(0)}px`,
                                                    color: textPrim
                                                }}
                                            >
                                                {item.name}
                                            </span>
                                            {data?.hidePercentages !== true && (
                                                <span
                                                    className="opacity-60 font-mono text-xs"
                                                    style={{ color: textSec }}
                                                >
                                                    {item.level}%
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
