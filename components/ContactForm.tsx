
import React, { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const ContactForm: React.FC<{ id: string, localOverrides: any }> = ({ id, localOverrides }) => {
    const { globalSettings } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl09 = globalSettings['GL09'].params;

    const textPrim = gl02[3].value;
    const accent = gl02[2].value;
    const border = gl02[5].value;

    // GL09 Animations
    const animDuration = parseFloat(gl09[0].value);
    const animEntranceY = parseFloat(gl09[2].value);

    const data = localOverrides.data || {
        title: 'Get in Touch',
        subtitle: 'Our team will respond within 24 hours.',
        telegramBotToken: '',
        telegramChatId: ''
    };
    const layout = localOverrides.layout || { paddingY: '80' };

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.telegramBotToken || !data.telegramChatId) {
            alert('⚠️ Telegram bot not configured. Please add Bot Token and Chat ID in the Property Inspector.');
            return;
        }

        setStatus('sending');

        const message = `🔔 New Contact Form Submission\n\n` +
            `👤 Name: ${formData.name}\n` +
            `📧 Email: ${formData.email}\n` +
            `💬 Message:\n${formData.message}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${data.telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: data.telegramChatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const result = await response.json();

            if (result.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                console.error('Telegram API error:', result);
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            setStatus('error');
            console.error('Failed to send message:', error);
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section
            id={id}
            className="w-full px-6"
            style={{
                paddingTop: `${layout.paddingY}px`,
                paddingBottom: `${layout.paddingY}px`,
                fontFamily: 'var(--dna-font-family)'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: animEntranceY }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: animDuration }}
                className="max-w-2xl mx-auto text-center mb-12"
            >
                <h2 className="text-4xl font-black uppercase tracking-tight mb-4" style={{ color: textPrim }}>{data.title}</h2>
                <p className="text-sm opacity-60 uppercase tracking-widest" style={{ color: textPrim }}>{data.subtitle}</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: animDuration, delay: 0.2 }}
                className="max-w-xl mx-auto space-y-4"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="w-full bg-black/[0.02] border p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-black/5"
                        style={{ borderColor: border, borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        className="w-full bg-black/[0.02] border p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-black/5"
                        style={{ borderColor: border, borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <textarea
                    className="w-full bg-black/[0.02] border p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-black/5 h-32"
                    style={{ borderColor: border, borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                />
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-5 text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50"
                    style={{ backgroundColor: accent, color: 'white', borderRadius: `${globalSettings['GL07'].params[0].value}px` }}
                >
                    {status === 'sending' ? 'Sending...' : status === 'success' ? '✓ Sent!' : status === 'error' ? '✗ Error' : 'Send Message'}
                </button>
            </motion.form>
        </section>
    );
};
