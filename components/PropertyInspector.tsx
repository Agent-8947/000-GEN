
import React, { useState, useRef, useEffect } from 'react';
import { useStore, UI_THEME_PRESETS } from '../store';
import {
  Sun, Moon, ArrowLeftRight, RefreshCcw, X, Type, Layout, Palette, Zap, Plus,
  ArrowUp, ArrowDown, ExternalLink, Anchor, Trash2, Image as ImageIcon, Upload,
  Eye, Ban, Undo2, Redo2, Monitor, Smartphone, Grid3X3, Settings
} from 'lucide-react';

// --- Local Controller Components ---

const Scrubber: React.FC<{ label: string; value: string; min?: number; max?: number; onChange: (val: string) => void }> = ({ label, value, min = 0, max = 100, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startVal = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    if (!isDragging) {
      setLocalVal(value);
    }
  }, [value, isDragging]);

  const handleCommit = () => {
    let val = parseFloat(localVal);
    if (isNaN(val)) val = parseFloat(value) || 0;
    const clamped = Math.max(min, Math.min(max, val)).toFixed(2);
    onChange(clamped);
    setLocalVal(clamped);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
    startVal.current = parseFloat(value) || 0;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'all-scroll';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX.current;
      const deltaY = startY.current - e.clientY;
      const totalDelta = deltaX + deltaY;
      const sensitivity = 0.2;
      const newVal = Math.max(min, Math.min(max, startVal.current + totalDelta * sensitivity));
      const formattedVal = newVal.toFixed(2);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        onChange(formattedVal);
        setLocalVal(formattedVal);
      });
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, min, max, onChange, isDragging]);

  return (
    <div className={`flex items-center justify-between py-4 group/row transition-all ${isDragging ? 'relative z-[100] scale-[1.02]' : 'z-0'}`}>
      <div className="flex flex-col">
        <span className="text-xs font-medium tracking-tight opacity-50 group-hover/row:opacity-100 transition-opacity">
          {label}
        </span>
      </div>
      <div
        className="flex items-center gap-3 transition-colors"
      >
        <input
          className="bg-transparent border-none outline-none text-right font-mono text-sm w-[60px] focus:text-blue-500 placeholder:opacity-20 transition-colors"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ color: isDragging ? useStore.getState().uiTheme.accents : 'inherit' }}
        />
        <div
          className="flex items-center gap-3 cursor-all-scroll group/scrub"
          onMouseDown={handleMouseDown}
        >
          <div className="w-20 h-[1px] bg-current opacity-20 relative group-hover/scrub:opacity-40 transition-opacity">
            <div
              className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-current rounded-full transition-shadow ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
              style={{
                left: `${((parseFloat(value) || 0) - min) / Math.max(1, (max - min)) * 100}%`,
                transform: 'translate(-50%, -50%)',
                color: isDragging ? useStore.getState().uiTheme.accents : undefined,
                boxShadow: isDragging ? `0 0 10px ${useStore.getState().uiTheme.accents}40` : undefined
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TypoControls: React.FC<{
  label: string;
  typo: any;
  onUpdate: (path: string, val: any) => void;
  basePath: string;
}> = ({ label, typo, onUpdate, basePath }) => {
  const t = typo || { useGlobal: true, fontSize: '16', fontWeight: '400', letterSpacing: '0', lineHeight: '1.5', uppercase: false };

  return (
    <div className="space-y-1 py-1 mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 italic">{label} Typo</span>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-40 uppercase tracking-widest font-mono">Use Global</span>
          <button
            onClick={() => onUpdate(`${basePath}.useGlobal`, !t.useGlobal)}
            className={`w-7 h-3.5 rounded-full transition-colors relative ${t.useGlobal ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform ${t.useGlobal ? 'translate-x-3.5' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`space-y-0 transition-opacity duration-300 ${t.useGlobal ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
        <div className={!t.useGlobal ? "text-blue-500" : ""}>
          <Scrubber label="Font Size" value={t.fontSize || '16'} min={8} max={120} onChange={(v) => onUpdate(`${basePath}.fontSize`, v)} />
          <Scrubber label="Weight" value={t.fontWeight || '400'} min={100} max={900} onChange={(v) => onUpdate(`${basePath}.fontWeight`, Math.round(parseFloat(v)).toString())} />
          <Scrubber label="Tracking" value={t.letterSpacing || '0'} min={-1} max={5} onChange={(v) => onUpdate(`${basePath}.letterSpacing`, v)} />
          <Scrubber label="Line H." value={t.lineHeight || '1.5'} min={0.5} max={3} onChange={(v) => onUpdate(`${basePath}.lineHeight`, v)} />
          <div className="flex items-center justify-between py-2">
            <span className="text-[10px] font-medium opacity-50 uppercase tracking-widest">Uppercase</span>
            <button
              onClick={() => onUpdate(`${basePath}.uppercase`, !t.uppercase)}
              className={`w-7 h-3.5 rounded-full transition-colors relative ${t.uppercase ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform ${t.uppercase ? 'translate-x-3.5' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorPicker: React.FC<{
  label: string;
  value: string | null | undefined;
  defaultValue: string;
  onChange: (val: string | null) => void;
}> = ({ label, value, defaultValue, onChange }) => {
  const isInherited = value === null || value === undefined;
  const displayColor = isInherited ? defaultValue : value;

  // Helper to get hex and alpha from various formats
  const parseColor = (c: string = '#ffffff') => {
    let hex = '#ffffff';
    let alpha = 1;

    if (c.startsWith('#')) {
      hex = c.slice(0, 7);
      if (c.length === 9) {
        // Hex with alpha #RRGGBBAA
        const aHex = c.slice(7, 9);
        alpha = parseInt(aHex, 16) / 255;
      }
    } else if (c.startsWith('rgba')) {
      const parts = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (parts) {
        const r = parseInt(parts[1]).toString(16).padStart(2, '0');
        const g = parseInt(parts[2]).toString(16).padStart(2, '0');
        const b = parseInt(parts[3]).toString(16).padStart(2, '0');
        hex = `#${r}${g}${b}`;
        alpha = parts[4] ? parseFloat(parts[4]) : 1;
      }
    }
    return { hex, alpha };
  };

  const { hex, alpha } = parseColor(displayColor);

  const updateColor = (newHex: string, newAlpha: number) => {
    // Convert back to rgba for consistency with CSS
    const r = parseInt(newHex.slice(1, 3), 16);
    const g = parseInt(newHex.slice(3, 5), 16);
    const b = parseInt(newHex.slice(5, 7), 16);
    onChange(`rgba(${r},${g},${b},${newAlpha.toFixed(2)})`);
  };

  return (
    <div className="flex flex-col gap-2 py-2 group/color">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium opacity-50 group-hover/color:opacity-100 transition-opacity">{label}</span>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            {!isInherited && (
              <button
                onClick={() => onChange(null)}
                className="p-1 hover:text-red-500 opacity-30 hover:opacity-100 transition-opacity"
                title="Reset to Global"
              >
                <Ban size={14} />
              </button>
            )}
            <div className="relative">
              <input
                type="color"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                value={hex}
                onChange={(e) => updateColor(e.target.value, alpha)}
              />
              <div
                className={`w-6 h-6 rounded-full border border-black/10 flex items-center justify-center overflow-hidden transition-all ${isInherited ? 'opacity-40 grayscale' : 'shadow-sm'}`}
                style={{ backgroundColor: displayColor || 'transparent' }}
              >
                {isInherited && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-red-500/40 rotate-45" />
                  </div>
                )}
              </div>
            </div>
            {isInherited && (
              <span className="text-[10px] font-mono opacity-20 uppercase tracking-tighter">Auto</span>
            )}
          </div>
        </div>
      </div>

      {!isInherited && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-[9px] font-mono opacity-30 uppercase">OPACITY</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alpha}
            onChange={(e) => updateColor(hex, parseFloat(e.target.value))}
            className="flex-1 h-1 bg-black/5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
          <span className="text-[9px] font-mono opacity-50 w-6 text-right">{Math.round(alpha * 100)}%</span>
        </div>
      )}
    </div>
  );
};

const TextInput: React.FC<{
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
  className?: string;
}> = ({ value, placeholder, onChange, className }) => {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  return (
    <input
      className={className}
      placeholder={placeholder}
      value={localVal || ''}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => onChange(localVal)}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
    />
  );
};

// --- Main Inspector Panel ---

