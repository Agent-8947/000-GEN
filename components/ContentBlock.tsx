import React from 'react';
import { Navbar } from './Navbar'; // Исправленный путь
import { Hero } from './Hero';     // Исправленный путь
import { useStore } from '../store';

interface BlockProps {
    block: {
        id: string;
        type: string;
        localOverrides: any;
    };
}

export const ContentBlock: React.FC<BlockProps> = ({ block }) => {
    const { selectedBlockId, setSelectedBlock } = useStore();
    const isSelected = selectedBlockId === block.id;

    const renderContent = () => {
        if (block.type === 'B0101' || block.type === 'Navbar') {
            const { data, layout } = block.localOverrides;
            return <Navbar data={data} layout={layout} />;
        }

        if (block.type === 'B0201' || block.type === 'Hero') {
            return <Hero id={block.id} type={block.type} localOverrides={block.localOverrides} />;
        }

        return (
            <div className="p-20 text-center opacity-20 border border-dashed border-white/10 m-4 rounded-3xl font-mono text-sm uppercase tracking-widest">
                Unknown Architecture Node: {block.type}
            </div>
        );
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation(); // Предотвращает всплытие события к Canvas
                setSelectedBlock(block.id);
            }}
            className={`relative transition-all duration-300 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-inset z-20 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'hover:ring-1 hover:ring-blue-500/30'}`}
        >
            {renderContent()}
        </div>
    );
};