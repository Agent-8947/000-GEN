
import React, { useEffect } from 'react';
import { useStore } from '../store';
import { ContentBlock } from './ContentBlock';

export const Canvas: React.FC = () => {
  const { contentBlocks, viewportMode, cycleGrid, gridMode, globalSettings, selectedBlockId } = useStore();
  const isDark = globalSettings['GL10']?.params[6]?.value === 'Dark';
  const isMobile = viewportMode === 'mobile';

  useEffect(() => {
    if (selectedBlockId) {
      const element = document.getElementById(selectedBlockId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedBlockId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        cycleGrid();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleGrid]);

  const gridColor = isDark ? 'text-white/[0.04]' : 'text-black/[0.06]';
  const globalBg = globalSettings.GL02.params[0].value;

  return (
    <div className={`flex-1 h-full relative overflow-hidden ${gridColor} transition-colors duration-500 flex flex-col items-center`}>
      <div className={`flex-1 w-full overflow-hidden transition-all duration-700 ${isMobile ? 'pb-12 perspective-[1500px]' : ''}`}>
        <div
          style={{
            backgroundColor: globalBg,
            fontSize: '16px'
          }}
          className={`relative transition-all duration-700 ease-in-out origin-top mx-auto overflow-y-auto overflow-x-hidden ${isMobile
            ? 'w-[375px] h-[667px] border-[10px] border-[#1A1A1A] rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]'
            : 'w-full h-full'
            }`}
        >
          {isMobile && (
            <div className="sticky top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-2xl z-[100] mb-[-24px]" />
          )}

          <div className="w-full flex flex-col min-h-full relative z-10">
            {gridMode !== 'off' && (
              <div
                className="absolute inset-x-0 h-full pointer-events-none z-50 mx-auto"
                style={{
                  width: isMobile ? '100%' : `${globalSettings.GL03.params[5].value}px`,
                  display: gridMode === 'rows' ? 'block' : 'grid',
                  gridTemplateColumns: gridMode === 'columns' ? 'repeat(12, 1fr)' : gridMode === 'mobile' ? 'repeat(4, 1fr)' : 'none',
                  gap: `${globalSettings.GL03.params[1].value}px`
                }}
              >
                {gridMode === 'rows' ? (
                  <div className="w-full h-full" style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
                    backgroundSize: `100% ${globalSettings.GL03.params[0].value || 8}px`
                  }} />
                ) : (
                  [...Array(gridMode === 'columns' ? 12 : 4)].map((_, i) => (
                    <div key={i} className="bg-red-500/5 border-x border-red-500/10 h-full" />
                  ))
                )}
              </div>
            )}

            {contentBlocks.map(block => (
              <ContentBlock key={block.id} {...block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
