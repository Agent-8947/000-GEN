import React from 'react';
import { motion } from 'framer-motion';
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

export const ContentBlock: React.FC<{ id: string, type: string, localOverrides: any }> = ({ id, type, localOverrides }) => {
    const { setSelectedBlock, selectedBlockId, uiTheme } = useStore();
    const isSelected = selectedBlockId === id;

    const renderContent = () => {
        // Universal Node Dispatcher (Bound to 14-Node DNA + Variants)
        switch (type) {
            case 'B0101':
            case 'B0102':
            case 'B0103':
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

    return (
        <motion.div
            onClick={(e) => {
                e.stopPropagation();
                setSelectedBlock(id);
            }}
            initial={false}
            animate={{
                zIndex: isSelected ? 20 : 0
            }}
            transition={{ duration: 0.2 }}
            className={`relative group cursor-pointer transition-all duration-200
                ${isSelected ? 'shadow-[0_0_30px_rgba(0,0,0,0.05)] ring-1 ring-black/10 scale-100' : 'hover:ring-1 hover:ring-black/5 shadow-sm'}
            `}
        >
            {/* Component Render */}
            {renderContent()}

            {/* Selection Border & Static Glow Overlay */}
            {isSelected && (
                <>
                    <div className="absolute inset-0 pointer-events-none border-[1.5px] border-black rounded-lg mix-blend-difference opacity-10" />
                    <div className="absolute -inset-1 pointer-events-none rounded-xl blur-xl opacity-[0.03]" style={{ backgroundColor: uiTheme.accents }} />
                </>
            )}

        </motion.div>
    );
};