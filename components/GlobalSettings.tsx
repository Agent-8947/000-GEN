
import React, { useState, useRef, useEffect } from 'react';
import { useStore, DNAParameter } from '../store';
import { ChevronDown } from 'lucide-react';

const ParameterRow: React.FC<{ glId: string; param: DNAParameter }> = ({ glId, param }) => {
  const updateParam = useStore(state => state.updateParam);
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startVal = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (param.type !== 'range') return;
    isDragging.current = true;
    startX.current = e.clientX;
    startVal.current = parseFloat(param.value);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
  };

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const delta = e.clientX - startX.current;
      const sensitivity = 0.5;
      const newVal = startVal.current + delta * sensitivity;
      const formattedVal = newVal.toFixed(1);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateParam(glId, param.id, formattedVal);
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
  }, [glId, param.id, updateParam]);

  const renderValue = () => {
    switch (param.type) {
      case 'range':
        return (
          <div
            className="flex items-center gap-3 cursor-ew-resize active:text-blue-500 transition-colors"
            onMouseDown={handleMouseDown}
          >
            <span className="font-mono text-[13px] min-w-[50px] text-right">{param.value}</span>
            <div className="w-20 h-[1px] bg-current opacity-20 relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-current rounded-full"
                style={{ left: `${(parseFloat(param.value) / (param.max ?? 100)) * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
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
            <span className="font-mono text-[13px] opacity-60 uppercase tracking-wider relative z-0">
              {param.value}
            </span>
          </div>
        );
      case 'toggle':
        return (
          <button
            onClick={() => updateParam(glId, param.id, param.value === 'true' ? 'false' : 'true')}
            className={`text-[11px] px-3.5 py-1.5 border rounded-full transition-all font-medium ${param.value === 'true'
              ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
              : 'border-white/20 opacity-40 hover:opacity-100 hover:border-white/40'
              }`}
          >
            {param.value === 'true' ? 'ON' : 'OFF'}
          </button>
        );
      case 'select':
        return (
          <select
            value={param.value}
            onChange={(e) => updateParam(glId, param.id, e.target.value)}
            className="bg-transparent text-[13px] font-mono opacity-60 hover:opacity-100 transition-opacity outline-none cursor-pointer"
          >
            {param.options?.map(opt => (
              <option key={opt} value={opt} className="bg-[#0A0A0A] text-white">{opt}</option>
            ))}
          </select>
        );
      default:
        return <span className="font-mono text-[13px] opacity-60">{param.value}</span>;
    }
  };

  return (
    <div
      className="flex items-center justify-between py-4 group/row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col">
        <span className="text-[9px] font-mono opacity-20 group-hover/row:opacity-40 transition-opacity uppercase tracking-tighter">
          {param.id}
        </span>
        <span className="text-[12px] font-medium tracking-tight opacity-50 group-hover/row:opacity-100 transition-opacity">
          {param.name}
        </span>
        <div className="h-[1px] w-0 group-hover/row:w-full bg-blue-500/50 transition-all duration-300 mt-0.5" />
      </div>
      {renderValue()}
    </div>
  );
};

export const GlobalSettings: React.FC = () => {
  const { globalSettings, uiTheme } = useStore();
  const [activeGroup, setActiveGroup] = useState<string | null>('GL01');

  return (
    <div
      className="w-[380px] h-full border-r animate-[slideIn_0.3s_ease-out] transition-colors duration-500 relative flex flex-col overflow-hidden"
      style={{ backgroundColor: uiTheme.lightPanel, color: uiTheme.fonts, borderColor: uiTheme.elements }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.15);
          border-radius: 10px;
        }
      `}</style>

      <div className="p-8 pb-2">
        <h2 className="font-sans font-medium text-[13px] tracking-[0.4em] uppercase opacity-40 pb-6 select-none flex items-center justify-between">
          <span>DNA_MATRIX_v1.2</span>
          <span className="text-[10px] animate-pulse" style={{ color: uiTheme.accents }}>SYSTEM_CALIBRATED</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-24">
        {Object.entries(globalSettings).map(([id, group]) => {
          const g = group as { name: string; params: DNAParameter[] };
          return (
            <div
              key={id}
              className={`mb-2 rounded-xl transition-all duration-300 border ${activeGroup === id ? 'bg-black/[0.03]' : 'border-transparent'}`}
              style={{ borderColor: activeGroup === id ? uiTheme.elements : 'transparent' }}
            >
              <button
                onClick={() => setActiveGroup(activeGroup === id ? null : id)}
                className="w-full py-6 px-4 flex items-center justify-between group/btn"
              >
                <div className="flex items-center gap-6">
                  <span
                    className="text-[16px] font-mono transition-colors"
                    style={{ color: activeGroup === id ? uiTheme.accents : uiTheme.elements, opacity: activeGroup === id ? 1 : 0.3 }}
                  >
                    {id}
                  </span>
                  <span className={`text-[15px] font-semibold uppercase tracking-[0.15em] transition-all text-current ${activeGroup === id ? 'translate-x-1' : 'opacity-70 group-hover/btn:opacity-100'}`}>
                    {g.name}
                  </span>
                </div>
                <div
                  className={`transition-transform duration-300 ${activeGroup === id ? 'rotate-180' : 'opacity-20'}`}
                  style={{ color: activeGroup === id ? uiTheme.accents : undefined }}
                >
                  <ChevronDown size={18} strokeWidth={1.5} />
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
        className="absolute bottom-0 left-0 right-0 p-6 border-t z-10 flex justify-between items-center opacity-25 text-[10px] font-mono tracking-widest"
        style={{ borderColor: uiTheme.elements }}
      >
        <span>70_SLOTS_INITIALIZED</span>
        <span>BUILD_1.2.0_DNA</span>
      </div>
    </div>
  );
};
