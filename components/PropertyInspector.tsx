
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Sun, Moon, ArrowLeftRight, RefreshCcw, X, Type, Layout, Palette, Zap, Plus, ArrowUp, ArrowDown, ExternalLink, Anchor, Trash2, Image as ImageIcon, Upload, Settings, Eye } from 'lucide-react';

// --- Local Controller Components ---

const Scrubber: React.FC<{ label: string; value: string; min?: number; max?: number; onChange: (val: string) => void }> = ({ label, value, min = 0, max = 100, onChange }) => {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startVal = useRef(0);
  const rafRef = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startVal.current = parseFloat(value) || 0;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const sensitivity = 0.5;
      const newVal = Math.max(min, Math.min(max, startVal.current + delta * sensitivity));
      const formattedVal = newVal.toFixed(1);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        onChange(formattedVal);
      });
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
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
  }, [value, min, max, onChange]);

  return (
    <div className="flex items-center justify-between py-4 group/row">
      <div className="flex flex-col">
        <span className="text-[11px] font-medium tracking-tight opacity-50 group-hover/row:opacity-100 transition-opacity">
          {label}
        </span>
      </div>
      <div
        className="flex items-center gap-3 cursor-ew-resize active:text-blue-500 transition-colors"
        onMouseDown={handleMouseDown}
      >
        <span className="font-mono text-[13px] min-w-[50px] text-right">{value}</span>
        <div className="w-20 h-[1px] bg-current opacity-20 relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-current rounded-full"
            style={{ left: `${((parseFloat(value) || 0) - min) / (max - min) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
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
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30 italic">{label} Typo</span>
        <div className="flex items-center gap-2">
          <span className="text-[8px] opacity-40 uppercase tracking-widest font-mono">Use Global</span>
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

// --- Main Inspector Panel ---

export const PropertyInspector: React.FC = () => {
  const { selectedBlockId, contentBlocks, setSelectedBlock, updateBlockLocal, globalSettings, uiTheme } = useStore();
  const [activeTab, setActiveTab] = useState<'C' | 'L' | 'S' | 'E'>('C');

  const activeBlock = contentBlocks.find(b => b.id === selectedBlockId);
  if (!activeBlock) return null;

  const overrides = activeBlock.localOverrides || {};
  const isNavbar = activeBlock.type === 'B0101' || activeBlock.type === 'Navbar';
  const isHero = activeBlock.type === 'B0201' || activeBlock.type === 'Hero';
  const isFeatures = activeBlock.type === 'B0301' || activeBlock.type === 'Features';

  const tabBg = 'bg-black/5';

  const tabs = [
    { id: 'C', icon: <Type size={14} />, label: 'Control' },
    { id: 'L', icon: <Layout size={14} />, label: 'Layout' },
    { id: 'S', icon: <Palette size={14} />, label: 'Style' },
    { id: 'E', icon: <Zap size={14} />, label: 'Effects' }
  ] as const;

  return (
    <aside
      className="w-[380px] h-full border-l z-40 flex flex-col transition-colors duration-500"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts
      }}
    >
      <div className="flex-none p-6 border-b flex items-center justify-between" style={{ borderColor: uiTheme.elements }}>
        <h2 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
          {activeBlock.type} <span className="text-[10px] opacity-50 font-mono">#{activeBlock.id.slice(0, 4)}</span>
        </h2>
        <button onClick={() => setSelectedBlock(null)} className="p-2 opacity-20 hover:opacity-100 transition-opacity">
          <X size={18} />
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
            <span className="text-[9px] uppercase tracking-widest font-bold">{tab.label[0]}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar px-8 py-6 ${tabBg}`}>
        {activeTab === 'C' && (
          <div className="space-y-6">
            {isNavbar && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Brand Logo / Icon</label>
                  </div>

                  <div className="space-y-3">
                    <input
                      className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium"
                      placeholder="Logo Text"
                      value={overrides.data?.logo || ''}
                      onChange={(e) => updateBlockLocal(activeBlock.id, 'data.logo', e.target.value)}
                    />

                    <TypoControls
                      label="Logo"
                      typo={overrides.data?.logoTypo}
                      basePath="data.logoTypo"
                      onUpdate={(path, val) => updateBlockLocal(activeBlock.id, path, val)}
                    />

                    <div className="flex items-center justify-between py-2 border-t border-black/5 mt-2">
                      <span className="text-[11px] font-medium opacity-50">Show Icon</span>
                      <button
                        onClick={() => updateBlockLocal(activeBlock.id, 'data.showIcon', overrides.data?.showIcon !== false ? false : true)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${overrides.data?.showIcon !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.data?.showIcon !== false ? 'translate-x-4' : ''}`} />
                      </button>
                    </div>

                    {overrides.data?.showIcon !== false && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex p-0.5 bg-black/5 rounded-lg">
                          <button
                            onClick={() => updateBlockLocal(activeBlock.id, 'data.iconType', 'default')}
                            className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.data?.iconType !== 'custom' ? 'bg-white shadow-sm opacity-100' : 'opacity-40'}`}
                          >
                            Default
                          </button>
                          <button
                            onClick={() => updateBlockLocal(activeBlock.id, 'data.iconType', 'custom')}
                            className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.data?.iconType === 'custom' ? 'bg-white shadow-sm opacity-100' : 'opacity-40'}`}
                          >
                            Custom
                          </button>
                        </div>

                        {overrides.data?.iconType === 'custom' && (
                          <div className="relative group">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    updateBlockLocal(activeBlock.id, 'data.customIconUrl', reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <div className="w-full h-24 bg-black/[0.03] border border-dashed border-black/10 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:bg-black/[0.05] transition-all">
                              {overrides.data?.customIconUrl ? (
                                <img src={overrides.data.customIconUrl} className="h-12 w-12 object-contain rounded-md" alt="Custom Logo" />
                              ) : (
                                <Upload size={20} className="opacity-20" />
                              )}
                              <span className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Upload Custom Icon</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Action Button</label>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'data.showActionButton', overrides.data?.showActionButton !== false ? false : true)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.data?.showActionButton !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.data?.showActionButton !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  {overrides.data?.showActionButton !== false && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <input
                        className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium"
                        placeholder="Button Label"
                        value={overrides.data?.actionButtonText || 'Start'}
                        onChange={(e) => updateBlockLocal(activeBlock.id, 'data.actionButtonText', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Menu Links</label>
                    <button
                      onClick={() => {
                        const newLinks = [...(overrides.data?.links || []), { id: crypto.randomUUID(), label: 'New Link', type: 'anchor', value: '' }];
                        updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                      }}
                      className="p-1 px-2 bg-blue-500 text-white text-[9px] rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={10} /> Add Link
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(overrides.data?.links || []).map((link: any, index: number) => (
                      <div key={link.id} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {link.type === 'anchor' ? <Anchor size={12} className="opacity-30" /> : <ExternalLink size={12} className="opacity-30" />}
                            <span className="text-[10px] font-mono opacity-20">Link_{index + 1}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              disabled={index === 0}
                              onClick={() => {
                                if (index === 0) return;
                                const newLinks = [...overrides.data.links];
                                [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
                                updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                              }}
                              className="p-1 hover:text-blue-500 disabled:opacity-10"
                            ><ArrowUp size={14} /></button>
                            <button
                              onClick={() => {
                                const newLinks = (overrides.data.links || []).filter((l: any) => l.id !== link.id);
                                updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                              }}
                              className="p-1 hover:text-red-500"
                            ><Trash2 size={14} /></button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase opacity-40 italic">Label</label>
                            <input
                              className="w-full bg-white border border-black/5 rounded p-1.5 text-[12px] outline-none focus:border-blue-500/20"
                              value={link.label}
                              onChange={(e) => {
                                const newLinks = [...overrides.data.links];
                                newLinks[index] = { ...newLinks[index], label: e.target.value };
                                updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase opacity-40 italic">Type</label>
                            <select
                              className="w-full bg-white border border-black/5 rounded p-1.5 text-[12px] outline-none"
                              value={link.type}
                              onChange={(e) => {
                                const newLinks = [...overrides.data.links];
                                newLinks[index] = { ...newLinks[index], type: e.target.value };
                                updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                              }}
                            >
                              <option value="anchor">Anchor</option>
                              <option value="url">URL</option>
                            </select>
                          </div>
                        </div>

                        <TypoControls
                          label="Link"
                          typo={link.typo}
                          basePath={`data.links.${index}.typo`}
                          onUpdate={(path, val) => updateBlockLocal(activeBlock.id, path, val)}
                        />

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase opacity-40 italic">Target Value</label>
                          {link.type === 'anchor' ? (
                            <select
                              className="w-full bg-white border border-black/5 rounded p-1.5 text-[12px] outline-none"
                              value={link.value}
                              onChange={(e) => {
                                const newLinks = [...overrides.data.links];
                                newLinks[index] = { ...newLinks[index], value: e.target.value };
                                updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                              }}
                            >
                              <option value="">Select Target Node</option>
                              {contentBlocks.filter((b: any) => b.id !== activeBlock.id).map((b: any) => (
                                <option key={b.id} value={b.id}>{b.type} ({b.id.slice(0, 4)})</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className="w-full bg-white border border-black/5 rounded p-1.5 text-[12px] outline-none focus:border-blue-500/20"
                              placeholder="https://..."
                              value={link.value}
                              onChange={(e) => {
                                const newLinks = [...overrides.data.links];
                                newLinks[index] = { ...newLinks[index], value: e.target.value };
                                updateBlockLocal(activeBlock.id, 'data.links', newLinks);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {isHero && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Main Content</label>
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium"
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
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Primary Button</label>
                    <button
                      onClick={() => updateBlockLocal(activeBlock.id, 'data.primaryBtnVisible', overrides.data?.primaryBtnVisible !== false ? false : true)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${overrides.data?.primaryBtnVisible !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.data?.primaryBtnVisible !== false ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                  <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-2 text-[12px] outline-none"
                    placeholder="Button Text"
                    value={overrides.data?.primaryBtnText || ''}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'data.primaryBtnText', e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Secondary Button</label>
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
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Media Content</label>
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
                            <span className="text-[10px] opacity-40 uppercase font-bold">Upload Hero Photo</span>
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
                        <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold italic">Position</label>
                        <div className="flex p-0.5 bg-black/5 rounded-lg">
                          {[
                            { id: 'left', label: 'Left' },
                            { id: 'right', label: 'Right' },
                            { id: 'background', label: 'Full' }
                          ].map(pos => (
                            <button
                              key={pos.id}
                              onClick={() => updateBlockLocal(activeBlock.id, 'media.imagePosition', pos.id)}
                              className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.media?.imagePosition === pos.id ? 'bg-white shadow-sm opacity-100' : 'opacity-40'}`}
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
                    </div>
                  )}
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
                  value={overrides.layout?.height?.replace('px', '') || globalSettings['GL03'].params[5].value}
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
                <div className="flex items-center justify-between py-4">
                  <span className="text-[11px] font-medium opacity-50">Sticky Navigation</span>
                  <button
                    onClick={() => updateBlockLocal(activeBlock.id, 'layout.sticky', !overrides.layout?.sticky)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${overrides.layout?.sticky !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.layout?.sticky !== false ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </>
            )}

            {isHero && (
              <div className="space-y-6">
                <Scrubber
                  label="Section Height (vh)"
                  value={overrides.layout?.height?.replace('vh', '') || '70'}
                  min={30} max={100}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.height', val + 'vh')}
                />

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Media Position</label>
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
                        className={`flex-1 min-w-[30%] py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.media?.imagePosition === pos.id ? 'bg-white shadow-sm opacity-100' : 'opacity-40'}`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Alignment</label>
                  <div className="flex p-0.5 bg-black/5 rounded-lg">
                    {['left', 'center', 'right'].map(align => (
                      <button
                        key={align}
                        onClick={() => updateBlockLocal(activeBlock.id, 'layout.alignment', align)}
                        className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.layout?.alignment === align ? 'bg-white shadow-sm opacity-100' : 'opacity-40'}`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <Scrubber
                  label="Padding Top (px)"
                  value={overrides.layout?.paddingTop?.replace('px', '') || '80'}
                  min={0} max={200}
                  onChange={(val) => updateBlockLocal(activeBlock.id, 'layout.paddingTop', val + 'px')}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'S' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 mb-2">
              <p className="text-[10px] opacity-60 leading-relaxed italic">
                Local styles override Global DNA standards.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium opacity-50">Background</span>
                <div className="relative">
                  <input
                    type="color"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={overrides.style?.background || globalSettings['GL02'].params[1].value}
                    onChange={(e) => updateBlockLocal(activeBlock.id, 'style.background', e.target.value)}
                  />
                  <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: overrides.style?.background || globalSettings['GL02'].params[1].value }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium opacity-50">Text Color</span>
                <div className="relative">
                  <input
                    type="color"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={isNavbar ? (overrides.textColor || globalSettings['GL02'].params[3].value) : (overrides.style?.color || globalSettings['GL02'].params[3].value)}
                    onChange={(e) => updateBlockLocal(activeBlock.id, isNavbar ? 'textColor' : 'style.color', e.target.value)}
                  />
                  <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: isNavbar ? (overrides.textColor || globalSettings['GL02'].params[3].value) : (overrides.style?.color || globalSettings['GL02'].params[3].value) }} />
                </div>
              </div>

              {isHero && (
                <>
                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Media Style (B0201)</label>
                    <div className="space-y-2">
                      <span className="text-[11px] font-medium opacity-50">Mask Shape</span>
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
                            className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.media?.shape === shape.id ? 'bg-white shadow-sm opacity-100' : 'opacity-40'}`}
                          >
                            {shape.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium opacity-50 uppercase tracking-widest">Active Levitation</span>
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
                          value={overrides.media?.levitationSpeed || '3'}
                          min={0.5} max={5}
                          onChange={(val) => updateBlockLocal(activeBlock.id, 'media.levitationSpeed', val)}
                        />
                      )}

                      <Scrubber
                        label="Image Scale (%)"
                        value={overrides.media?.imageScale || 100}
                        min={20} max={150}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'media.imageScale', val)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium opacity-50">Title Color</span>
                      <div className="relative">
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          value={overrides.style?.titleColor || globalSettings['GL02'].params[3].value}
                          onChange={(e) => updateBlockLocal(activeBlock.id, 'style.titleColor', e.target.value)}
                        />
                        <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: overrides.style?.titleColor || globalSettings['GL02'].params[3].value }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium opacity-50">Desc Color</span>
                      <div className="relative">
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          value={overrides.style?.descColor || globalSettings['GL02'].params[4].value}
                          onChange={(e) => updateBlockLocal(activeBlock.id, 'style.descColor', e.target.value)}
                        />
                        <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: overrides.style?.descColor || globalSettings['GL02'].params[4].value }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Background Logic</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-40 uppercase">Lock BG</span>
                        <button
                          onClick={() => updateBlockLocal(activeBlock.id, 'background.lockBackground', !overrides.background?.lockBackground)}
                          className={`w-9 h-5 rounded-full transition-colors relative ${overrides.background?.lockBackground ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overrides.background?.lockBackground ? 'translate-x-4' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {overrides.background?.lockBackground && (
                      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                        <span className="text-[11px] font-medium opacity-50">Local BG Color</span>
                        <div className="relative">
                          <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={overrides.background?.fixedColor || '#FFFFFF'}
                            onChange={(e) => updateBlockLocal(activeBlock.id, 'background.fixedColor', e.target.value)}
                          />
                          <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: overrides.background?.fixedColor || '#FFFFFF' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Scrubber
                label="Font Weight"
                value={overrides.style?.fontWeight || globalSettings['GL01'].params[3].value}
                min={100} max={900}
                onChange={(val) => updateBlockLocal(activeBlock.id, 'style.fontWeight', Math.round(parseFloat(val)).toString())}
              />

              <Scrubber
                label="Radius (px)"
                value={overrides.style?.borderRadius?.replace('px', '') || globalSettings['GL07'].params[0].value}
                min={0} max={50}
                onChange={(val) => updateBlockLocal(activeBlock.id, 'style.borderRadius', val + 'px')}
              />

              {(isNavbar || isHero) && (
                <div className="pt-4 border-t border-black/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">Button Style</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-40 uppercase">Use Global DNA</span>
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
                        value={overrides.btnStyles?.size || '1.0'}
                        min={0.5} max={2.0}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.size', val)}
                      />
                      <Scrubber
                        label="Btn Pad X"
                        value={overrides.btnStyles?.padX || '24'}
                        min={8} max={64}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.padX', val)}
                      />
                      <Scrubber
                        label="Btn Pad Y"
                        value={overrides.btnStyles?.padY || '12'}
                        min={4} max={32}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.padY', val)}
                      />
                      <Scrubber
                        label="Btn Font Size"
                        value={overrides.btnStyles?.font || '12'}
                        min={8} max={24}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.font', val)}
                      />
                      <Scrubber
                        label="Btn Stroke"
                        value={overrides.btnStyles?.stroke || '1'}
                        min={0} max={4}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.stroke', val)}
                      />
                      <Scrubber
                        label="Btn Radius"
                        value={overrides.btnStyles?.radius || '4'}
                        min={0} max={40}
                        onChange={(val) => updateBlockLocal(activeBlock.id, 'btnStyles.radius', val)}
                      />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[11px] font-medium opacity-50">Btn Shadow</span>
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
            </div>
          </div>
        )}

        {activeTab === 'E' && (
          <div className="space-y-2">
            <Scrubber
              label="Glass Blur"
              value={overrides.effects?.blur?.replace('px', '') || '20'}
              min={0} max={100}
              onChange={(val) => updateBlockLocal(activeBlock.id, 'effects.blur', val + 'px')}
            />
            <Scrubber
              label="Shadow Intensity"
              value={overrides.effects?.shadowAlpha || '0.05'}
              min={0} max={1}
              onChange={(val) => updateBlockLocal(activeBlock.id, 'effects.shadowAlpha', val)}
            />

            {(activeBlock.type === 'Hero' || activeBlock.type === 'B0201') && (
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-[11px] font-medium opacity-50 uppercase tracking-widest">Custom Animation</span>
                  <button
                    onClick={() => updateBlockLocal(activeBlock.id, 'animation.useGlobal', overrides.animation?.useGlobal === false)}
                    className={`text-[10px] px-3 py-1 rounded-full border transition-all ${overrides.animation?.useGlobal === false ? 'bg-blue-500 border-blue-500 text-white' : 'border-black/20 opacity-40'}`}
                  >
                    {overrides.animation?.useGlobal === false ? 'ON' : 'OFF'}
                  </button>
                </div>

                {overrides.animation?.useGlobal === false && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Scrubber
                      label="Duration (s)"
                      value={overrides.animation?.duration || '0.6'}
                      min={0.1} max={2.0}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'animation.duration', val)}
                    />
                    <Scrubber
                      label="Stagger (s)"
                      value={overrides.animation?.stagger || '0.1'}
                      min={0} max={0.5}
                      onChange={(val) => updateBlockLocal(activeBlock.id, 'animation.stagger', val)}
                    />
                    <Scrubber
                      label="Entrance Y (px)"
                      value={overrides.animation?.entranceY || '20'}
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
                  <span className="text-[11px] font-medium opacity-50 uppercase tracking-widest">Sticky Animation</span>
                  <button
                    onClick={() => updateBlockLocal(activeBlock.id, 'animation.stickyAnimation', overrides.animation?.stickyAnimation !== true)}
                    className={`text-[10px] px-3 py-1 rounded-full border transition-all ${overrides.animation?.stickyAnimation !== false ? 'bg-blue-500 border-blue-500 text-white' : 'border-black/20 opacity-40'}`}
                  >
                    {overrides.animation?.stickyAnimation !== false ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-medium opacity-50 uppercase tracking-widest">Entrance Type</span>
                  <select
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg p-2 text-[12px] outline-none"
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
              <span className="text-[11px] font-medium opacity-50">Entrance Preset</span>
              <select
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg p-2 text-[12px] outline-none"
                value={overrides.effects?.animation || 'fade-in'}
                onChange={(e) => updateBlockLocal(activeBlock.id, 'effects.animation', e.target.value)}
              >
                <option value="none">None</option>
                <option value="fade-in">Fade In</option>
                <option value="slide-down">Slide Down</option>
                <option value="scale-up">Scale Up</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 opacity-25 text-[10px] font-mono tracking-widest flex justify-between">
        <span>SYNC_ID: {activeBlock.id.slice(0, 8)}</span>
        <span>LOCAL_DNA_v1.1</span>
      </div>
    </aside>
  );
};

// --- Left Rail (Utility) ---

export const RightSidebar: React.FC = () => {
  const {
    uiTheme,
    updateUITheme,
    isPreviewMode,
    togglePreviewMode,
    isDataPanelOpen,
    toggleDataPanel,
    refreshCanvas,
    serializeState,
    triggerIOFeedback,
    ioFeedback
  } = useStore();

  const [isColorOpen, setIsColorOpen] = useState(false);

  return (
    <aside
      className="w-[60px] h-full border-l z-50 flex flex-col items-center py-6 transition-colors duration-500 relative"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts
      }}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Toggle Preview Mode */}
        <button
          onClick={togglePreviewMode}
          className="p-3 mb-2 transition-all duration-300 rounded-lg hover:brightness-95"
          style={{
            color: isPreviewMode ? uiTheme.accents : uiTheme.elements,
            backgroundColor: isPreviewMode ? `${uiTheme.accents}15` : 'transparent'
          }}
          title="Toggle Preview Mode"
        >
          <Eye size={22} strokeWidth={1.5} />
        </button>

        {/* UI Settings (Color) */}
        <div className="relative">
          <button
            onClick={() => setIsColorOpen(!isColorOpen)}
            onClick={() => setIsColorOpen(!isColorOpen)}
            className="p-3 mb-4 transition-all duration-300 hover:brightness-95 rounded-lg"
            style={{ color: isColorOpen ? uiTheme.accents : uiTheme.elements }}
          >
            <Settings size={22} strokeWidth={1.5} />
          </button>

          {isColorOpen && (
            <div className="absolute right-full mr-4 top-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex flex-col gap-3 z-[100] w-56">
              <div className="text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">UI Theme (5-Color)</div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600">Fonts</span>
                  <div className="relative w-6 h-6 rounded-full border border-gray-200 overflow-hidden shadow-sm" style={{ backgroundColor: uiTheme.fonts }}>
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={uiTheme.fonts}
                      onChange={(e) => updateUITheme('fonts', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600">Dark Panel</span>
                  <div className="relative w-6 h-6 rounded-full border border-gray-200 overflow-hidden shadow-sm" style={{ backgroundColor: uiTheme.darkPanel }}>
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={uiTheme.darkPanel}
                      onChange={(e) => updateUITheme('darkPanel', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600">Light Panel</span>
                  <div className="relative w-6 h-6 rounded-full border border-gray-200 overflow-hidden shadow-sm" style={{ backgroundColor: uiTheme.lightPanel }}>
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={uiTheme.lightPanel}
                      onChange={(e) => updateUITheme('lightPanel', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600">Elements</span>
                  <div className="relative w-6 h-6 rounded-full border border-gray-200 overflow-hidden shadow-sm" style={{ backgroundColor: uiTheme.elements }}>
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={uiTheme.elements}
                      onChange={(e) => updateUITheme('elements', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600">Accents</span>
                  <div className="relative w-6 h-6 rounded-full border border-gray-200 overflow-hidden shadow-sm" style={{ backgroundColor: uiTheme.accents }}>
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={uiTheme.accents}
                      onChange={(e) => updateUITheme('accents', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            toggleDataPanel();
            if (!isDataPanelOpen) { serializeState(); triggerIOFeedback(); }
          }}
          className={`p-3 mb-4 transition-all duration-300 relative group flex items-center justify-center ${ioFeedback ? 'opacity-30' : 'opacity-100'} hover:brightness-95 rounded-lg`}
          style={{ color: isDataPanelOpen ? uiTheme.accents : uiTheme.elements }}
        >
          <ArrowLeftRight size={24} strokeWidth={1.5} />
          {isDataPanelOpen && <div className="absolute right-0 w-[2px] h-6" style={{ backgroundColor: uiTheme.accents }} />}
        </button>

        <button
          onClick={refreshCanvas}
          className="p-3 mt-4 transition-all hover:rotate-180 duration-700 hover:brightness-95 rounded-lg"
          style={{ color: uiTheme.elements }}
        >
          <RefreshCcw size={24} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
};
