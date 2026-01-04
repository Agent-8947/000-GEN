import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Skills } from './Skills';
import { Article } from './Article';
import { Portfolio } from './Portfolio';
import { Timeline } from './Timeline';
import { Stats } from './Stats';
import { Spacer } from './Spacer';
import { Badges } from './Badges';
import { Preview } from './Preview';
import { Testimonials } from './Testimonials';
import { ContactForm } from './ContactForm';
import { RadarChart } from './RadarChart';
import { SocialDock } from './SocialDock';
import { Footer } from './Footer';
import { Logos } from './Logos';
import { Accordion } from './Accordion';
import { Tabs } from './Tabs';
import { Methodology } from './Methodology';
import { TechStack } from './TechStack';
import { FeaturedProject } from './FeaturedProject';
import { ProjectsGrid } from './ProjectsGrid';
import { CodeShowcase } from './CodeShowcase';

export const ContentBlock: React.FC<{ id: string, type: string, localOverrides: any }> = ({ id, type, localOverrides }) => {
    const { setSelectedBlock, selectedBlockId, uiTheme, globalSettings } = useStore();
    const isSelected = selectedBlockId === id;

    const gPattern = globalSettings.GL02.params[7]?.value || 'None';
    const activePattern = localOverrides.style?.backgroundPattern || gPattern;

    const renderContent = () => {
        // Universal Node Dispatcher (Bound to 14-Node DNA + Variants)
        switch (type) {
            case 'B0101':
            case 'B0102':
            case 'Navbar':
                return <Navbar id={id} type={type} localOverrides={localOverrides} />;
            case 'B0201':
            case 'B0202':
            case 'B0203':
            case 'Hero':
                return <Hero id={id} type={type} localOverrides={localOverrides} />;
            case 'B0301':
            case 'B0302':
            case 'Skills':
                return <Skills id={id} type={type} localOverrides={localOverrides} />;
            case 'B0401':
            case 'B0402':
            case 'Article':
                return <Article id={id} localOverrides={localOverrides} />;
            case 'B0501':
            case 'B0503':
            case 'Portfolio':
                return <Portfolio id={id} localOverrides={localOverrides} />;
            case 'B0601':
            case 'B0602':
            case 'Timeline':
                return <Timeline id={id} localOverrides={localOverrides} />;
            case 'B0701':
            case 'Accordion':
                return <Accordion id={id} localOverrides={localOverrides} />;
            case 'B1001':
            case 'Tabs':
                return <Tabs id={id} localOverrides={localOverrides} />;
            case 'B0801':
            case 'Stats':
                return <Stats id={id} type={type} localOverrides={localOverrides} />;
            case 'B0901':
            case 'Spacer':
                return <Spacer id={id} localOverrides={localOverrides} />;
            case 'B1301':
            case 'Contact':
            case 'ContactForm':
                return <ContactForm id={id} localOverrides={localOverrides} />;
            case 'B1401':
            case 'Footer':
                return <Footer id={id} localOverrides={localOverrides} />;
            case 'B1501':
            case 'Badges':
                return <Badges id={id} localOverrides={localOverrides} />;
            case 'B1601':
            case 'B1602':
            case 'Preview':
                return <Preview id={id} localOverrides={localOverrides} />;
            case 'B1701':
            case 'Methodology':
                return <Methodology id={id} localOverrides={localOverrides} />;
            case 'B1801':
            case 'TechStack':
                return <TechStack id={id} localOverrides={localOverrides} />;
            case 'B1901':
            case 'FeaturedProject':
                return <FeaturedProject id={id} localOverrides={localOverrides} />;
            case 'B1902':
            case 'ProjectsGrid':
                return <ProjectsGrid id={id} localOverrides={localOverrides} />;
            case 'B1903':
            case 'CodeShowcase':
                return <CodeShowcase id={id} localOverrides={localOverrides} />;
            case 'B2101':
            case 'Logos':
                return <Logos id={id} localOverrides={localOverrides} />;
            case 'B2201':
            case 'B2202':
            case 'Reviews':
            case 'Testimonials':
            case 'RadarChart':
                return <Testimonials id={id} localOverrides={localOverrides} />;
            case 'B2401':
            case 'Socials':
            case 'SocialDock':
                return <SocialDock id={id} localOverrides={localOverrides} />;
            default: return (
                <div className="p-12 border-4 border-dashed border-red-500 bg-red-500/10 text-center flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-black animate-pulse">!</div>
                    <div className="space-y-1">
                        <div className="text-red-600 font-black text-xs uppercase tracking-[0.3em]">Lost Node Detected</div>
                        <div className="text-[10px] font-mono opacity-50">TYPE: {type} | ID: {id.slice(0, 8)}</div>
                    </div>
                </div>
            );
        }
    };

    const isNavbar = type === 'B0101' || type === 'B0102' || type === 'Navbar';
    const stickySetting = localOverrides.data?.stickyLogic === 'true' || globalSettings['GL11']?.params[0]?.value === 'true';
    const isSticky = isNavbar && stickySetting;

    return (
        <motion.div
            id={id}
            onDoubleClick={(e) => {
                e.stopPropagation();
                // Toggle: if already selected, deselect (close panel), otherwise select
                setSelectedBlock(isSelected ? null : id);
            }}
            initial={false}
            animate={{
                zIndex: isSticky ? 1000 : (isSelected ? 20 : 0)
            }}
            transition={{ duration: 0.2 }}
            style={{
                position: isSticky ? 'sticky' : 'relative',
                top: isSticky ? 0 : undefined,
                color: localOverrides.style?.textColor,
                backgroundColor: localOverrides.background?.lockBackground && localOverrides.background?.fixedColor
                    ? localOverrides.background.fixedColor
                    : (localOverrides.style?.bgFill || localOverrides.style?.background || localOverrides.style?.backgroundColor || 'transparent')
            }}
            className={`relative group cursor-pointer transition-all duration-300
                ${isSelected ? 'shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-[1.002]' : 'hover:ring-1 hover:ring-black/5'}
            `}
        >
            {/* Pattern Overlay */}
            {activePattern !== 'None' && (
                <div className={`dna-pattern pattern-${activePattern.toLowerCase()}`} />
            )}

            {/* Component Render */}
            {renderContent()}

            {/* Selection Highlight & Structural Frame */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="absolute -inset-[2px] pointer-events-none rounded-sm z-[100]"
                        style={{
                            border: `2px solid ${uiTheme.accents}`,
                            boxShadow: `0 0 40px ${uiTheme.accents}20`
                        }}
                    >
                        {/* Pulse Effect */}
                        <motion.div
                            className="absolute inset-0 border-2"
                            style={{ borderColor: uiTheme.accents }}
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};