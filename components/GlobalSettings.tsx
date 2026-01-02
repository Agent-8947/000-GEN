
import React, { useState, useRef, useEffect } from 'react';
import { useStore, DNAParameter } from '../store';
import { ChevronDown, GripHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const ParameterRow: React.FC<{ glId: string; param: DNAParameter }> = ({ glId, param }) => {
  const updateParam = useStore(state => state.updateParam);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startVal = useRef(0);

  const [localVal, setLocalVal] = useState(param.value);

  // Auto Contrast Logic
  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 136 ? '#000000' : '#FFFFFF';
  };
  const textColor = param.type === 'color' ? getContrastColor(param.value) : undefined;

  useEffect(() => {
    if (!isDragging) {
      setLocalVal(param.value);
    }
  }, [param.value, isDragging]);

  const handleCommit = () => {
    let val = parseFloat(localVal);
    if (isNaN(val)) val = parseFloat(param.value);
    const clamped = Math.max(param.min ?? 0, Math.min(param.max ?? 100, val)).toFixed(2);
    updateParam(glId, param.id, clamped);
    setLocalVal(clamped);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (param.type !== 'range') return;
    setIsDragging(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
    startVal.current = parseFloat(param.value);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'all-scroll';
  };

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX.current;
      const deltaY = startY.current - e.clientY;
      const totalDelta = deltaX + deltaY;
      const sensitivity = 0.2;
      const newVal = startVal.current + totalDelta * sensitivity;
      const formattedVal = newVal.toFixed(2);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateParam(glId, param.id, formattedVal);
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
  }, [glId, param.id, updateParam, isDragging]);

  const renderValue = () => {
    switch (param.type) {
      case 'range':
        return (
          <div className="flex items-center gap-3 transition-colors">
            <input
              className="bg-transparent border-none outline-none text-right font-mono text-sm w-[60px] focus:text-blue-500 placeholder:opacity-20 transition-colors"
              value={localVal}
              onChange={(e) => setLocalVal(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ color: isDragging ? useStore.getState().uiTheme.accents : undefined }}
            />
            <div
              className="flex items-center gap-3 cursor-all-scroll group/scrub"
              onMouseDown={handleMouseDown}
            >
              <div className="w-20 h-[1px] bg-current opacity-20 relative group-hover/scrub:opacity-40 transition-opacity">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-current rounded-full transition-shadow ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
                  style={{
                    left: `${((parseFloat(param.value) || 0) - (param.min ?? 0)) / (Math.max(1, (param.max ?? 100) - (param.min ?? 0))) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    color: isDragging ? useStore.getState().uiTheme.accents : undefined,
                    boxShadow: isDragging ? `0 0 10px ${useStore.getState().uiTheme.accents}40` : undefined
                  }}
                />
              </div>
            </div>
          </div>
        );
      case 'color':
        return (
          <div className="flex items-center gap-3 relative">
            <input
              type="color"
              value={param.value}
              onChange={(e) => updateParam(glId, param.id, e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="w-6 h-6 border border-black/10 rounded-full shadow-sm"
              style={{ backgroundColor: param.value }}
            />
            <span className="font-mono text-sm uppercase tracking-wider relative z-0" style={{ color: textColor }}>
              {param.value}
            </span>
          </div>
        );
      case 'toggle':
        const isTrue = param.value === 'true';
        return (
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold tracking-widest transition-opacity ${isTrue ? 'opacity-100' : 'opacity-20'}`} style={{ color: isTrue ? useStore.getState().uiTheme.accents : undefined }}>
              ON
            </span>
            <button
              onClick={() => updateParam(glId, param.id, isTrue ? 'false' : 'true')}
              className={`w-10 h-5 rounded-full transition-all relative flex items-center px-1 ${isTrue ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/10 opacity-40 hover:opacity-100'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${isTrue ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        );
      case 'select':
        return (
          <select
            value={param.value}
            onChange={(e) => updateParam(glId, param.id, e.target.value)}
            className="bg-transparent text-sm font-mono opacity-60 hover:opacity-100 transition-opacity outline-none cursor-pointer"
          >
            {param.options?.map(opt => (
              <option key={opt} value={opt} className="bg-[#0A0A0A] text-white">{opt}</option>
            ))}
          </select>
        );
      default:
        return <span className="font-mono text-sm opacity-60">{param.value}</span>;
    }
  };

  return (
    <div
      className="flex items-center justify-between py-4 group/row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col">
        <span className="text-xs font-mono opacity-20 group-hover/row:opacity-40 transition-opacity uppercase tracking-tighter">
          {param.id}
        </span>
        <span className="text-sm font-medium tracking-tight opacity-50 group-hover/row:opacity-100 transition-opacity">
          {param.name}
        </span>
        <div className="h-[1px] w-0 group-hover/row:w-full bg-blue-500/50 transition-all duration-300 mt-0.5" />
      </div>
      {renderValue()}
    </div>
  );
};

export const GlobalSettings: React.FC = () => {
  const { globalSettings, uiTheme, updatePanelPosition } = useStore();
  const [activeGroup, setActiveGroup] = useState<string | null>('GL01');

  // Panel State
  const posX = uiTheme.panelX || 0;
  const posY = uiTheme.panelY || 0;
  const isFloating = uiTheme.isFloating;

  return (
    <motion.div
      drag={isFloating}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updatePanelPosition(posX + info.offset.x, posY + info.offset.y);
      }}
      initial={{ x: isFloating ? posX : -380, opacity: 0 }}
      animate={{ x: isFloating ? posX : 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-[380px] h-full border-r transition-colors duration-500 relative flex flex-col overflow-hidden global-settings z-50 shadow-2xl"
      style={{
        backgroundColor: uiTheme.lightPanel,
        color: uiTheme.fonts,
        borderColor: uiTheme.elements,
        borderRightWidth: 'var(--ui-stroke-width)',
        position: isFloating ? 'fixed' : 'relative',
        top: isFloating ? 0 : 'auto',
        left: isFloating ? 0 : 'auto',
        bottom: isFloating ? 'auto' : 0,
        height: isFloating ? '85vh' : '100%',
        marginTop: isFloating ? '80px' : '0',
        marginLeft: isFloating ? '20px' : '0',
        borderRadius: isFloating ? '16px' : '0'
      }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.15);
          border-radius: 10px;
        }
      `}</style>

      <div className="p-8 pb-2 cursor-grab active:cursor-grabbing group/header">
        <div className="flex items-center justify-between opacity-40 group-hover/header:opacity-100 transition-opacity mb-4">
          <GripHorizontal size={20} />
          <span className="text-[10px] font-mono opacity-50">DRAG_HANDLE</span>
        </div>
        <h2 className="font-sans font-medium text-sm tracking-[0.4em] uppercase opacity-40 pb-6 select-none flex items-center justify-between">
          <span>DNA_MATRIX_v1.2</span>
          <span className="text-xs animate-pulse" style={{ color: uiTheme.accents }}>SYSTEM_CALIBRATED</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-5 pb-24">
        {Object.entries(globalSettings).map(([id, group]) => {
          const g = group as { name: string; params: DNAParameter[] };
          return (
            <div
              key={id}
              className={`mb-2 rounded-xl transition-all duration-300 border ${activeGroup === id ? 'bg-black/[0.03]' : 'border-transparent'}`}
              style={{
                borderColor: activeGroup === id ? uiTheme.elements : 'transparent',
                borderWidth: activeGroup === id ? 'var(--ui-stroke-width)' : '0px'
              }}
            >
              <button
                onClick={() => setActiveGroup(activeGroup === id ? null : id)}
                className="w-full py-6 px-4 flex items-center justify-between group/btn"
              >
                <div className="flex items-center gap-6">
                  <span
                    className="text-lg font-mono transition-colors"
                    style={{ color: activeGroup === id ? uiTheme.accents : uiTheme.elements, opacity: activeGroup === id ? 1 : 0.3 }}
                  >
                    {id}
                  </span>
                  <span className={`text-base font-semibold uppercase tracking-[0.15em] transition-all text-current ${activeGroup === id ? 'translate-x-1' : 'opacity-70 group-hover/btn:opacity-100'}`}>
                    {g.name}
                  </span>
                </div>
                <div
                  className={`transition-transform duration-300 ${activeGroup === id ? 'rotate-180' : 'opacity-20'}`}
                  style={{ color: activeGroup === id ? uiTheme.accents : undefined }}
                >
                  <ChevronDown size={22} strokeWidth={1.5} />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${activeGroup === id ? 'max-h-[800px] opacity-100 px-6 pb-6' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="space-y-1">
                  {g.params.map(param => (
                    <ParameterRow key={param.id} glId={id} param={param} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 p-6 border-t z-10 flex justify-between items-center opacity-25 text-xs font-mono tracking-widest"
        style={{ borderColor: uiTheme.elements, borderTopWidth: 'var(--ui-stroke-width)' }}
      >
        <span>70_SLOTS_INITIALIZED</span>
        <span>BUILD_1.2.0_DNA</span>
      </div>
    </motion.div>
  );
};
