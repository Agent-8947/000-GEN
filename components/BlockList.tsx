
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import {
  Plus, Layout, ArrowUp, ArrowDown, X, Trash2, Layers, Grid, Type,
  MessageSquare, Mail, Image, BarChart3, Clock, SeparatorHorizontal,
  Tag, Monitor, Share2, Activity, ChevronDown, ChevronRight, Zap, Radio as RadioIcon,
  Box, Star, Code
} from 'lucide-react';

export const BlockList: React.FC = () => {
  const {
    addBlock,
    contentBlocks,
    removeBlock,
    moveBlock,
    toggleBlockVisibility,
    pages,
    currentPage,
    selectedBlockId,
    setSelectedBlock,
    isBlockListOpen,
    isManagerOpen,
    uiTheme
  } = useStore();

  const DNA_GROUPS: Record<string, string> = {
    "01": "Navigation",
    "02": "Hero & Headers",
    "03": "Data & Stats",
    "04": "Content & Text",
    "05": "Media & Portfolio",
    "06": "Interactive Elements",
    "07": "Forms",
    "08": "Social",
    "09": "Structure",
    "10": "System UI",
    "17": "Process",
    "18": "Technology",
    "19": "Projects",
    "99": "Utility"
  };

  const ALL_BLOCKS = [
    { id: 'B0101', type: 'B0101', label: 'Navigation Classic', sub: 'Standard Navbar', icon: <Layout size={14} /> },

    { id: 'B0201', type: 'B0201', label: 'Standard', sub: 'Classic Hero', icon: <Layers size={14} /> },
    { id: 'B0202', type: 'B0202', label: 'Motion Mask', sub: 'Video Header', icon: <RadioIcon size={14} />, badge: 'VIDEO' },
    { id: 'B0203', type: 'B0203', label: '3D Orbit', sub: 'Interactive Node', icon: <Zap size={14} />, badge: '3D' },
    { id: 'B0501', type: 'B0501', label: 'Portfolio', sub: 'Project Grid', icon: <Image size={14} /> },
    { id: 'B0503', type: 'B0503', label: 'Tilt Grid', sub: 'Physics Hover', icon: <Layers size={14} />, badge: 'INTERACTIVE' },
    { id: 'B1601', type: 'B1601', label: 'Preview', sub: 'Single Mac', icon: <Monitor size={14} /> },
    { id: 'B1602', type: 'B1602', label: 'Eco-System', sub: 'Multi-Device', icon: <Monitor size={14} />, badge: 'TREND' },
    { id: 'B0301', type: 'B0301', label: 'Standard', sub: 'Core Skills', icon: <Grid size={14} /> },
    { id: 'B0302', type: 'B0302', label: 'Bento Grid', sub: 'Modern Utility', icon: <Grid size={14} />, badge: 'BENTO' },
    { id: 'B0801', type: 'B0801', label: 'Metrics', sub: 'Data Stats', icon: <BarChart3 size={14} /> },
    { id: 'B0701', type: 'B0701', label: 'System FAQ', sub: 'Accordion', icon: <Plus size={14} />, badge: 'INTERACTIVE' },
    { id: 'B1001', type: 'B1001', label: 'Node Tabs', sub: 'Switch Panels', icon: <Layers size={14} />, badge: 'INTERACTIVE' },
    { id: 'B0401', type: 'B0401', label: 'Article', sub: 'Narrative Box', icon: <Type size={14} /> },
    { id: 'B0402', type: 'B0402', label: 'Smart Index', sub: 'Sidebar Sync', icon: <Type size={14} />, badge: 'TREND' },
    { id: 'B0601', type: 'B0601', label: 'Roadmap', sub: 'Vertical Line', icon: <Clock size={14} /> },
    { id: 'B0602', type: 'B0602', label: 'Horizon', sub: 'Scroll Path', icon: <Activity size={14} />, badge: 'TREND' },
    { id: 'B0901', type: 'B0901', label: 'Spacer', sub: 'Node Gap', icon: <SeparatorHorizontal size={14} /> },
    { id: 'B1301', type: 'B1301', label: 'Contact', sub: 'Form Input', icon: <Mail size={14} /> },
    { id: 'B1401', type: 'B1401', label: 'Footer', sub: 'Base Rail', icon: <Layout size={14} /> },
    { id: 'B1501', type: 'B1501', label: 'Badges', sub: 'DNA Tags', icon: <Tag size={14} /> },
    { id: 'B1701', type: 'B1701', label: 'Methodology', sub: 'Process Steps', icon: <Activity size={14} />, badge: 'TREND' },
    { id: 'B1801', type: 'B1801', label: 'Tech Stack', sub: 'Interactive Grid', icon: <Layers size={14} />, badge: 'INTERACTIVE' },
    { id: 'B1901', type: 'B1901', label: 'Featured Project', sub: 'Hero Showcase', icon: <Star size={14} />, badge: 'PREMIUM' },
    { id: 'B1902', type: 'B1902', label: 'Projects Grid', sub: 'Portfolio Matrix', icon: <Grid size={14} />, badge: 'TREND' },
    { id: 'B1903', type: 'B1903', label: 'Code Showcase', sub: 'Syntax Display', icon: <Code size={14} />, badge: 'DEV' },
    { id: 'B2101', type: 'B2101', label: 'Logos', sub: 'Neural Partners', icon: <Zap size={14} /> },
    { id: 'B2201', type: 'B2201', label: 'Feedback', sub: 'Classic Review', icon: <MessageSquare size={14} /> },
    { id: 'B2202', type: 'B2202', label: 'Marquee', sub: 'Infinite Stream', icon: <MessageSquare size={14} />, badge: 'TREND' },
    { id: 'B2401', type: 'B2401', label: 'Socials', sub: 'Neural Dock', icon: <Share2 size={14} />, badge: 'INTERACTIVE' }
  ];

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => {
      const isCurrentlyOpen = prev[cat];
      // Close all categories and open only the clicked one (unless it was already open)
      const newState: Record<string, boolean> = {};
      if (!isCurrentlyOpen) {
        newState[cat] = true;
      }
      return newState;
    });
  };

  const getGroupedBlocks = () => {
    const grouped: Record<string, typeof ALL_BLOCKS> = {};
    ALL_BLOCKS.forEach(block => {
      // Type is symbols 2-3 (e.g. "02" in "B0201")
      const typeKey = block.id.substring(1, 3);
      const catKey = DNA_GROUPS[typeKey] ? typeKey : "99";

      if (!grouped[catKey]) grouped[catKey] = [];
      grouped[catKey].push(block);
    });

    // Sort blocks inside each group by View (symbols 4-5)
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const viewA = parseInt(a.id.substring(3, 5)) || 0;
        const viewB = parseInt(b.id.substring(3, 5)) || 0;
        return viewA - viewB;
      });
    });

    return grouped;
  };

  const CategoryDropdown = ({ catId, label, items }: { catId: string, label: string, items: any[], key?: any }) => {
    const isOpen = openCategories[catId];
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toggleCategory(catId)}
          className="w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group/header"
          style={{
            backgroundColor: uiTheme.lightPanel,
            borderColor: isOpen ? uiTheme.accents : uiTheme.elements,
            borderWidth: 'var(--ui-stroke-width)'
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 mono-font"
              style={{ color: uiTheme.fonts, opacity: isOpen ? 1 : 0.3 }}
            >
              {label}
            </span>
          </div>
          {isOpen ? (
            <ChevronDown size={18} style={{ color: uiTheme.accents }} />
          ) : (
            <ChevronRight size={18} style={{ color: uiTheme.elements, opacity: 0.5 }} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-2 px-1"
            >
              {items.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => addBlock(item.type)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-transparent transition-all duration-300 group/item relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.02)',
                  }}
                >
                  {/* Hover background */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: `${uiTheme.accents}08` }}
                  />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2 rounded-lg bg-black/[0.03] group-hover/item:scale-110 transition-transform duration-300">
                      <Box size={14} style={{ color: uiTheme.accents }} />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight opacity-70 group-hover/item:opacity-100 uppercase transition-all">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full ${item.badge === 'TREND' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[8px] opacity-20 uppercase tracking-[0.2em] group-hover/item:opacity-40 transition-opacity mt-0.5">
                        {item.sub}
                      </span>
                    </div>
                  </div>
                  <div
                    className="opacity-10 group-hover/item:opacity-100 transition-all duration-300 translate-x-1 group-hover/item:translate-x-0 relative z-10"
                    style={{ color: uiTheme.accents }}
                  >
                    {item.icon}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const RegistryView = () => {
    const grouped = getGroupedBlocks();
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="p-8 pb-4">
          <h2 className="font-sans font-medium text-xs tracking-[0.4em] uppercase opacity-30 select-none flex items-center gap-3 mb-8">
            <Plus size={16} />
            <span>Registry</span>
          </h2>

          <div className="flex flex-col gap-4">
            {Object.keys(DNA_GROUPS).map(key => {
              const items = grouped[key];
              if (!items || items.length === 0) return null;
              return (
                <CategoryDropdown
                  key={key}
                  catId={key}
                  label={DNA_GROUPS[key]}
                  items={items}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const ArchitectureView = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-8 py-6">
        <h2 className="font-sans font-medium text-xs tracking-[0.4em] uppercase opacity-30 select-none flex items-center gap-3">
          <Layers size={16} />
          <span>Architecture</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-10 custom-scrollbar px-5">
        {(!pages[currentPage] || pages[currentPage].length === 0) ? (
          <div className="flex flex-col items-center justify-center h-32 opacity-20">
            <span className="text-xs uppercase tracking-widest text-center px-10">No blocks to manage</span>
          </div>
        ) : (
          pages[currentPage].map((block, index) => (
            <div
              key={block.id}
              onClick={() => setSelectedBlock(block.id)}
              className="group relative flex flex-col p-6 border-b transition-all cursor-pointer hover:bg-black/5"
              style={{
                color: selectedBlockId === block.id ? uiTheme.accents : uiTheme.fonts,
                borderColor: uiTheme.elements,
                borderBottomWidth: 'var(--ui-stroke-width)'
              }}
            >
              <div className="flex items-center justify-between mb-4 text-xs font-mono">
                <span style={{ color: selectedBlockId === block.id ? uiTheme.accents : undefined, opacity: selectedBlockId === block.id ? 1 : 0.2 }}>
                  {block.type}_NODE
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                    disabled={index === 0}
                    className="p-1 hover:text-blue-500 disabled:opacity-30"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                    disabled={index === pages[currentPage].length - 1}
                    className="p-1 hover:text-blue-500 disabled:opacity-30"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                    className="p-1 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="text-xs font-mono font-black transition-all duration-300 w-8"
                  style={{
                    color: selectedBlockId === block.id ? uiTheme.accents : uiTheme.fonts,
                    opacity: selectedBlockId === block.id ? 1 : 0.2
                  }}
                >
                  #{String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-mono font-bold tracking-tight ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-40'}`}>
                    {block.id.slice(0, 8)}
                  </span>
                  <span className="text-[9px] opacity-20 uppercase tracking-[0.2em] mt-0.5">
                    Instance_Deployed
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div
      className="w-[320px] h-full border-r animate-[slideIn_0.3s_ease-out] relative flex flex-col overflow-hidden block-list z-50"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts,
        borderRightWidth: 'var(--ui-stroke-width)'
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {isManagerOpen ? <ArchitectureView /> : <RegistryView />}

      <div
        className="p-6 border-t opacity-10 text-xs font-mono tracking-widest text-center"
        style={{ borderColor: uiTheme.elements, borderTopWidth: 'var(--ui-stroke-width)' }}
      >
        MGMT_CORE_V1.2
      </div>
    </div>
  );
};