export const PropertyInspector: React.FC = () => {
  const { selectedBlockId, contentBlocks, setSelectedBlock, updateBlockLocal, globalSettings, uiTheme, saveSnapshot } = useStore();
  const [activeTab, setActiveTab] = useState<'C' | 'L' | 'S' | 'E'>('C');


  const activeBlock = contentBlocks.find(b => b.id === selectedBlockId);
  if (!activeBlock) return null;

  const overrides = activeBlock.localOverrides || {};
  const isNavbar = activeBlock.type?.startsWith('B01') || activeBlock.type === 'Navbar';
  const isHero = activeBlock.type?.startsWith('B02') || activeBlock.type === 'Hero';
  const isSkills = activeBlock.type?.startsWith('B03') || activeBlock.type === 'Skills';
  const isArticle = activeBlock.type?.startsWith('B04') || activeBlock.type === 'Article';
  const isPortfolio = activeBlock.type?.startsWith('B05') || activeBlock.type === 'Portfolio';
  const isTimeline = activeBlock.type?.startsWith('B06') || activeBlock.type === 'Timeline';
  const isStats = activeBlock.type?.startsWith('B08') || activeBlock.type === 'Stats';
  const isSpacer = activeBlock.type?.startsWith('B09') || activeBlock.type === 'Spacer';
  const isBadges = activeBlock.type?.startsWith('B15') || activeBlock.type === 'Badges';
  const isPreview = activeBlock.type?.startsWith('B16') || activeBlock.type === 'Preview';
  const isTestimonials = activeBlock.type?.startsWith('B22') || activeBlock.type === 'Testimonials' || activeBlock.type === 'Reviews';
  const isContactForm = activeBlock.type?.startsWith('B13') || activeBlock.type === 'Contact' || activeBlock.type === 'ContactForm';
  const isRadarChart = activeBlock.type === 'B2201' || activeBlock.type === 'RadarChart';
  const isSocial = activeBlock.type?.startsWith('B24') || activeBlock.type === 'Socials';
  const isAccordion = activeBlock.type?.startsWith('B07') || activeBlock.type === 'Accordion';
  const isTabs = activeBlock.type?.startsWith('B10') || activeBlock.type === 'Tabs';
  const isMarquee = activeBlock.type === 'B2202';
  const isVariant03 = activeBlock.type?.endsWith('03');
  const isB0102 = activeBlock.type === 'B0102';
  const isLogos = activeBlock.type?.startsWith('B21') || activeBlock.type === 'Logos';
  const isMethodology = activeBlock.type?.startsWith('B17') || activeBlock.type === 'Methodology';
  const isTechStack = activeBlock.type?.startsWith('B18') || activeBlock.type === 'TechStack';
  const isFeaturedProject = activeBlock.type?.startsWith('B1901') || activeBlock.type === 'FeaturedProject';
  const isProjectsGrid = activeBlock.type?.startsWith('B1902') || activeBlock.type === 'ProjectsGrid';
  const isCodeShowcase = activeBlock.type?.startsWith('B1903') || activeBlock.type === 'CodeShowcase';

  const tabBg = 'bg-black/5';

  const tabs = [
    { id: 'C', icon: <Type size={16} />, label: 'Control' },
    { id: 'L', icon: <Layout size={16} />, label: 'Layout' },
    { id: 'S', icon: <Palette size={16} />, label: 'Style' },
    { id: 'E', icon: <Zap size={16} />, label: 'Effects' }
  ] as const;



  return (
    <aside
      className="w-[380px] h-full border-l z-40 flex flex-col transition-colors duration-500 property-inspector"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts,
        borderLeftWidth: 'var(--ui-stroke-width)'
      }}
    >
      <div className="flex-none p-6 border-b flex items-center justify-between" style={{ borderColor: uiTheme.elements, borderBottomWidth: 'var(--ui-stroke-width)' }}>
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
          {activeBlock.type} <span className="text-xs opacity-50 font-mono">#{activeBlock.id.slice(0, 4)}</span>
        </h2>
        <button onClick={() => setSelectedBlock(null)} className="p-2 opacity-20 hover:opacity-100 transition-opacity">
          <X size={20} />
        </button>
      </div>



      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Tabs */}
      <div className="px-8 mt-2 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-t-lg transition-all ${activeTab === tab.id
              ? `bg-black/[0.03] border-t border-x border-gray-100`
              : 'opacity-30 hover:opacity-60'
              }`}
          >
            {tab.icon}
            <span className="text-xs uppercase tracking-widest font-bold">{tab.label[0]}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-8 py-6 ${tabBg}`}>
        {activeTab === 'C' && (
          <div className="space-y-6">
            {isNavbar && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Navigation Data</label>
                  <TextInput
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                    placeholder="Brand Header"
                    value={overrides.data?.header || ''}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.header', val)}
                  />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium opacity-50 uppercase tracking-widest">Sticky Mode</span>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'data.stickyLogic', overrides.data?.stickyLogic === 'true' ? 'false' : 'true')}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.data?.stickyLogic === 'true' ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.data?.stickyLogic === 'true' ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Links</label>
                    <button
                      onClick={() => {
                        const newLinks = [...(overrides.data?.links || []), { label: 'Link', url: '#' }];
                        updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(overrides.data?.links || []).map((link: any, idx: number) => (
                      <div key={idx} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group/link transition-colors hover:bg-black/[0.05]">
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => {
                              const newLinks = overrides.data.links.filter((_: any, i: number) => i !== idx);
                              updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                            }}
                            className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Label</label>
                          <TextInput
                            className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none uppercase"
                            value={link.label}
                            placeholder="MENU ITEM"
                            onChange={(val) => {
                              const newLinks = [...overrides.data.links];
                              newLinks[idx] = { ...link, label: val };
                              updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Target Anchor</label>
                          <div className="flex items-center gap-2">
                            <TextInput
                              className="flex-1 bg-white text-slate-900 border border-black/5 rounded p-2 text-[11px] outline-none font-mono text-blue-600 truncate"
                              value={link.url}
                              placeholder="#section-id"
                              onChange={(val) => {
                                const newLinks = [...overrides.data.links];
                                newLinks[idx] = { ...link, url: val };
                                updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                              }}
                            />
                            <div className="relative" title="Pick Block Anchor">
                              <div className="p-2 bg-white border border-black/5 rounded hover:bg-blue-50 text-blue-500 transition-colors shadow-sm">
                                <Anchor size={14} />
                              </div>
                              <select
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                value=""
                                style={{ color: '#000' }}
                                onChange={(e) => {
                                  if (!e.target.value) return;
                                  const newLinks = [...overrides.data.links];
                                  newLinks[idx] = { ...link, url: e.target.value };
                                  updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                                }}
                              >
                                <option value="" style={{ color: '#000' }}>Select Target...</option>
                                {contentBlocks.map(b => (
                                  <option key={b.id} value={`#${b.id}`} style={{ color: '#000' }}>
                                    {b.type} - {b.localOverrides?.data?.title?.slice(0, 15) || 'Untitled'} (#{b.id.slice(0, 4)})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isHero && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Main Content</label>
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-24"
                    placeholder="Title"
                    value={overrides.data?.title || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.title', e.target.value)}
                  />

                  <TypoControls
                    label="Title"
                    typo={overrides.data?.titleTypo}
                    basePath="data.titleTypo"
                    onUpdate={(path, val) => updateBlockLocal(activeBlock.id, path, val)}
                  />

                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-32"
                    placeholder="Description"
                    value={overrides.data?.description || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.description', e.target.value)}
                  />

                  <TypoControls
                    label="Description"
                    typo={overrides.data?.descriptionTypo}
                    basePath="data.descriptionTypo"
                    onUpdate={(path, val) => updateBlockLocal(activeBlock.id, path, val)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Primary Button</label>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'data.primaryBtnVisible', overrides.data?.primaryBtnVisible !== false ? false : true)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.data?.primaryBtnVisible !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.data?.primaryBtnVisible !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-2 text-sm outline-none"
                    placeholder="Button Text"
                    value={overrides.data?.primaryBtnText || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.primaryBtnText', e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Secondary Button</label>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'data.secondaryBtnVisible', overrides.data?.secondaryBtnVisible !== false ? false : true)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.data?.secondaryBtnVisible !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.data?.secondaryBtnVisible !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-2 text-[12px] outline-none"
                    placeholder="Button Text"
                    value={overrides.data?.secondaryBtnText || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.secondaryBtnText', e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Media Content</label>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'media.showImage', overrides.media?.showImage !== false ? false : true)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.media?.showImage !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.media?.showImage !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  {overrides.media?.showImage !== false && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className="block w-full cursor-pointer">
                          <div className="w-full bg-black/[0.02] border border-dashed border-black/10 rounded-lg p-4 text-center hover:bg-black/[0.05] transition-all">
                            <span className="text-xs opacity-40 uppercase font-bold">Upload Hero Photo</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    updateBlockLocal(activeBlock.id, 'media.imageUrl', reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        </label>
                        {overrides.media?.imageUrl && (
                          <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-black/5">
                            <img src={overrides.media.imageUrl} className="w-8 h-8 object-cover rounded" alt="Preview" />
                            <span className="text-[10px] opacity-30 truncate flex-1">hero_image.png</span>
                            <button
                              onClick={() => updateBlockLocal(activeBlock.id, 'media.imageUrl', '')}
                              className="p-1 hover:text-red-500 opacity-30 hover:opacity-100"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold italic">Position</label>
                        <div className="flex p-0.5 bg-black/5 rounded-lg">
                          {[
                            { id: 'left', label: 'Left' },
                            { id: 'right', label: 'Right' },
                            { id: 'background', label: 'Full' }
                          ].map(pos => (
                            <button
                              key={pos.id}
                              onClick={() => updateBlockLocal(activeBlock.id, 'media.imagePosition', pos.id)}
                              className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.media?.imagePosition === pos.id ? 'bg-white text-slate-900 shadow-sm opacity-100' : 'opacity-60 hover:opacity-100'}`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Scrubber
                        label="Image Opacity"
                        value={overrides.media?.imageOpacity || 100}
                        min={0} max={100}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'media.imageOpacity', val)}
                      />
                      <Scrubber
                        label="Image Scale (%)"
                        value={overrides.media?.imageScale || 100}
                        min={20} max={150}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'media.imageScale', val)}
                      />

                      {activeBlock.type === 'B0202' && (
                        <div className="space-y-2 pt-4 border-t border-black/5">
                          <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Video URL Override</label>
                          <input
                            className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-mono"
                            placeholder="https://..."
                            value={overrides.media?.videoUrl || ''}
                            onChange={(e) => updateBlockLocal(activeBlock.id, 'media.videoUrl', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isArticle && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Article Content</label>
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium"
                    placeholder="Article Title"
                    value={overrides.data?.title || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.title', e.target.value)}
                  />
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium"
                    placeholder="Article Subtitle"
                    value={overrides.data?.subtitle || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.subtitle', e.target.value)}
                  />
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-64"
                    placeholder="Article Body"
                    value={overrides.data?.body || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.body', e.target.value)}
                  />
                </div>
              </div>
            )}

            {isPortfolio && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Portfolio Header</label>
                  <TextInput
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                    placeholder="Section Title"
                    value={overrides.data?.title || ''}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                  />
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-20"
                    placeholder="Section Subtitle"
                    value={overrides.data?.subtitle || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.subtitle', e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Gallery Items</label>
                  <button
                    onClick={() => {
                      const newItems = [...(overrides.data?.items || []), { id: crypto.randomUUID(), type: 'image', url: '', title: 'New Project' }];
                      updateBlockLocal(activeBlock.id, 'data.items', newItems);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {(overrides.data?.items || []).map((item: any, idx: number) => (
                    <div key={item.id} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono opacity-20">Item_{idx + 1}</span>
                        <button
                          onClick={() => {
                            const newItems = overrides.data.items.filter((i: any) => i.id !== item.id);
                            updateBlockLocal(activeBlock.id, 'data.items', newItems);
                          }}
                          className="p-1 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input
                        className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-sm outline-none focus:border-blue-500/30"
                        placeholder="Title"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...overrides.data.items];
                          newItems[idx] = { ...newItems[idx], title: e.target.value };
                          updateBlockLocal(activeBlock.id, 'data.items', newItems);
                        }}
                      />
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Media Source (URL or Upload)</label>
                        <div className="flex items-center gap-2">
                          <input
                            className="flex-1 bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none focus:border-blue-500/30 font-mono"
                            placeholder="https://..."
                            value={item.url || ''}
                            onChange={(e) => {
                              const newItems = [...overrides.data.items];
                              newItems[idx] = { ...newItems[idx], url: e.target.value };
                              updateBlockLocal(activeBlock.id, 'data.items', newItems);
                            }}
                          />
                          <label className="cursor-pointer p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-sm shrink-0" title="Upload Image">
                            <Upload size={14} />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const newItems = [...overrides.data.items];
                                    newItems[idx] = { ...newItems[idx], url: reader.result as string };
                                    updateBlockLocal(activeBlock.id, 'data.items', newItems);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {item.url && (
                          <div className="relative group/preview w-full h-24 rounded-lg border border-black/5 overflow-hidden bg-black/5 shadow-inner">
                            <img
                              src={item.url}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
                              alt="Preview"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+URL';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => {
                                  const newItems = [...overrides.data.items];
                                  newItems[idx] = { ...newItems[idx], url: '' };
                                  updateBlockLocal(activeBlock.id, 'data.items', newItems);
                                }}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110 active:scale-95"
                                title="Clear Media"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-black/5">
                        <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Link URL (Optional)</label>
                        <input
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none focus:border-blue-500/30 font-mono"
                          placeholder="https://example.com"
                          value={item.link || ''}
                          onChange={(e) => {
                            const newItems = [...overrides.data.items];
                            newItems[idx] = { ...newItems[idx], link: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.items', newItems);
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Show Play Button</label>
                        <button
                          onClick={() => {
                            const newItems = [...overrides.data.items];
                            newItems[idx] = { ...newItems[idx], showPlayButton: !item.showPlayButton };
                            updateBlockLocal(activeBlock.id, 'data.items', newItems);
                          }}
                          className={`w-9 h-5 rounded-full transition-colors relative ${item.showPlayButton ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${item.showPlayButton ? 'translate-x-4' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isTimeline && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Milestones</label>
                  <button
                    onClick={() => {
                      const newItems = [...(overrides.data?.items || []), { date: '2024', title: 'New Event', desc: 'Detailed description.' }];
                      updateBlockLocal(activeBlock.id, 'data.items', newItems);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold"
                  >
                    Add Milestone
                  </button>
                </div>
                <div className="space-y-4">
                  {(overrides.data?.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/[0.03] rounded-xl border border-black/5 space-y-3 relative group">
                      <button
                        onClick={() => {
                          const newItems = overrides.data.items.filter((_: any, i: number) => i !== idx);
                          updateBlockLocal(activeBlock.id, 'data.items', newItems);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                      <Scrubber
                        label="Date / Year"
                        value={item.date || '2024'}
                        min={1900} max={2100}
                        onChange={(val) => {
                          const newItems = [...overrides.data.items];
                          newItems[idx] = { ...item, date: val };
                          updateBlockLocal(activeBlock.id, 'data.items', newItems);
                        }}
                      />
                      <input
                        className="w-full bg-white text-slate-900 border border-black/5 rounded-lg p-2 text-sm font-semibold outline-none"
                        placeholder="Title"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...overrides.data.items];
                          newItems[idx] = { ...item, title: e.target.value };
                          updateBlockLocal(activeBlock.id, 'data.items', newItems);
                        }}
                      />
                      <textarea
                        className="w-full bg-white text-slate-900 border border-black/5 rounded-lg p-2 text-sm outline-none h-16"
                        placeholder="Description"
                        value={item.desc || ''}
                        onChange={(e) => {
                          const newItems = [...overrides.data.items];
                          newItems[idx] = { ...item, desc: e.target.value };
                          updateBlockLocal(activeBlock.id, 'data.items', newItems);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isStats && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Metrics</label>
                  <button
                    onClick={() => {
                      const newStats = [...(overrides.data?.stats || []), { value: '0', label: 'Metric' }];
                      updateBlockLocal(activeBlock.id, 'data.stats', newStats);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold"
                  >
                    Add Metric
                  </button>
                </div>
                <div className="space-y-3">
                  {(overrides.data?.stats || []).map((stat: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 flex items-center gap-3">
                      <div className="flex-1 space-y-2">
                        <Scrubber
                          label="Value"
                          value={String(stat.value ?? '').replace(/[^0-9.-]/g, '') || '0'}
                          min={0} max={1000000}
                          onChange={(val) => {
                            const newStats = [...overrides.data.stats];
                            // Try to preserve suffix if existed (like %)
                            const original = String(stat.value ?? '');
                            const suffix = original.replace(/[0-9.-]/g, '');
                            newStats[idx] = { ...stat, value: val + suffix };
                            updateBlockLocal(activeBlock.id, 'data.stats', newStats);
                          }}
                        />
                        <input
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-sm outline-none"
                          placeholder="Label"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...overrides.data.stats];
                            newStats[idx] = { ...stat, label: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.stats', newStats);
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newStats = overrides.data.stats.filter((_: any, i: number) => i !== idx);
                          updateBlockLocal(activeBlock.id, 'data.stats', newStats);
                        }}
                        className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isBadges && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Scrubber
                    label="Vertical Spacing"
                    value={overrides.layout?.paddingY || '40'}
                    min={0} max={200}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingY', val)}
                  />
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Tags (Comma Separated)</label>
                    <textarea
                      className="w-full bg-black/[0.03] border border-black/5 rounded-xl p-4 text-sm font-mono outline-none h-32"
                      placeholder="Tag1, Tag2, Tag3"
                      value={(overrides.data?.tags || []).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        updateBlockLocal(activeBlock.id, 'data.tags', tags);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {isPreview && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none"
                    placeholder="Title"
                    value={overrides.data?.title || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.title', e.target.value)}
                  />
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none font-mono"
                    placeholder="URL"
                    value={overrides.data?.url || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.url', e.target.value)}
                  />
                </div>
              </div>
            )}

            {isSocial && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Platforms</label>
                  <button
                    onClick={() => {
                      const newPlatforms = [...(overrides.data?.platforms || []), { type: 'twitter', url: 'https://' }];
                      updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold"
                  >
                    Add Platform
                  </button>
                </div>
                <div className="space-y-3">
                  {(overrides.data?.platforms || []).map((p: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group">
                      <select
                        className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-[10px] font-bold outline-none"
                        value={p.type}
                        onChange={(e) => {
                          const newPlatforms = [...overrides.data.platforms];
                          newPlatforms[idx] = { ...p, type: e.target.value };
                          updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                        }}
                      >
                        <option value="twitter">Twitter</option>
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="globe">Website</option>
                      </select>
                      <input
                        className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none font-mono"
                        value={p.url}
                        onChange={(e) => {
                          const newPlatforms = [...overrides.data.platforms];
                          newPlatforms[idx] = { ...p, url: e.target.value };
                          updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                        }}
                      />
                      <button
                        onClick={() => {
                          const newPlatforms = overrides.data.platforms.filter((_: any, i: number) => i !== idx);
                          updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSpacer && (
              <div className="space-y-6">
                <Scrubber
                  label="Height (px)"
                  value={overrides.layout?.height || '80'}
                  min={0} max={400}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.height', val)}
                />
              </div>
            )}

            {isTestimonials && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Client Reviews</label>
                  <button
                    onClick={() => {
                      const newItems = [...(overrides.data?.items || []), { quote: 'Experience modular perfection.', name: 'New Client', role: 'Executive' }];
                      updateBlockLocal(activeBlock.id, 'data.items', newItems);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold"
                  >
                    Add Review
                  </button>
                </div>
                <div className="space-y-3">
                  {(overrides.data?.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group">
                      <textarea
                        className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-sm outline-none focus:border-blue-500/30 italic"
                        value={item.quote}
                        placeholder="Quote"
                        onChange={(e) => {
                          const newItems = [...overrides.data.items];
                          newItems[idx] = { ...item, quote: e.target.value };
                          updateBlockLocal(activeBlock.id, 'data.items', newItems);
                        }}
                      />
                      <div className="flex gap-2">
                        <input
                          className="w-1/2 bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none"
                          value={item.name}
                          placeholder="Name"
                          onChange={(e) => {
                            const newItems = [...overrides.data.items];
                            newItems[idx] = { ...item, name: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.items', newItems);
                          }}
                        />
                        <input
                          className="w-1/2 bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none"
                          value={item.role}
                          placeholder="Role"
                          onChange={(e) => {
                            const newItems = [...overrides.data.items];
                            newItems[idx] = { ...item, role: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.items', newItems);
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newItems = overrides.data.items.filter((_: any, i: number) => i !== idx);
                          updateBlockLocal(activeBlock.id, 'data.items', newItems);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {isMarquee && (
                  <div className="pt-4 border-t border-black/5 mt-4">
                    <Scrubber
                      label="Scroll Speed"
                      value={overrides.layout?.speed || '40'}
                      min={10} max={200}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.speed', val)}
                    />
                  </div>
                )}
              </div>
            )}

            {isContactForm && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Header Title</label>
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none"
                    value={overrides.data?.title || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Subtitle</label>
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none"
                    value={overrides.data?.subtitle || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.subtitle', e.target.value)}
                  />
                </div>
              </div>
            )}

            {isRadarChart && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Radar Data</label>
                  <button
                    onClick={() => {
                      const newAxis = [...(overrides.data?.axis || []), { label: 'New Metric', value: 50 }];
                      updateBlockLocal(activeBlock.id, 'data.axis', newAxis);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold"
                  >
                    Add Axis
                  </button>
                </div>
                <div className="space-y-3">
                  {(overrides.data?.axis || []).map((axis: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/[0.03] rounded-xl border border-black/5 space-y-4 relative group">
                      <div className="flex items-center justify-between">
                        <input
                          className="bg-transparent border-b border-transparent hover:border-black/10 focus:border-blue-500/50 outline-none text-xs font-black uppercase tracking-widest flex-1"
                          value={axis.label}
                          onChange={(e) => {
                            const newAxis = [...overrides.data.axis];
                            newAxis[idx] = { ...axis, label: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.axis', newAxis);
                          }}
                        />
                        <button
                          onClick={() => {
                            const newAxis = overrides.data.axis.filter((_: any, i: number) => i !== idx);
                            updateBlockLocal(activeBlock.id, 'data.axis', newAxis);
                          }}
                          className="p-1 text-red-500 opacity-20 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <Scrubber
                        label="Metric Value"
                        value={axis.value.toString()}
                        min={0} max={100}
                        onChange={(val) => {
                          const newAxis = [...overrides.data.axis];
                          newAxis[idx] = { ...axis, value: parseFloat(val) };
                          updateBlockLocal(activeBlock.id, 'data.axis', newAxis);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAccordion && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Header Title</label>
                  <TextInput
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                    placeholder="Accordion Title"
                    value={overrides.data?.title || ''}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Accordion Items</label>
                    <button
                      onClick={() => {
                        const newItems = [...(overrides.data?.items || []), { id: crypto.randomUUID(), question: 'New Question', answer: 'New Answer' }];
                        updateBlockLocal(activeBlock.id, 'data.items', newItems);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(overrides.data?.items || []).map((item: any, idx: number) => (
                      <div key={item.id} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group/item transition-colors hover:bg-black/[0.05]">
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => {
                              const newItems = overrides.data.items.filter((i: any) => i.id !== item.id);
                              updateBlockLocal(activeBlock.id, 'data.items', newItems);
                            }}
                            className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Question</label>
                          <TextInput
                            className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none uppercase"
                            value={item.question}
                            placeholder="QUESTION?"
                            onChange={(val) => {
                              const newItems = [...overrides.data.items];
                              newItems[idx] = { ...item, question: val };
                              updateBlockLocal(activeBlock.id, 'data.items', newItems);
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Answer</label>
                          <textarea
                            className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-[11px] outline-none min-h-[60px]"
                            value={item.answer}
                            placeholder="Answer content..."
                            onChange={(e) => {
                              const newItems = [...overrides.data.items];
                              newItems[idx] = { ...item, answer: e.target.value };
                              updateBlockLocal(activeBlock.id, 'data.items', newItems);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isTabs && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Tabs Configuration</label>
                  <button
                    onClick={() => {
                      const newTabs = [...(overrides.data?.tabs || []), { id: crypto.randomUUID(), label: 'New Tab', content: 'Tab Content' }];
                      updateBlockLocal(activeBlock.id, 'data.tabs', newTabs);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold"
                  >
                    Add Tab
                  </button>
                </div>
                <div className="space-y-4">
                  {(overrides.data?.tabs || []).map((tab: any, idx: number) => (
                    <div key={tab.id} className="p-4 bg-black/[0.03] rounded-xl border border-black/5 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono opacity-20 uppercase tracking-widest">Tab_{idx + 1}</span>
                        <button
                          onClick={() => {
                            const newTabs = overrides.data.tabs.filter((t: any) => t.id !== tab.id);
                            updateBlockLocal(activeBlock.id, 'data.tabs', newTabs);
                          }}
                          className="p-1 text-red-500 opacity-20 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold opacity-30 uppercase">Label</label>
                        <TextInput
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none uppercase tracking-widest"
                          value={tab.label}
                          onChange={(val) => {
                            const newTabs = [...overrides.data.tabs];
                            newTabs[idx] = { ...tab, label: val };
                            updateBlockLocal(activeBlock.id, 'data.tabs', newTabs);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold opacity-30 uppercase">Content</label>
                        <textarea
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-[11px] outline-none min-h-[80px]"
                          value={tab.content}
                          onChange={(e) => {
                            const newTabs = [...overrides.data.tabs];
                            newTabs[idx] = { ...tab, content: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.tabs', newTabs);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isContactForm && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Form Title</label>
                  <TextInput
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                    placeholder="Get in Touch"
                    value={overrides.data?.title || ''}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Subtitle</label>
                  <TextInput
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30"
                    placeholder="Our team will respond within 24 hours."
                    value={overrides.data?.subtitle || ''}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.subtitle', val)}
                  />
                </div>

                <div className="pt-4 border-t border-black/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Telegram Integration</label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Bot Token</label>
                    <input
                      className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-mono outline-none focus:border-blue-500/30"
                      placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                      value={overrides.data?.telegramBotToken || ''}
                      onChange={(e) => updateBlockLocal(activeBlock.id, 'data.telegramBotToken', e.target.value)}
                    />
                    <p className="text-[9px] opacity-40">Get from @BotFather on Telegram</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Chat ID</label>
                    <input
                      className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-mono outline-none focus:border-blue-500/30"
                      placeholder="-1001234567890"
                      value={overrides.data?.telegramChatId || ''}
                      onChange={(e) => updateBlockLocal(activeBlock.id, 'data.telegramChatId', e.target.value)}
                    />
                    <p className="text-[9px] opacity-40">Use @userinfobot to get your Chat ID</p>
                  </div>
                </div>
              </div>
            )}

            {isSocial && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Social Links</label>
                  <button
                    onClick={() => {
                      const newPlatforms = [...(overrides.data?.platforms || []), { type: 'twitter', url: '' }];
                      updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Link
                  </button>
                </div>

                <div className="space-y-3">
                  {(overrides.data?.platforms || []).map((platform: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono opacity-20">Link_{idx + 1}</span>
                        <button
                          onClick={() => {
                            const newPlatforms = overrides.data.platforms.filter((_: any, i: number) => i !== idx);
                            updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                          }}
                          className="p-1 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Platform</label>
                        <select
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none focus:border-blue-500/30"
                          value={platform.type || 'twitter'}
                          onChange={(e) => {
                            const newPlatforms = [...overrides.data.platforms];
                            newPlatforms[idx] = { ...platform, type: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                          }}
                        >
                          <option value="twitter">Twitter / X</option>
                          <option value="github">GitHub</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="instagram">Instagram</option>
                          <option value="youtube">YouTube</option>
                          <option value="facebook">Facebook</option>
                          <option value="telegram">Telegram</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="discord">Discord</option>
                          <option value="twitch">Twitch</option>
                          <option value="pinterest">Pinterest</option>
                          <option value="reddit">Reddit</option>
                          <option value="tiktok">TikTok</option>
                          <option value="globe">Website</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">URL</label>
                        <input
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-mono outline-none focus:border-blue-500/30"
                          placeholder="https://..."
                          value={platform.url || ''}
                          onChange={(e) => {
                            const newPlatforms = [...overrides.data.platforms];
                            newPlatforms[idx] = { ...platform, url: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.platforms', newPlatforms);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSkills && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Skill Groups</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const newGroups = [...(overrides.data?.groups || []), { id: crypto.randomUUID(), title: 'New Group', items: [] }];
                        updateBlockLocal(activeBlock.id, 'data.groups', newGroups);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Group
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[10px] opacity-40 uppercase font-bold">Hide %</span>
                      <button
                        onClick={() => updateBlockLocal(activeBlock.id, 'data.hidePercentages', !overrides.data?.hidePercentages)}
                        className={`w-7 h-4 rounded-full transition-colors relative ${overrides.data?.hidePercentages ? 'bg-blue-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${overrides.data?.hidePercentages ? 'translate-x-3.5' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {(overrides.data?.groups || []).map((group: any, gIdx: number) => (
                    <div key={group.id} className="p-4 bg-black/[0.03] rounded-xl border border-black/5 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          className="flex-1 bg-transparent border-b border-transparent hover:border-black/10 focus:border-blue-500/50 outline-none text-sm font-bold uppercase tracking-tight"
                          value={group.title}
                          onChange={(e) => {
                            const newGroups = [...overrides.data.groups];
                            newGroups[gIdx] = { ...group, title: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.groups', newGroups);
                          }}
                        />
                        <button
                          onClick={() => {
                            const newGroups = overrides.data.groups.filter((g: any) => g.id !== group.id);
                            updateBlockLocal(activeBlock.id, 'data.groups', newGroups);
                          }}
                          className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="space-y-2 pl-2 border-l-2 border-black/5">
                        {(group.items || []).map((item: any, iIdx: number) => (
                          <div key={iIdx} className="flex items-center gap-2 group/item">
                            <input
                              className="flex-1 bg-white text-slate-900 border border-black/5 rounded p-1.5 text-sm"
                              value={item.name}
                              onChange={(e) => {
                                const newGroups = [...overrides.data.groups];
                                const newItems = [...group.items];
                                newItems[iIdx] = { ...item, name: e.target.value };
                                newGroups[gIdx] = { ...group, items: newItems };
                                updateBlockLocal(activeBlock.id, 'data.groups', newGroups);
                              }}
                            />
                            <div className="w-24">
                              <Scrubber
                                label="Level"
                                value={item.level.toString()}
                                min={0} max={100}
                                onChange={(val) => {
                                  const newGroups = [...overrides.data.groups];
                                  const newItems = [...group.items];
                                  newItems[iIdx] = { ...item, level: Math.round(parseFloat(val)) };
                                  newGroups[gIdx] = { ...group, items: newItems };
                                  updateBlockLocal(activeBlock.id, 'data.groups', newGroups);
                                }}
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newGroups = [...overrides.data.groups];
                                const newItems = group.items.filter((_: any, idx: number) => idx !== iIdx);
                                newGroups[gIdx] = { ...group, items: newItems };
                                updateBlockLocal(activeBlock.id, 'data.groups', newGroups);
                              }}
                              className="p-1 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newGroups = [...overrides.data.groups];
                            const newItems = [...(group.items || []), { name: 'Skill', level: 50 }];
                            newGroups[gIdx] = { ...group, items: newItems };
                            updateBlockLocal(activeBlock.id, 'data.groups', newGroups);
                          }}
                          className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-2 hover:underline"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isLogos && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Logos / Partners</label>
                  <button
                    onClick={() => {
                      const newLogos = [...(overrides.data?.items || []), { id: crypto.randomUUID(), name: 'Company', url: '' }];
                      updateBlockLocal(activeBlock.id, 'data.items', newLogos);
                    }}
                    className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Logo
                  </button>
                </div>

                <div className="space-y-3">
                  {(overrides.data?.items || []).map((logo: any, idx: number) => (
                    <div key={logo.id} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group">
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => {
                            const newLogos = overrides.data.items.filter((l: any) => l.id !== logo.id);
                            updateBlockLocal(activeBlock.id, 'data.items', newLogos);
                          }}
                          className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Company Name</label>
                        <TextInput
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none uppercase"
                          value={logo.name}
                          onChange={(val) => {
                            const newLogos = [...overrides.data.items];
                            newLogos[idx] = { ...logo, name: val };
                            updateBlockLocal(activeBlock.id, 'data.items', newLogos);
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Image URL</label>
                            <TextInput
                              className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-[10px] outline-none font-mono"
                              placeholder="https://..."
                              value={logo.url && !logo.url.startsWith('data:') ? logo.url : ''}
                              onChange={(val) => {
                                const newLogos = [...overrides.data.items];
                                newLogos[idx] = { ...logo, url: val };
                                updateBlockLocal(activeBlock.id, 'data.items', newLogos);
                              }}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Or Upload File</label>
                            <div className="flex items-center gap-2">
                              <label className="flex-1 cursor-pointer">
                                <div className="w-full bg-white border border-black/5 rounded p-2 text-[10px] text-center opacity-50 hover:opacity-100 transition-opacity uppercase font-bold">
                                  {logo.url?.startsWith('data:') ? 'Change File' : 'Upload Image'}
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const newLogos = [...overrides.data.items];
                                        newLogos[idx] = { ...logo, url: reader.result as string };
                                        updateBlockLocal(activeBlock.id, 'data.items', newLogos);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              {logo.url && (
                                <button
                                  onClick={() => {
                                    const newLogos = [...overrides.data.items];
                                    newLogos[idx] = { ...logo, url: '' };
                                    updateBlockLocal(activeBlock.id, 'data.items', newLogos);
                                  }}
                                  className="p-2 bg-white border border-black/5 rounded text-red-500 hover:bg-red-50 transition-colors"
                                  title="Remove Image"
                                >
                                  <Ban size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>  {logo.url && (
                          <div className="mt-2 p-2 bg-white rounded border border-black/5 flex justify-center">
                            <img src={logo.url} className="h-8 object-contain opacity-50" alt="Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isMethodology && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Methodology Content</label>
                  <TextInput
                    placeholder="Section Title"
                    value={overrides.data?.title}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                  />
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-24"
                    placeholder="Section Description"
                    value={overrides.data?.description || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.description', e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Steps</label>
                    <button
                      onClick={() => {
                        const newSteps = [...(overrides.data?.steps || []), { number: '01', title: 'New Step', description: 'Step description' }];
                        updateBlockLocal(activeBlock.id, 'data.steps', newSteps);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Step
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(overrides.data?.steps || []).map((step: any, idx: number) => (
                      <div key={idx} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group">
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => {
                              const newSteps = overrides.data.steps.filter((_: any, i: number) => i !== idx);
                              updateBlockLocal(activeBlock.id, 'data.steps', newSteps);
                            }}
                            className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <TextInput
                            className="w-12 bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none text-center"
                            value={step.number}
                            onChange={(val) => {
                              const newSteps = [...overrides.data.steps];
                              newSteps[idx] = { ...step, number: val };
                              updateBlockLocal(activeBlock.id, 'data.steps', newSteps);
                            }}
                          />
                          <TextInput
                            className="flex-1 bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none uppercase"
                            value={step.title}
                            onChange={(val) => {
                              const newSteps = [...overrides.data.steps];
                              newSteps[idx] = { ...step, title: val };
                              updateBlockLocal(activeBlock.id, 'data.steps', newSteps);
                            }}
                          />
                        </div>

                        <textarea
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none h-16 resize-none"
                          value={step.description}
                          onChange={(e) => {
                            const newSteps = [...overrides.data.steps];
                            newSteps[idx] = { ...step, description: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.steps', newSteps);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isTechStack && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Tech Stack Content</label>
                  <TextInput
                    placeholder="Section Title"
                    value={overrides.data?.title}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                  />
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-24"
                    placeholder="Section Description"
                    value={overrides.data?.description || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.description', e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Categories</label>
                    <button
                      onClick={() => {
                        const newCats = [...(overrides.data?.categories || []), { id: crypto.randomUUID(), name: 'New Stack', color: '#3B82F6', technologies: ['React', 'Node'] }];
                        updateBlockLocal(activeBlock.id, 'data.categories', newCats);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(overrides.data?.categories || []).map((cat: any, idx: number) => (
                      <div key={cat.id} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group">
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full border border-black/10 overflow-hidden relative">
                            <input
                              type="color"
                              value={cat.color}
                              className="absolute inset-0 w-[150%] h-[150%] -translate-x-[25%] -translate-y-[25%] p-0 border-0 cursor-pointer opacity-0"
                              onChange={(e) => {
                                const newCats = [...overrides.data.categories];
                                newCats[idx] = { ...cat, color: e.target.value };
                                updateBlockLocal(activeBlock.id, 'data.categories', newCats);
                              }}
                            />
                            <div className="w-full h-full pointer-events-none" style={{ backgroundColor: cat.color }} />
                          </div>
                          <button
                            onClick={() => {
                              const newCats = overrides.data.categories.filter((_: any, i: number) => i !== idx);
                              updateBlockLocal(activeBlock.id, 'data.categories', newCats);
                            }}
                            className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <TextInput
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none uppercase mb-2"
                          value={cat.name}
                          onChange={(val) => {
                            const newCats = [...overrides.data.categories];
                            newCats[idx] = { ...cat, name: val };
                            updateBlockLocal(activeBlock.id, 'data.categories', newCats);
                          }}
                        />

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Technologies (comma separated)</label>
                          <textarea
                            className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none h-16 resize-none font-mono"
                            value={cat.technologies?.join(', ')}
                            onChange={(e) => {
                              const newCats = [...overrides.data.categories];
                              newCats[idx] = { ...cat, technologies: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) };
                              updateBlockLocal(activeBlock.id, 'data.categories', newCats);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isFeaturedProject && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Featured Project</label>
                  <TextInput
                    placeholder="Section Title"
                    value={overrides.data?.title}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                  />
                  <TextInput
                    placeholder="Project Name"
                    value={overrides.data?.projectName}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.projectName', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-bold"
                  />
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-32"
                    placeholder="Project Description"
                    value={overrides.data?.description || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.description', e.target.value)}
                  />
                  <TextInput
                    placeholder="Image URL"
                    value={overrides.data?.image}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.image', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30"
                  />
                  <TextInput
                    placeholder="Live URL"
                    value={overrides.data?.liveUrl}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.liveUrl', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30"
                  />
                  <TextInput
                    placeholder="GitHub URL"
                    value={overrides.data?.githubUrl}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.githubUrl', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30"
                  />
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Tags (comma separated)</label>
                    <textarea
                      className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-xs outline-none h-16 resize-none font-mono"
                      value={overrides.data?.tags?.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean);
                        updateBlockLocal(activeBlock.id, 'data.tags', tags);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {isProjectsGrid && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Projects Grid</label>
                  <TextInput
                    placeholder="Section Title"
                    value={overrides.data?.title}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                  />
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-24"
                    placeholder="Section Description"
                    value={overrides.data?.description || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.description', e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Projects</label>
                    <button
                      onClick={() => {
                        const newProjects = [...(overrides.data?.projects || []), {
                          id: crypto.randomUUID(),
                          name: 'New Project',
                          description: 'Project description',
                          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
                          tags: ['React'],
                          liveUrl: '',
                          githubUrl: ''
                        }];
                        updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(overrides.data?.projects || []).map((project: any, idx: number) => (
                      <div key={project.id} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold opacity-50">Project {idx + 1}</span>
                          <button
                            onClick={() => {
                              const newProjects = overrides.data.projects.filter((_: any, i: number) => i !== idx);
                              updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                            }}
                            className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <TextInput
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none"
                          placeholder="Project Name"
                          value={project.name}
                          onChange={(val) => {
                            const newProjects = [...overrides.data.projects];
                            newProjects[idx] = { ...project, name: val };
                            updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                          }}
                        />
                        <textarea
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none h-16 resize-none"
                          placeholder="Description"
                          value={project.description}
                          onChange={(e) => {
                            const newProjects = [...overrides.data.projects];
                            newProjects[idx] = { ...project, description: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                          }}
                        />
                        <TextInput
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none"
                          placeholder="Image URL"
                          value={project.image}
                          onChange={(val) => {
                            const newProjects = [...overrides.data.projects];
                            newProjects[idx] = { ...project, image: val };
                            updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                          }}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <TextInput
                            className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none"
                            placeholder="Live URL"
                            value={project.liveUrl}
                            onChange={(val) => {
                              const newProjects = [...overrides.data.projects];
                              newProjects[idx] = { ...project, liveUrl: val };
                              updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                            }}
                          />
                          <TextInput
                            className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none"
                            placeholder="GitHub URL"
                            value={project.githubUrl}
                            onChange={(val) => {
                              const newProjects = [...overrides.data.projects];
                              newProjects[idx] = { ...project, githubUrl: val };
                              updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                            }}
                          />
                        </div>
                        <textarea
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none h-12 resize-none font-mono"
                          placeholder="Tags (comma separated)"
                          value={project.tags?.join(', ')}
                          onChange={(e) => {
                            const newProjects = [...overrides.data.projects];
                            newProjects[idx] = { ...project, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) };
                            updateBlockLocal(activeBlock.id, 'data.projects', newProjects);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isCodeShowcase && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Code Showcase</label>
                  <TextInput
                    placeholder="Section Title"
                    value={overrides.data?.title}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'data.title', val)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                  />
                  <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-24"
                    placeholder="Section Description"
                    value={overrides.data?.description || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.description', e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Code Snippets</label>
                    <button
                      onClick={() => {
                        const newSnippets = [...(overrides.data?.snippets || []), {
                          id: crypto.randomUUID(),
                          title: 'New Snippet',
                          language: 'javascript',
                          code: '// Your code here'
                        }];
                        updateBlockLocal(activeBlock.id, 'data.snippets', newSnippets);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(overrides.data?.snippets || []).map((snippet: any, idx: number) => (
                      <div key={snippet.id} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold opacity-50">Snippet {idx + 1}</span>
                          <button
                            onClick={() => {
                              const newSnippets = overrides.data.snippets.filter((_: any, i: number) => i !== idx);
                              updateBlockLocal(activeBlock.id, 'data.snippets', newSnippets);
                            }}
                            className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <TextInput
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none"
                          placeholder="Snippet Title"
                          value={snippet.title}
                          onChange={(val) => {
                            const newSnippets = [...overrides.data.snippets];
                            newSnippets[idx] = { ...snippet, title: val };
                            updateBlockLocal(activeBlock.id, 'data.snippets', newSnippets);
                          }}
                        />
                        <TextInput
                          className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none"
                          placeholder="Language (e.g., javascript, typescript)"
                          value={snippet.language}
                          onChange={(val) => {
                            const newSnippets = [...overrides.data.snippets];
                            newSnippets[idx] = { ...snippet, language: val };
                            updateBlockLocal(activeBlock.id, 'data.snippets', newSnippets);
                          }}
                        />
                        <textarea
                          className="w-full bg-black text-green-400 border border-black/5 rounded p-3 text-xs outline-none h-48 resize-none font-mono"
                          placeholder="Code"
                          value={snippet.code}
                          onChange={(e) => {
                            const newSnippets = [...overrides.data.snippets];
                            newSnippets[idx] = { ...snippet, code: e.target.value };
                            updateBlockLocal(activeBlock.id, 'data.snippets', newSnippets);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'L' && (
          <div className="space-y-1">
            {isNavbar && (
              <>
                <Scrubber
                  label="Height (px)"
                  value={String(overrides.layout?.height ?? '').replace('px', '') || globalSettings['GL03'].params[5].value}
                  min={40} max={200}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.height', val + 'px')}
                />
                <Scrubber
                  label="Padding X (px)"
                  value={overrides.layout?.paddingX || globalSettings['GL03'].params[2].value}
                  min={0} max={150}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingX', val)}
                />
                <Scrubber
                  label="Padding Y (px)"
                  value={overrides.layout?.paddingY || '0'}
                  min={0} max={100}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingY', val)}
                />
              </>
            )}

            {isHero && (
              <div className="space-y-6">
                <Scrubber
                  label="Section Height (vh)"
                  value={String(overrides.layout?.height ?? '').replace('vh', '') || '70'}
                  min={30} max={100}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.height', val + 'vh')}
                />

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Media Position</label>
                  <div className="flex p-0.5 bg-black/5 rounded-lg flex-wrap">
                    {[
                      { id: 'top', label: 'Top' },
                      { id: 'bottom', label: 'Bottom' },
                      { id: 'left', label: 'Left' },
                      { id: 'right', label: 'Right' },
                      { id: 'background', label: 'Full' }
                    ].map(pos => (
                      <button
                        key={pos.id}
                        onClick={() => updateBlockLocal(activeBlock.id, 'media.imagePosition', pos.id)}
                        className={`flex-1 min-w-[30%] py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.media?.imagePosition === pos.id ? 'bg-white text-slate-900 shadow-sm opacity-100' : 'opacity-60 hover:opacity-100'}`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Alignment</label>
                  <div className="flex p-0.5 bg-black/5 rounded-lg">
                    {['left', 'center', 'right'].map(align => (
                      <button
                        key={align}
                        onClick={() => updateBlockLocal(activeBlock.id, 'layout.alignment', align)}
                        className={`flex-1 py-1.5 text-xs uppercase font-bold tracking-widest rounded-md transition-all ${overrides.layout?.alignment === align ? 'bg-white text-slate-900 shadow-sm opacity-100' : 'opacity-60 hover:opacity-100'}`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <Scrubber
                  label="Padding Top (px)"
                  value={String(overrides.layout?.paddingTop ?? '').replace('px', '') || '80'}
                  min={0} max={200}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingTop', val + 'px')}
                />
              </div>
            )}

            {isArticle && (
              <div className="space-y-6">
                <Scrubber
                  label="Max Width (px)"
                  value={overrides.layout?.maxWidth || '800'}
                  min={400} max={1600}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.maxWidth', val)}
                />
                <Scrubber
                  label="Padding Y (px)"
                  value={overrides.layout?.paddingY || '80'}
                  min={0} max={200}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingY', val)}
                />
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Text Alignment</label>
                  <div className="flex p-0.5 bg-black/5 rounded-lg">
                    {['left', 'center', 'right'].map(align => (
                      <button
                        key={align}
                        onClick={() => updateBlockLocal(activeBlock.id, 'layout.textAlign', align)}
                        className={`flex-1 py-1.5 text-xs uppercase font-bold tracking-widest rounded-md transition-all ${overrides.layout?.textAlign === align ? 'bg-white text-slate-900 shadow-sm opacity-100' : 'opacity-60 hover:opacity-100'}`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isPortfolio && (
              <div className="space-y-6">
                <Scrubber
                  label="Columns"
                  value={overrides.layout?.columns || '3'}
                  min={1} max={4}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.columns', Math.round(parseFloat(val)).toString())}
                />
                <Scrubber
                  label="Gap (px)"
                  value={overrides.layout?.gap || '24'}
                  min={0} max={100}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.gap', val)}
                />
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Aspect Ratio</label>
                  <div className="flex p-0.5 bg-black/5 rounded-lg">
                    {[
                      { id: 'aspect-square', label: '1:1' },
                      { id: 'aspect-video', label: '16:9' },
                      { id: 'aspect-[3/4]', label: '3:4' },
                      { id: 'aspect-auto', label: 'Auto' }
                    ].map(asp => (
                      <button
                        key={asp.id}
                        onClick={() => updateBlockLocal(activeBlock.id, 'layout.aspect', asp.id)}
                        className={`flex-1 py-1.5 text-xs uppercase font-bold tracking-widest rounded-md transition-all ${overrides.layout?.aspect === asp.id ? 'bg-white text-slate-900 shadow-sm opacity-100' : 'opacity-60 hover:opacity-100'}`}
                      >
                        {asp.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Scrubber
                  label="Padding Y (px)"
                  value={overrides.layout?.paddingY || '80'}
                  min={0} max={200}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingY', val)}
                />
              </div>
            )}

            {isSpacer && (
              <div className="space-y-6">
                <Scrubber
                  label="Height (px)"
                  value={overrides.layout?.height || '80'}
                  min={0} max={400}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.height', val)}
                />
              </div>
            )}

            {(isTimeline || isStats || isTestimonials || isMarquee) && (
              <div className="space-y-6">
                {(isStats || isTestimonials) && (
                  <Scrubber
                    label="Columns"
                    value={overrides.layout?.columns || '3'}
                    min={1} max={6}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.columns', Math.round(parseFloat(val)).toString())}
                  />
                )}
                {/* Scroll Speed moved to Control tab */}
                <Scrubber
                  label="Padding Y (px)"
                  value={overrides.layout?.paddingY || '80'}
                  min={0} max={200}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingY', val)}
                />
              </div>
            )}

            {(isBadges || isPreview || isContactForm || isRadarChart || isSocial || isTabs || isAccordion) && (
              <div className="space-y-6">
                {isAccordion && (
                  <Scrubber
                    label="Max Width (px)"
                    value={overrides.layout?.maxWidth || '800'}
                    min={400} max={1600}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.maxWidth', val)}
                  />
                )}
                <Scrubber
                  label="Padding Y (px)"
                  value={overrides.layout?.paddingY || '80'}
                  min={0} max={200}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingY', val)}
                />
                {isPreview && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Aspect Ratio</label>
                    <div className="flex p-0.5 bg-black/5 rounded-lg">
                      {[
                        { id: '16/9', label: '16:9' },
                        { id: '4/3', label: '4:3' }
                      ].map(asp => (
                        <button
                          key={asp.id}
                          onClick={() => updateBlockLocal(activeBlock.id, 'layout.aspect', asp.id)}
                          className={`flex-1 py-1.5 text-xs uppercase font-bold tracking-widest rounded-md transition-all ${overrides.layout?.aspect === asp.id ? 'bg-white text-slate-900 shadow-sm opacity-100' : 'opacity-60 hover:opacity-100'}`}
                        >
                          {asp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'S' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 mb-2">
              <p className="text-xs opacity-60 leading-relaxed italic">
                Local styles override Global DNA standards.
              </p>
            </div>

            <div className="space-y-4">
              {(() => {
                const blockStyle = overrides.style || {};
                const siteTheme = globalSettings['GL10']?.params[6]?.value || 'Dark';
                const isDark = siteTheme === 'Dark';

                return (
                  <>
                    <ColorPicker
                      label="Background"
                      value={blockStyle.backgroundColor || (isDark ? 'rgba(30,30,30,1)' : 'rgba(255,255,255,1)')}
                      defaultValue={isDark ? 'rgba(30,30,30,1)' : 'rgba(255,255,255,1)'}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'style.backgroundColor', val)}
                    />

                    <ColorPicker
                      label="Text Color"
                      value={blockStyle.textColor || (isDark ? '#FFFFFF' : '#111827')}
                      defaultValue={isDark ? '#FFFFFF' : '#111827'}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'style.textColor', val)}
                    />

                    {isNavbar && (
                      <div className="space-y-4 pt-4 border-t border-black/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium opacity-50 uppercase tracking-widest">Glass Effect</span>
                          <button
                            onClick={() => updateBlockLocal(activeBlock.id, 'style.glassEffect', blockStyle.glassEffect !== false ? false : true)}
                            className={`w-9 h-5 rounded-full transition-colors relative ${blockStyle.glassEffect !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                          >
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${blockStyle.glassEffect !== false ? 'translate-x-4' : ''}`} />
                          </button>
                        </div>

                        <Scrubber
                          label="Roundness (px)"
                          value={String(blockStyle.borderRadius ?? (isB0102 ? 50 : 0))}
                          min={0} max={64}
                          onChange={(val) => updateBlockLocal(activeBlock.id, 'style.borderRadius', parseInt(val))}
                        />

                        <Scrubber
                          label="Height (px)"
                          value={String(blockStyle.height ?? (isB0102 ? 64 : 80))}
                          min={40} max={120}
                          onChange={(val) => updateBlockLocal(activeBlock.id, 'style.height', parseInt(val))}
                        />

                        {/* DNA Inheritance */}
                        <div className="pt-4 border-t border-black/5 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Inherit DNA</span>
                            <button
                              onClick={() => updateBlockLocal(activeBlock.id, 'style.button.useGlobalDNA', blockStyle.button?.useGlobalDNA !== false ? false : true)}
                              className={`w-8 h-4 rounded-full transition-colors relative ${blockStyle.button?.useGlobalDNA !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                            >
                              <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${blockStyle.button?.useGlobalDNA !== false ? 'translate-x-4' : ''}`} />
                            </button>
                          </div>
                          <p className="text-[10px] opacity-40 leading-relaxed italic">
                            Forces button scaling and padding to match system standards.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {isHero && (
                <>
                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Media Style (B0201)</label>
                    <div className="space-y-2">
                      <span className="text-xs font-medium opacity-50">Mask Shape</span>
                      <div className="flex p-0.5 bg-black/5 rounded-lg">
                        {[
                          { id: 'square', label: 'Sq' },
                          { id: 'circle', label: 'Ci' },
                          { id: 'portrait', label: 'Po' },
                          { id: 'landscape', label: 'La' }
                        ].map(shape => (
                          <button
                            key={shape.id}
                            onClick={() => updateBlockLocal(activeBlock.id, 'media.shape', shape.id)}
                            className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.media?.shape === shape.id ? 'bg-white text-slate-900 shadow-sm opacity-100' : 'opacity-60 hover:opacity-100'}`}
                          >
                            {shape.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium opacity-50 uppercase tracking-widest">Active Levitation</span>
                        <button
                          onClick={() => updateBlockLocal(activeBlock.id, 'media.levitation', !overrides.media?.levitation)}
                          className={`w-9 h-5 rounded-full transition-colors relative ${overrides.media?.levitation ? 'bg-indigo-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.media?.levitation ? 'translate-x-4' : ''}`} />
                        </button>
                      </div>

                      {overrides.media?.levitation && (
                        <Scrubber
                          label="Float Speed (s)"
                          value={String(overrides.media?.levitationSpeed ?? '3')}
                          min={0.5} max={5}
                          onChange={(val) => updateBlockLocal(activeBlock.id, 'media.levitationSpeed', val)}
                        />
                      )}

                      <Scrubber
                        label="Image Scale (%)"
                        value={String(overrides.media?.imageScale ?? 100)}
                        min={20} max={150}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'media.imageScale', val)}
                      />

                      {/* Video URL moved to Control tab */}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="space-y-1 pt-4 border-t border-black/5">
                      <ColorPicker
                        label="Title Color"
                        value={overrides.style?.titleColor}
                        defaultValue={globalSettings['GL02'].params[3].value}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'style.titleColor', val)}
                      />
                      <ColorPicker
                        label="Desc Color"
                        value={overrides.style?.descColor}
                        defaultValue={globalSettings['GL02'].params[4].value}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'style.descColor', val)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Background Logic</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-40 uppercase">Lock BG</span>
                        <button
                          onClick={() => updateBlockLocal(activeBlock.id, 'background.lockBackground', !overrides.background?.lockBackground)}
                          className={`w-9 h-5 rounded-full transition-colors relative ${overrides.background?.lockBackground ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.background?.lockBackground ? 'translate-x-4' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {overrides.background?.lockBackground && (
                      <div className="p-2 bg-black/[0.03] rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
                        <ColorPicker
                          label="Custom Color"
                          value={overrides.background?.fixedColor}
                          defaultValue="#FFFFFF"
                          onChange={(val) => updateBlockLocal(activeBlock.id, 'background.fixedColor', val)}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {isSkills && (
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <ColorPicker
                    label="Accent Override"
                    value={overrides.style?.accent}
                    defaultValue={globalSettings['GL02'].params[2].value}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'style.accent', val)}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium opacity-50">Use Global Radius</span>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'style.useGlobalRadius', !overrides.style?.useGlobalRadius)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.style?.useGlobalRadius !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.style?.useGlobalRadius !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                </div>
              )}

              <Scrubber
                label="Font Weight"
                value={String(overrides.style?.fontWeight ?? globalSettings['GL01'].params[3].value)}
                min={100} max={900}
                onChange={(val) => updateBlockLocal(activeBlock.id, 'style.fontWeight', Math.round(parseFloat(val)).toString())}
              />

              <Scrubber
                label="Radius (px)"
                value={String(overrides.style?.borderRadius ?? '').replace('px', '') || globalSettings['GL07'].params[0].value}
                min={0} max={50}
                onChange={(val) => updateBlockLocal(activeBlock.id, 'style.borderRadius', val + 'px')}
              />

              {(isNavbar || isHero) && (
                <div className="pt-4 border-t border-black/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Button Style</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-40 uppercase">Use Global DNA</span>
                      <button
                        onClick={() => updateBlockLocal(activeBlock.id, 'btnUseGlobal', overrides.btnUseGlobal !== false ? false : true)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${overrides.btnUseGlobal !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.btnUseGlobal !== false ? 'translate-x-4' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {overrides.btnUseGlobal === false && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Scrubber
                        label="Btn Size Scale"
                        value={String(overrides.btnStyles?.size ?? '1.0')}
                        min={0.5} max={2.0}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.size', val)}
                      />
                      <Scrubber
                        label="Btn Pad X"
                        value={String(overrides.btnStyles?.padX ?? '24')}
                        min={8} max={64}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.padX', val)}
                      />
                      <Scrubber
                        label="Btn Pad Y"
                        value={String(overrides.btnStyles?.padY ?? '12')}
                        min={4} max={32}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.padY', val)}
                      />
                      <Scrubber
                        label="Btn Font Size"
                        value={String(overrides.btnStyles?.font ?? '12')}
                        min={8} max={24}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.font', val)}
                      />
                      <Scrubber
                        label="Btn Stroke"
                        value={String(overrides.btnStyles?.stroke ?? '1')}
                        min={0} max={4}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.stroke', val)}
                      />
                      <Scrubber
                        label="Btn Radius"
                        value={String(overrides.btnStyles?.radius ?? '4')}
                        min={0} max={40}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.radius', val)}
                      />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs font-medium opacity-50">Btn Shadow</span>
                        <button
                          onClick={() => updateBlockLocal(activeBlock.id, 'btnStyles.shadow', overrides.btnStyles?.shadow === 'true' ? 'false' : 'true')}
                          className={`w-9 h-5 rounded-full transition-colors relative ${overrides.btnStyles?.shadow === 'true' ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.btnStyles?.shadow === 'true' ? 'translate-x-4' : ''}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isArticle && (
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Typography (B0401)</label>
                  <div className="flex items-center justify-between py-2 border-b border-black/5">
                    <span className="text-xs font-medium opacity-50">Use Global Font</span>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'style.useGlobalFont', overrides.style?.useGlobalFont !== false ? false : true)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.style?.useGlobalFont !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.style?.useGlobalFont !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  {overrides.style?.useGlobalFont === false && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Local Font Family</label>
                      <select
                        className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-2 text-sm outline-none focus:border-blue-500/30"
                        value={overrides.style?.fontFamily || 'Space Grotesk'}
                        onChange={(e) => updateBlockLocal(activeBlock.id, 'style.fontFamily', e.target.value)}
                      >
                        {(globalSettings['GL01'].params[7].options || []).map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Scrubber
                    label="Font Size"
                    value={String(overrides.style?.fontSize ?? '16')}
                    min={12} max={48}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'style.fontSize', val)}
                  />

                  <Scrubber
                    label="Line Height"
                    value={String(overrides.style?.lineHeight ?? '1.6')}
                    min={1.0} max={2.5}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'style.lineHeight', val)}
                  />
                </div>
              )}

              {isPortfolio && (
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Visual Style (B0501)</label>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium opacity-50">Show Captions</span>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'style.showCaptions', overrides.style?.showCaptions !== false ? false : true)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.style?.showCaptions !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.style?.showCaptions !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  <Scrubber
                    label="Hover Scale"
                    value={String(overrides.style?.hoverScale ?? '1.05')}
                    min={1.0} max={1.2}
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'style.hoverScale', val)}
                  />

                  <ColorPicker
                    label="Background Fill"
                    value={overrides.style?.bgFill}
                    defaultValue="#FFFFFF"
                    onChange={(val) => updateBlockLocal(activeBlock.id, 'style.bgFill', val)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'E' && (
          <div className="space-y-2">
            <Scrubber
              label="Glass Blur"
              value={String(overrides.effects?.blur ?? '').replace('px', '') || '20'}
              min={0} max={100}
              onChange={(val) => updateBlockLocal(activeBlock.id, 'effects.blur', val + 'px')}
            />
            <Scrubber
              label="Shadow Intensity"
              value={String(overrides.effects?.shadowAlpha ?? '0.05')}
              min={0} max={1}
              onChange={(val) => updateBlockLocal(activeBlock.id, 'effects.shadowAlpha', val)}
            />

            {isVariant03 && (
              <div className="space-y-4 pt-4 border-t border-black/5 mt-4">
                <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold flex items-center gap-2">
                  <Zap size={14} /> Physics Engine
                </label>
                <Scrubber
                  label="Field Strength"
                  value={String(overrides.physics?.strength ?? '0.5')}
                  min={0.1} max={2.0}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'physics.strength', val)}
                />
                <Scrubber
                  label="System Friction"
                  value={String(overrides.physics?.friction ?? '0.1')}
                  min={0.01} max={1.0}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'physics.friction', val)}
                />
              </div>
            )}

            {(activeBlock.type === 'Hero' || activeBlock.type === 'B0201' || isSkills) && (
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium opacity-50 uppercase tracking-widest">Custom Animation</span>
                  <button
                    onClick={() => updateBlockLocal(activeBlock.id, 'animation.useGlobal', overrides.animation?.useGlobal === false)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${overrides.animation?.useGlobal === false ? 'bg-blue-500 border-blue-500 text-white' : 'border-black/20 opacity-40'}`}
                  >
                    {overrides.animation?.useGlobal === false ? 'ON' : 'OFF'}
                  </button>
                </div>

                {overrides.animation?.useGlobal === false && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Scrubber
                      label="Duration (s)"
                      value={String(overrides.animation?.duration ?? '0.6')}
                      min={0.1} max={2.0}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'animation.duration', val)}
                    />
                    <Scrubber
                      label="Stagger (s)"
                      value={String(overrides.animation?.stagger ?? '0.1')}
                      min={0} max={0.5}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'animation.stagger', val)}
                    />
                    <Scrubber
                      label="Entrance Y (px)"
                      value={String(overrides.animation?.entranceY ?? '20')}
                      min={0} max={100}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'animation.entranceY', val)}
                    />
                  </div>
                )}
              </div>
            )}


            {(activeBlock.type === 'Navbar' || activeBlock.type === 'B0101') && (
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium opacity-50 uppercase tracking-widest">Sticky Animation</span>
                  <button
                    onClick={() => updateBlockLocal(activeBlock.id, 'animation.stickyAnimation', overrides.animation?.stickyAnimation !== true)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${overrides.animation?.stickyAnimation !== false ? 'bg-blue-500 border-blue-500 text-white' : 'border-black/20 opacity-40'}`}
                  >
                    {overrides.animation?.stickyAnimation !== false ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium opacity-50 uppercase tracking-widest">Entrance Type</span>
                  <select
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg p-2 text-sm outline-none"
                    value={overrides.animation?.entranceType || 'slide-down'}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'animation.entranceType', e.target.value)}
                  >
                    <option value="slide-down">Slide Down</option>
                    <option value="fade-blur">Fade Blur</option>
                    <option value="scale-reveal">Scale Reveal</option>
                  </select>
                </div>
              </div>
            )}

            <div className="py-4 space-y-2">
              <span className="text-xs font-medium opacity-50">Entrance Preset</span>
              <select
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg p-2 text-sm outline-none"
                value={overrides.effects?.animation || 'fade-in'}
                onChange={(e) => updateBlockLocal(activeBlock.id, 'effects.animation', e.target.value)}
              >
                <option value="none">None</option>
                <option value="fade-in">Fade In</option>
                <option value="slide-down">Slide Down</option>
                <option value="scale-up">Scale Up</option>
              </select>
            </div>

            {isVariant03 && (
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Physics Logic (Variant 03)</label>
                <Scrubber
                  label="Physics Strength"
                  value={String(overrides.physics?.strength ?? '0.5')}
                  min={0} max={1}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'physics.strength', val)}
                />
                <Scrubber
                  label="Physics Friction"
                  value={String(overrides.physics?.friction ?? '0.1')}
                  min={0} max={0.5}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'physics.friction', val)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 opacity-25 text-xs font-mono tracking-widest flex justify-between">
        <span>SYNC_ID: {activeBlock.id.slice(0, 8)}</span>
        <span>LOCAL_DNA_v1.1</span>
      </div>
    </aside>
  );
};

// --- Theme Settings Panel ---

const ThemeSettingsPanel: React.FC = () => {
  const { uiTheme, applyThemePreset, updateUITheme, toggleThemePanel } = useStore();

  return (
    <div
      className="w-[320px] h-full border-l animate-[slideInRight_0.3s_ease-out] transition-colors duration-500 relative flex flex-col overflow-hidden theme-settings-panel"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts,
        borderLeftWidth: 'var(--ui-stroke-width)'
      }}
    >
      <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: uiTheme.elements, borderBottomWidth: 'var(--ui-stroke-width)' }}>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 italic">System Theme</h2>
        <button onClick={toggleThemePanel} className="p-2 opacity-20 hover:opacity-100 transition-opacity">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Presets */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Interface Presets</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(UI_THEME_PRESETS).map(name => (
              <button
                key={name}
                onClick={() => applyThemePreset(name)}
                className="w-full p-4 border rounded-xl flex items-center justify-between group transition-all hover:bg-black/[0.03]"
                style={{ borderColor: uiTheme.elements, borderWidth: 'var(--ui-stroke-width)' }}
              >
                <span className="text-xs font-bold uppercase tracking-widest">{name}</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: (UI_THEME_PRESETS as any)[name].lightPanel }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: (UI_THEME_PRESETS as any)[name].accents }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Custom Colors</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-black/5">
              <span className="text-xs font-medium opacity-60">Accent Color</span>
              <input
                type="color"
                value={uiTheme.accents}
                onChange={(e) => updateUITheme('accents', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-none outline-none"
              />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/5">
              <span className="text-xs font-medium opacity-60">Panel Color</span>
              <input
                type="color"
                value={uiTheme.lightPanel}
                onChange={(e) => updateUITheme('lightPanel', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-none outline-none"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-medium opacity-60">Text Color</span>
              <input
                type="color"
                value={uiTheme.fonts}
                onChange={(e) => updateUITheme('fonts', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-none outline-none"
              />
            </div>
          </div>
        </div>

        {/* Interface Scale */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Interface Scale</label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono opacity-40">SCALE_VAL</span>
              <span className="text-xs font-bold">{uiTheme.interfaceScale}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="130"
              step="5"
              value={uiTheme.interfaceScale}
              onChange={(e) => updateUITheme('interfaceScale', parseInt(e.target.value))}
              className="w-full h-1 bg-black/10 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: uiTheme.accents }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Left Rail (Utility) ---

export const RightSidebar: React.FC = () => {
  const {
    uiTheme,
    isPreviewMode,
    togglePreviewMode,
    isDataPanelOpen,
    toggleDataPanel,
    isThemePanelOpen,
    toggleThemePanel,
    refreshCanvas,
    serializeState,
    triggerIOFeedback,
    ioFeedback,
    undo, redo, past, future,
    viewportMode, setViewport,
    gridMode, cycleGrid,
    loadSnapshot,
    emergencyRestore
  } = useStore();

  // Integrated Keyboard listeners moved from old Toolbar
  const [keyBuffer, setKeyBuffer] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Emergency Recovery: Detect "666" sequence
      if (e.key >= '0' && e.key <= '9') {
        const newBuffer = (keyBuffer + e.key).slice(-3);
        setKeyBuffer(newBuffer);
        if (newBuffer === '666') {
          emergencyRestore('666');
          setKeyBuffer('');
        }
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
      if (e.key === '6' && e.ctrlKey && e.shiftKey) {
        emergencyRestore('666');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, loadSnapshot, triggerIOFeedback, keyBuffer, emergencyRestore]);

  const isMobile = viewportMode === 'mobile';
  const btnBase = "p-3 transition-all duration-300 rounded-lg hover:brightness-95 flex items-center justify-center";
  const activeIconStyle = { color: uiTheme.accents, backgroundColor: `${uiTheme.accents}15` };

  return (
    <>
      <aside
        className="w-[60px] h-full border-l z-50 flex flex-col items-center py-6 transition-colors duration-500 relative right-sidebar"
        style={{
          backgroundColor: uiTheme.lightPanel,
          borderColor: uiTheme.elements,
          color: uiTheme.fonts,
          borderLeftWidth: 'var(--ui-stroke-width)'
        }}
      >
        <div className="flex flex-col items-center gap-2 w-full px-2">
          {/* Undo/Redo Group */}
          <button
            onClick={undo}
            disabled={past.length === 0}
            className={`${btnBase} ${past.length === 0 ? 'opacity-20 pointer-events-none' : 'hover:bg-black/5'}`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={20} strokeWidth={2} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className={`${btnBase} ${future.length === 0 ? 'opacity-20 pointer-events-none' : 'hover:bg-black/5'}`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={20} strokeWidth={2} />
          </button>

          <div className="w-8 h-[1px] bg-current opacity-10 my-2" />

          {/* Viewport Toggles */}
          <button
            onClick={() => setViewport('desktop')}
            className={btnBase}
            style={!isMobile ? activeIconStyle : {}}
            title="Desktop View"
          >
            <Monitor size={20} strokeWidth={2} />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={btnBase}
            style={isMobile ? activeIconStyle : {}}
            title="Mobile View"
          >
            <Smartphone size={20} strokeWidth={2} />
          </button>

          <div className="w-8 h-[1px] bg-current opacity-10 my-2" />

          {/* Grid Toggle */}
          <button
            onClick={cycleGrid}
            className={btnBase}
            style={gridMode !== 'off' ? activeIconStyle : {}}
            title="Toggle Grid (G)"
          >
            <Grid3X3 size={20} strokeWidth={2} />
          </button>

          <div className="w-8 h-[1px] bg-current opacity-10 my-2" />

          {/* Settings / UI Theme Toggle */}
          <button
            onClick={toggleThemePanel}
            className={btnBase}
            style={isThemePanelOpen ? activeIconStyle : {}}
            title="Interface Settings"
          >
            <Settings size={22} strokeWidth={1.5} className={isThemePanelOpen ? 'rotate-90 duration-500' : 'duration-500'} />
          </button>

          {/* Visibility / Preview Toggle */}
          <button
            onClick={togglePreviewMode}
            className={btnBase}
            style={isPreviewMode ? activeIconStyle : {}}
            title="Toggle Preview Mode"
          >
            <Eye size={22} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => {
              toggleDataPanel();
              if (!isDataPanelOpen) { serializeState(); triggerIOFeedback(); }
            }}
            className={`${btnBase} relative group ${ioFeedback ? 'opacity-30' : 'opacity-100'}`}
            style={isDataPanelOpen ? activeIconStyle : {}}
            title="Production Output"
          >
            <ArrowLeftRight size={22} strokeWidth={1.5} />
            {isDataPanelOpen && <div className="absolute right-[-4px] w-[2px] h-6 rounded-l-full" style={{ backgroundColor: uiTheme.accents }} />}
          </button>

          <button
            onClick={refreshCanvas}
            className={`${btnBase} hover:rotate-180 duration-700`}
            title="Refresh Canvas"
          >
            <RefreshCcw size={22} strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* Dynamic Overlay Panels */}
      {!isPreviewMode && isThemePanelOpen && <ThemeSettingsPanel />}
    </>
  );
};
