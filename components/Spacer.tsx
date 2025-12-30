
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const Spacer: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl03 = globalSettings['GL03'].params;
    const gl09 = globalSettings['GL09'].params;
    const gridUnit = parseFloat(gl03[0].value);

    const height = localOverrides.layout?.height || (gridUnit * 4).toString();
    const animDuration = parseFloat(gl09[0].value);

    return (
        <motion.div
            id={id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: animDuration }}
            className="w-full flex items-center justify-center relative group"
            style={{ height: `${height}px` }}
        >
            <div className="w-full h-px border-t border-dashed border-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
};
