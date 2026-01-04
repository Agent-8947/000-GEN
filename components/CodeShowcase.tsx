
import React, { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

export const CodeShowcase: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl07 = globalSettings['GL07'].params;
    const gl09 = globalSettings['GL09'].params;

    const textPrim = gl02[3].value;
    const accent = gl02[2].value;
    const border = gl02[5].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const data = localOverrides.data || {
        title: 'Code Showcase',
        description: 'Clean, efficient code examples from my projects',
        snippets: [
            {
                id: '1',
                title: 'React Custom Hook',
                language: 'typescript',
                code: `import { useState, useEffect } from 'react';

export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};`
            },
            {
                id: '2',
                title: 'API Utility Function',
                language: 'javascript',
                code: `const fetchWithRetry = async (url, options = {}, retries = 3) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Request failed');
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};`
            }
        ]
    };

    const layout = localOverrides.layout || { paddingY: '80' };

    const copyToClipboard = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: animEntranceY }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: animDuration }}
            className="w-full px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`
            }}
        >
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    {data.title && (
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black uppercase mb-6"
                            style={{ color: textPrim, fontFamily: 'var(--dna-font-family)' }}
                        >
                            {data.title}
                        </motion.h2>
                    )}
                    {data.description && (
                        <p className="text-lg opacity-50 max-w-2xl mx-auto" style={{ color: textPrim }}>
                            {data.description}
                        </p>
                    )}
                </div>

                {/* Code Snippets */}
                <div className="space-y-8">
                    {data.snippets?.map((snippet: any, index: number) => (
                        <motion.div
                            key={snippet.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: animDuration }}
                            className="relative group"
                        >
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-6 py-4 border-b"
                                style={{
                                    borderColor: border,
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    borderTopLeftRadius: `${gl07[0].value}px`,
                                    borderTopRightRadius: `${gl07[0].value}px`
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <h3
                                        className="font-black uppercase text-sm"
                                        style={{ color: textPrim, fontFamily: 'var(--dna-font-family)' }}
                                    >
                                        {snippet.title}
                                    </h3>
                                    <span
                                        className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
                                        style={{
                                            backgroundColor: `${accent}10`,
                                            color: accent,
                                            borderRadius: `${gl07[0].value}px`
                                        }}
                                    >
                                        {snippet.language}
                                    </span>
                                </div>

                                {/* Copy Button */}
                                <button
                                    onClick={() => copyToClipboard(snippet.code, index)}
                                    className="p-2 opacity-50 hover:opacity-100 transition-opacity"
                                    style={{ color: textPrim }}
                                >
                                    {copiedIndex === index ? (
                                        <Check size={18} style={{ color: accent }} />
                                    ) : (
                                        <Copy size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Code Block */}
                            <div
                                className="border overflow-x-auto"
                                style={{
                                    borderColor: border,
                                    backgroundColor: '#0a0a0a',
                                    borderBottomLeftRadius: `${gl07[0].value}px`,
                                    borderBottomRightRadius: `${gl07[0].value}px`
                                }}
                            >
                                <pre className="p-6 text-sm leading-relaxed">
                                    <code
                                        className="font-mono"
                                        style={{ color: '#e0e0e0' }}
                                    >
                                        {snippet.code}
                                    </code>
                                </pre>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
