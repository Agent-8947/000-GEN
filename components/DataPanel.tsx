import React, { useState } from 'react';
import { useStore } from '../store';
import { X, Globe, FileCode, Upload } from 'lucide-react';

export const DataPanel: React.FC = () => {
  const { uiTheme, toggleDataPanel, exportProjectData, importProjectData } = useStore();
  const [exporting, setExporting] = useState(false);

  const handleExportProductionSite = async () => {
    setExporting(true);

    try {
      const dnaData = exportProjectData();
      const state = JSON.parse(dnaData);

      const getParam = (group: string, id: string) =>
        state.globalSettings?.[group]?.params?.find((p: any) => p.id === id)?.value;

      const bgColor = getParam('GL02', 'P1') || '#09090B';
      const textColor = getParam('GL02', 'P4') || '#FFFFFF';
      const accentColor = getParam('GL02', 'P3') || '#3B82F6';
      const fontFamily = getParam('GL01', 'P8') || 'Inter';
      const containerWidth = getParam('GL03', 'P6') || '1200';
      const radius = getParam('GL07', 'P1') || '8';
      const isSticky = getParam('GL11', 'P1') === 'true';

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DNA Production Site</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@300;400;700;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
      :root {
        --dna-bg: ${bgColor};
        --dna-text: ${textColor};
        --dna-accent: ${accentColor};
        --dna-font: '${fontFamily}', sans-serif;
        --dna-container: ${containerWidth}px;
        --dna-radius: ${radius}px;
      }
      
      body { 
        background: var(--dna-bg); 
        color: var(--dna-text); 
        font-family: var(--dna-font); 
        margin: 0; 
        overflow-x: hidden;
        transition: background 0.4s, color 0.4s;
      }
      
      .container-dna { 
        max-width: var(--dna-container); 
        margin: 0 auto; 
        padding: 0 1.5rem;
      }
      
      .glass-nav { 
        background: rgba(0,0,0,0.8); 
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      /* Light Mode */
      .light-mode { 
        --dna-bg: ${textColor}; 
        --dna-text: ${bgColor}; 
      }
      
      .light-mode .glass-nav {
        background: rgba(255,255,255,0.9);
        border-bottom: 1px solid rgba(0,0,0,0.1);
      }
      
      .light-mode .dna-card {
        background: #F9FAFB;
        border-color: #E5E7EB;
      }
      
      /* Cards */
      .dna-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: var(--dna-radius);
        padding: 2rem;
        transition: all 0.3s;
        height: 100%;
      }
      
      .dna-card:hover {
        background: rgba(255,255,255,0.06);
        transform: translateY(-5px);
        border-color: var(--dna-accent);
      }
      
      /* Images */
      img { 
        display: block; 
        max-width: 100%;
      }
      
      .img-wrapper {
        width: 100%;
        overflow: hidden;
        position: relative;
      }
      
      .img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      /* Buttons */
      .btn-primary {
        padding: 1rem 2.5rem;
        background: var(--dna-accent);
        color: white;
        font-weight: 700;
        border-radius: var(--dna-radius);
        text-transform: uppercase;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        transition: all 0.3s;
        border: none;
        cursor: pointer;
      }
      
      .btn-primary:hover {
        transform: scale(1.05);
      }
      
      .btn-secondary {
        padding: 1rem 2.5rem;
        border: 2px solid currentColor;
        opacity: 0.6;
        border-radius: var(--dna-radius);
        background: transparent;
        cursor: pointer;
        font-weight: 600;
      }
      
      .btn-secondary:hover {
        opacity: 1;
      }
      
      /* Typography */
      .hero-title {
        font-size: clamp(2.5rem, 8vw, 7rem);
        line-height: 0.9;
        font-weight: 900;
        letter-spacing: -0.04em;
      }
      
      /* Gallery Grid */
      .gallery-grid {
        display: grid;
        gap: 1.5rem;
      }
      
      @media (min-width: 768px) {
        .gallery-grid { grid-template-columns: repeat(2, 1fr); }
      }
      
      @media (min-width: 1024px) {
        .gallery-grid { grid-template-columns: repeat(3, 1fr); }
      }
      
      /* Testimonial */
      .testimonial-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: var(--dna-radius);
        padding: 2.5rem;
      }
      
      .testimonial-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
      }
      
      /* Levitation Animation */
      @keyframes levitate {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
        100% { transform: translateY(0px); }
      }
      
      /* Footer */
      .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        justify-content: center;
      }
      
      .footer-links a {
        opacity: 0.6;
        transition: opacity 0.3s;
      }
      
      .footer-links a:hover {
        opacity: 1;
        color: var(--dna-accent);
      }
    </style>
    
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
</head>
<body>
    <div id="root"></div>
    <script>window.__DNA_STATE__ = ${JSON.stringify(state)};</script>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const { motion } = window.Motion;

        // ========================================
        // UTILITIES
        // ========================================
        const SunIcon = () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
        );
        
        const MoonIcon = () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        );

        // IMAGE RENDERER
        const ImageRenderer = ({ src, shape = 'auto', style = {}, levitation = false, levitationSpeed = 3 }) => {
            if (!src) return null;
            
            const isCircle = shape === 'circle';
            const isSquare = shape === 'square';
            const isLandscape = shape === 'landscape';
            const isWide = shape === 'wide';
            
            const borderRadius = isCircle ? '50%' : style.borderRadius || 'var(--dna-radius)';
            const aspectRatio = isCircle || isSquare ? '1/1' 
                              : isLandscape ? '4/3'
                              : isWide ? '16/9'
                              : 'auto';
            
            const animationStyle = levitation ? {
                animation: 'levitate ' + levitationSpeed + 's ease-in-out infinite'
            } : {};
            
            return (
                <div 
                    className="img-wrapper shadow-2xl" 
                    style={{ 
                        aspectRatio, 
                        borderRadius,
                        ...style,
                        ...animationStyle
                    }}
                >
                    <img src={src} alt="Content" loading="lazy" />
                </div>
            );
        };

        // ========================================
        // B01 - NAVBAR
        // ========================================
        const NavbarBlock = ({ block, isSticky, isDark, onToggleTheme }) => {
            const data = block.localOverrides?.data || {};
            const links = data.links || [];
            
            return (
                <nav className={isSticky ? 'fixed top-0 left-0 w-full glass-nav z-50' : 'relative w-full glass-nav'}>
                    <div className="container-dna h-20 flex items-center justify-between">
                        <div className="font-bold text-xl tracking-tighter uppercase">
                            {data.header || data.logoText || "DNA"}
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="hidden md:flex gap-8 opacity-60 text-[10px] font-black uppercase tracking-[0.2em]">
                                {links.map((link, i) => (
                                    <a key={i} href={link.url || '#'} className="hover:text-[var(--dna-accent)] transition-colors">
                                        {link.label || link.text}
                                    </a>
                                ))}
                            </div>
                            <button 
                                onClick={onToggleTheme} 
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 hover:border-[var(--dna-accent)] transition-all"
                            >
                                {isDark ? <SunIcon /> : <MoonIcon />}
                            </button>
                        </div>
                    </div>
                </nav>
            );
        };

        // ========================================
        // B02 - HERO BLOCK
        // ========================================
        const HeroBlock = ({ block, padding }) => {
            const { data = {}, media = {}, style = {} } = block.localOverrides || {};
            const hasImage = media?.showImage && media?.imageUrl;
            
            return (
                <section className={padding + " min-h-[90vh] flex items-center"}>
                    <div className="container-dna">
                        <div className={"grid grid-cols-1 gap-16 items-center " + (hasImage ? "lg:grid-cols-2" : "text-center")}>
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                viewport={{ once: true }}
                            >
                                {data.title && (
                                    <h1 className="hero-title uppercase mb-8" style={{ whiteSpace: 'pre-line' }}>
                                        {data.title}
                                    </h1>
                                )}
                                {data.description && (
                                    <p className="text-xl opacity-60 mb-10 leading-relaxed max-w-2xl" style={{ whiteSpace: 'pre-line' }}>
                                        {data.description}
                                    </p>
                                )}
                                <div className={"flex gap-4 flex-wrap " + (!hasImage ? "justify-center" : "")}>
                                    {data.primaryBtnVisible && (
                                        <button className="btn-primary">
                                            {data.primaryBtnText || "Get Started"}
                                        </button>
                                    )}
                                    {data.secondaryBtnVisible && (
                                        <button className="btn-secondary">
                                            {data.secondaryBtnText || "Learn More"}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                            
                            {hasImage && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }} 
                                    whileInView={{ opacity: 1, scale: 1 }} 
                                    viewport={{ once: true }}
                                    className="flex justify-center lg:justify-end"
                                >
                                    <ImageRenderer 
                                        src={media.imageUrl} 
                                        shape={media.shape} 
                                        style={style}
                                        levitation={media.levitation}
                                        levitationSpeed={media.levitationSpeed || 3}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B03 - SKILLS BLOCK
        // ========================================
        const SkillsBlock = ({ block, padding }) => {
            const { data = {}, layout = {} } = block.localOverrides || {};
            const groups = data.groups || [];
            const isBento = layout.grid === 'bento';
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        {data.title && (
                            <div className="text-center mb-20 max-w-3xl mx-auto">
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-black uppercase mb-6"
                                >
                                    {data.title}
                                </motion.h2>
                                {data.description && (
                                    <p className="text-lg opacity-50 leading-relaxed">
                                        {data.description}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className={isBento ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-12"}>
                            {groups.map((group, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={isBento ? "dna-card" : ""}
                                >
                                    <h3 className="text-2xl font-black uppercase mb-8 text-[var(--dna-accent)]">
                                        {group.title}
                                    </h3>
                                    
                                    <div className="space-y-6">
                                        {group.items?.map((skill, j) => (
                                            <div key={j}>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-bold text-sm uppercase tracking-wide">
                                                        {skill.name}
                                                    </span>
                                                    {data.hidePercentages !== true && (
                                                        <span className="text-sm opacity-50">
                                                            {skill.level}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: \`\${skill.level}%\` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: i * 0.1 + j * 0.05 }}
                                                        className="h-full bg-[var(--dna-accent)] rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B04 - ARTICLE/TEXT BLOCK
        // ========================================
        const ArticleBlock = ({ block, padding }) => {
            const { data = {}, layout = {} } = block.localOverrides || {};
            const sections = data.sections || [];
            const hasIndex = sections.length > 0;
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        <div className="max-w-4xl mx-auto">
                            {data.title && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="mb-12"
                                >
                                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
                                        {data.title}
                                    </h2>
                                    {data.subtitle && (
                                        <p className="text-xl opacity-50 uppercase tracking-[0.2em]">
                                            {data.subtitle}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                            
                            {data.body && (
                                <div className="text-lg opacity-80 leading-relaxed mb-12">
                                    {data.body}
                                </div>
                            )}
                            
                            {hasIndex && (
                                <div className="space-y-8">
                                    {sections.map((section, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="dna-card"
                                        >
                                            <h3 className="text-2xl font-bold mb-4 text-[var(--dna-accent)]">
                                                {section.title}
                                            </h3>
                                            <p className="opacity-70 leading-relaxed">
                                                {section.content}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B04 - GALLERY BLOCK
        // ========================================
        const GalleryBlock = ({ block, padding }) => {
            const { data = {}, media = {} } = block.localOverrides || {};
            const images = data.images || data.gallery || [];
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        <div className="text-center mb-16">
                            <motion.h2 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-4xl md:text-5xl font-black uppercase mb-6"
                            >
                                {data.title || "Gallery"}
                            </motion.h2>
                            {data.description && (
                                <p className="text-lg opacity-50">{data.description}</p>
                            )}
                        </div>

                        <div className="gallery-grid">
                            {images.map((img, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <ImageRenderer 
                                        src={img.url || img.src || img} 
                                        shape="landscape"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B05 - PORTFOLIO/GALLERY BLOCK
        // ========================================
        const PortfolioBlock = ({ block, padding }) => {
            const { data = {}, layout = {} } = block.localOverrides || {};
            const items = data.items || [];
            const columns = layout.columns || '3';
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        {data.title && (
                            <div className="text-center mb-16">
                                <motion.h2 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="text-4xl md:text-5xl font-black uppercase mb-6"
                                >
                                    {data.title || "Portfolio"}
                                </motion.h2>
                                {data.subtitle && (
                                    <p className="text-lg opacity-60 font-medium max-w-2xl mx-auto">{data.subtitle}</p>
                                )}
                            </div>
                        )}

                        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
                            {items.map((item, i) => {
                                const hasLink = item.link && item.link.trim() !== '';
                                const content = (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group cursor-pointer transition-transform duration-300 hover:scale-105"
                                    >
                                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                                            <div className="aspect-video w-full overflow-hidden">
                                                <img 
                                                    src={item.url || item.src || item.imageUrl}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt={item.title || 'Portfolio item'}
                                                />
                                            </div>
                                            
                                            <div className=\"absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300\"></div>
                                            
                                            {item.showPlayButton && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-1">
                                                            <path d="M8 5v14l11-7z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {item.title && (
                                            <div className="mt-4 text-center">
                                                <h3 className="font-bold text-lg uppercase tracking-wide group-hover:text-[var(--dna-accent)] transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                                
                                return hasLink ? (
                                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">
                                        {content}
                                    </a>
                                ) : content;
                            })}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B06 - TIMELINE BLOCK
        // ========================================
        const TimelineBlock = ({ block, padding }) => {
            const { data = {}, layout = {} } = block.localOverrides || {};
            const items = data.items || [];
            const isHorizontal = layout.scrollPath === 'horizontal';
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        {data.title && (
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-black uppercase">
                                    {data.title}
                                </h2>
                            </div>
                        )}
                        
                        <div className={isHorizontal ? "flex gap-12 overflow-x-auto pb-8" : "space-y-12 max-w-3xl mx-auto"}>
                            {items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: isHorizontal ? 30 : 0, y: isHorizontal ? 0 : 20 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={isHorizontal ? "min-w-[300px]" : "flex gap-8"}
                                >
                                    <div className={isHorizontal ? "mb-4" : "flex-shrink-0"}>
                                        <div className="text-2xl font-black text-[var(--dna-accent)]">
                                            {item.date || item.year}
                                        </div>
                                    </div>
                                    <div className={isHorizontal ? "" : "flex-1"}>
                                        <h3 className="text-xl font-bold mb-2 uppercase">
                                            {item.title}
                                        </h3>
                                        <p className="opacity-60 leading-relaxed">
                                            {item.desc || item.description || item.content}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B06 - CTA (Call to Action) BLOCK
        // ========================================
        const CTABlock = ({ block, padding }) => {
            const { data = {}, media = {} } = block.localOverrides || {};
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        <div className="max-w-4xl mx-auto text-center bg-[var(--dna-accent)]/10 border border-[var(--dna-accent)]/20 rounded-3xl p-16">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                {data.title && (
                                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
                                        {data.title}
                                    </h2>
                                )}
                                {data.description && (
                                    <p className="text-xl opacity-70 mb-10">
                                        {data.description}
                                    </p>
                                )}
                                <div className="flex gap-4 justify-center flex-wrap">
                                    {data.primaryBtnVisible && (
                                        <button className="btn-primary">
                                            {data.primaryBtnText || "Get Started"}
                                        </button>
                                    )}
                                    {data.secondaryBtnVisible && (
                                        <button className="btn-secondary">
                                            {data.secondaryBtnText || "Learn More"}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B07 - ACCORDION/FAQ BLOCK
        // ========================================
        const AccordionBlock = ({ block, padding }) => {
            const { data = {} } = block.localOverrides || {};
            const items = data.items || [];
            const [openIndex, setOpenIndex] = useState(null);
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <motion.h2 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-4xl md:text-5xl font-black uppercase mb-6"
                            >
                                {data.title || "FAQ"}
                            </motion.h2>
                        </div>
                        
                        <div className="space-y-4">
                            {items.map((item, i) => (
                                <div key={i} className="dna-card overflow-hidden">
                                    <button 
                                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                        className="w-full text-left p-6 flex justify-between items-center gap-4"
                                    >
                                        <span className="font-bold text-lg">{item.question || item.title}</span>
                                        <span className="text-2xl">{openIndex === i ? '−' : '+'}</span>
                                    </button>
                                    {openIndex === i && (
                                        <div className="px-6 pb-6 opacity-70 leading-relaxed">
                                            {item.answer || item.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B08 - STATS BLOCK
        // ========================================
        const StatsBlock = ({ block, padding }) => {
            const { data = {}, layout = {} } = block.localOverrides || {};
            const stats = data.stats || data.items || [];
            const columns = layout.columns || '3';
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        <div className={\`grid grid-cols-1 md:grid-cols-\${columns} gap-12\`}>
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-5xl md:text-7xl font-black text-[var(--dna-accent)] mb-4">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm uppercase tracking-[0.2em] opacity-50">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B09 - SPACER BLOCK
        // ========================================
        const SpacerBlock = ({ block }) => {
            const { layout = {} } = block.localOverrides || {};
            const height = layout.height || '120';
            
            return <div style={{ height: \`\${height}px\` }} />;
        };

        // ========================================
        // B10 - TABS BLOCK
        // ========================================
        const TabsBlock = ({ block, padding }) => {
            const { data = {} } = block.localOverrides || {};
            const tabs = data.tabs || data.items || [];
            const [activeTab, setActiveTab] = useState(0);
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna max-w-5xl mx-auto">
                        <div className="flex gap-2 mb-12 border-b border-white/10 overflow-x-auto">
                            {tabs.map((tab, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className={\`px-6 py-4 font-bold uppercase text-sm tracking-[0.1em] transition-all \${
                                        activeTab === i 
                                            ? 'border-b-2 border-[var(--dna-accent)] text-[var(--dna-accent)]' 
                                            : 'opacity-50 hover:opacity-100'
                                    }\`}
                                >
                                    {tab.label || tab.title}
                                </button>
                            ))}
                        </div>
                        
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 dna-card"
                        >
                            <div className="text-lg opacity-80 leading-relaxed">
                                {tabs[activeTab]?.content || tabs[activeTab]?.text}
                            </div>
                        </motion.div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B13 - CONTACT FORM BLOCK
        // ========================================
        const ContactFormBlock = ({ block, padding }) => {
            const { data = {} } = block.localOverrides || {};
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <motion.h2 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-4xl md:text-5xl font-black uppercase mb-4"
                            >
                                {data.title || "Contact"}
                            </motion.h2>
                            {data.subtitle && (
                                <p className="opacity-60">{data.subtitle}</p>
                            )}
                        </div>
                        
                        <form className="space-y-6">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg focus:border-[var(--dna-accent)] outline-none transition-colors"
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg focus:border-[var(--dna-accent)] outline-none transition-colors"
                            />
                            <textarea 
                                placeholder="Message" 
                                rows="6"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg focus:border-[var(--dna-accent)] outline-none transition-colors resize-none"
                            />
                            <button type="submit" className="btn-primary w-full">
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>
            );
        };

        // ========================================
        // B14 - FOOTER BLOCK
        // ========================================
        const FooterBlock = ({ block }) => {
            const { data = {} } = block.localOverrides || {};
            const links = data.links || data.footerLinks || [];
            const socialLinks = data.socialLinks || [];
            
            return (
                <footer className="py-16 border-t border-white/10">
                    <div className="container-dna">
                        <div className="text-center mb-8">
                            <div className="text-2xl font-black uppercase mb-4">
                                {data.companyName || data.title || "DNA"}
                            </div>
                            {data.tagline && (
                                <p className="opacity-50 text-sm">{data.tagline}</p>
                            )}
                        </div>
                        
                        {links.length > 0 && (
                            <div className="footer-links mb-8">
                                {links.map((link, i) => (
                                    <a key={i} href={link.url || '#'} className="text-sm">
                                        {link.label || link.text}
                                    </a>
                                ))}
                            </div>
                        )}
                        
                        <div className="text-center text-xs opacity-30">
                            {data.copyright || \`© \${new Date().getFullYear()} All rights reserved\`}
                        </div>
                    </div>
                </footer>
            );
        };

        // ========================================
        // B15 - BADGES BLOCK
        // ========================================
        const BadgesBlock = ({ block, padding }) => {
            const { data = {} } = block.localOverrides || {};
            const tags = data.tags || data.badges || data.items || [];
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {tags.map((tag, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="px-6 py-2 bg-[var(--dna-accent)]/10 border border-[var(--dna-accent)]/20 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-[var(--dna-accent)]"
                                >
                                    {tag.name || tag.label || tag}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B16 - PREVIEW/DEVICE MOCKUP BLOCK
        // ========================================
        const PreviewBlock = ({ block, padding }) => {
            const { data = {}, media = {} } = block.localOverrides || {};
            const previewUrl = data.previewUrl || data.url || media.imageUrl;
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        {data.title && (
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-black uppercase">{data.title}</h2>
                            </div>
                        )}
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-5xl mx-auto"
                        >
                            <ImageRenderer src={previewUrl} shape="wide" />
                        </motion.div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B21 - LOGOS BLOCK
        // ========================================
        const LogosBlock = ({ block, padding }) => {
            const { data = {} } = block.localOverrides || {};
            const items = data.items || data.logos || [];
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
                            {items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-2xl font-black uppercase tracking-wider hover:opacity-100 transition-opacity"
                                >
                                    {item.name || item.label || item}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        const MethodologyBlock = ({ block, padding }) => { const { data = {} } = block.localOverrides || {}; const steps = data.steps || []; return (<section className={padding + " border-b border-white/5"}><div className="container-dna">{data.title && <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-black uppercase mb-4">{data.title}</h2></div>}<div className="max-w-3xl mx-auto space-y-12">{steps.map((step, i) => (<motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-16 border-l-2 border-white/10 pb-12 last:pb-0"><div className="absolute -left-8 top-0 w-14 h-14 rounded-full bg-[var(--dna-accent)] flex items-center justify-center text-black font-black text-xl">{step.number}</div><h3 className="text-2xl font-bold uppercase mb-3">{step.title}</h3><p className="opacity-60 leading-relaxed">{step.description}</p></motion.div>))}</div></div></section>); };
        const TechStackBlock = ({ block, padding }) => { const { data = {} } = block.localOverrides || {}; const categories = data.categories || []; return (<section className={padding + " border-b border-white/5"}><div className="container-dna">{data.title && <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-black uppercase mb-4">{data.title}</h2></div>}<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{categories.map((cat, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="dna-card group"><div className="flex items-center gap-3 mb-4"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div><h3 className="font-bold uppercase text-sm tracking-wider" style={{ color: cat.color }}>{cat.name}</h3></div><div className="flex flex-wrap gap-2">{(cat.technologies || []).map((tech, j) => <span key={j} className="px-3 py-1 bg-white/5 rounded text-xs font-medium opacity-70 hover:opacity-100 transition-opacity">{tech}</span>)}</div></motion.div>))}</div></div></section>); };
        const ProjectsBlock = ({ block, padding }) => { const { data = {}, layout = {} } = block.localOverrides || {}; const type = block.type; if (type === 'B1901') { return (<section className={padding + " border-b border-white/5"}><div className="container-dna"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div><h3 className="text-4xl md:text-6xl font-black uppercase mb-6" style={{ color: 'var(--dna-accent)' }}>{data.projectName || 'Project'}</h3><p className="text-lg opacity-70 mb-8">{data.description}</p><div className="flex gap-2 mb-8">{(data.tags || []).map((t, i) => <span key={i} className="px-3 py-1 border border-white/20 rounded text-xs font-bold uppercase">{t}</span>)}</div><div className="flex gap-4">{data.liveUrl && <a href={data.liveUrl} target="_blank" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform">Live Demo</a>}{data.githubUrl && <a href={data.githubUrl} target="_blank" className="px-8 py-4 border border-white/20 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors">GitHub</a>}</div></div><div><img src={data.image} alt={data.projectName} className="w-full rounded-lg border border-white/10" /></div></div></div></section>); } if (type === 'B1902') { return (<section className={padding + " border-b border-white/5"}><div className="container-dna"><h2 className="text-4xl font-black uppercase mb-12">{data.title || 'Projects'}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-8">{(data.projects || []).map((p, i) => <div key={i} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden"><div className="aspect-video overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div><div className="p-8"><h3 className="text-2xl font-bold uppercase mb-3">{p.name}</h3><p className="opacity-60 text-sm">{p.description}</p></div></div>)}</div></div></section>); } if (type === 'B1903') { return (<section className={padding + " border-b border-white/5"}><div className="container-dna"><h2 className="text-4xl font-black uppercase mb-12">{data.title || 'Code'}</h2><div className="space-y-6">{(data.snippets || []).map((s, i) => <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-[#0D1117]"><div className="px-4 py-3 border-b border-white/5"><span className="text-xs font-mono opacity-50">{s.title}</span></div><div className="p-6"><pre><code className="font-mono text-sm text-gray-300">{s.code}</code></pre></div></div>)}</div></div></section>); } return null; };

        // ========================================
        // B22 - TESTIMONIALS/REVIEWS BLOCK (Enhanced)
        // ========================================
        const ReviewsBlock = ({ block, padding }) => {
            const { data = {}, layout = {} } = block.localOverrides || {};
            const items = data.items || data.testimonials || data.reviews || [];
            const columns = layout.columns || '2';
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        {data.title && (
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-black uppercase">
                                    {data.title}
                                </h2>
                            </div>
                        )}
                        
                        <div className={\`grid grid-cols-1 md:grid-cols-\${columns} gap-8\`}>
                            {items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="testimonial-card"
                                >
                                    <p className="mb-6 opacity-70 italic leading-relaxed text-lg">
                                        "{item.quote || item.text || item.content}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {item.avatar && (
                                            <div className="testimonial-avatar">
                                                <img src={item.avatar} alt={item.name} />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-[var(--dna-accent)]">
                                                {item.name || "Anonymous"}
                                            </div>
                                            <div className="text-sm opacity-50">
                                                {item.role || item.position || "Customer"}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // B24 - SOCIAL DOCK BLOCK
        // ========================================
        const SocialDockBlock = ({ block, padding }) => {
            const { data = {} } = block.localOverrides || {};
            const socials = data.socials || data.links || data.items || [];
            
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna">
                        <div className="flex gap-6 justify-center">
                            {socials.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.url || '#'}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--dna-accent)] hover:border-[var(--dna-accent)] transition-all"
                                >
                                    <span className="text-sm font-bold">
                                        {social.icon || social.name?.charAt(0) || '•'}
                                    </span>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // ========================================
        // UNIVERSAL FALLBACK BLOCK
        // ========================================
        const UniversalBlock = ({ block, padding }) => {
            const { data = {}, media = {}, style = {} } = block.localOverrides || {};
            const items = data.items || data.sections || [];
            const hasImage = media?.showImage && media?.imageUrl;
            
            // If has items - render as grid
            if (items.length > 0) {
                return <FeaturesBlock block={block} padding={padding} />;
            }
            
            // If has image - render as split layout
            if (hasImage) {
                return (
                    <section className={padding + " border-b border-white/5"}>
                        <div className="container-dna">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    {data.title && (
                                        <h2 className="text-4xl font-black uppercase mb-6">
                                            {data.title}
                                        </h2>
                                    )}
                                    {data.description && (
                                        <p className="text-lg opacity-60 leading-relaxed">
                                            {data.description}
                                        </p>
                                    )}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                >
                                    <ImageRenderer src={media.imageUrl} shape={media.shape} style={style} />
                                </motion.div>
                            </div>
                        </div>
                    </section>
                );
            }
            
            // Text-only layout
            return (
                <section className={padding + " border-b border-white/5"}>
                    <div className="container-dna text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            {data.title && (
                                <h2 className="text-4xl md:text-5xl font-black uppercase mb-8 text-[var(--dna-accent)]">
                                    {data.title}
                                </h2>
                            )}
                            {data.description && (
                                <p className="text-xl opacity-60 leading-relaxed">
                                    {data.description}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </section>
            );
        };

        // ========================================
        // BLOCK RENDERER (SMART ROUTING)
        // ========================================
        const BlockRenderer = ({ block, index, isStickyNav, isDark, onToggleTheme }) => {
            const type = block.type || '';
            
            // Calculate padding
            const isFirstBlock = index === 0 && !isStickyNav;
            const isSecondWithSticky = index === 1 && isStickyNav;
            const padding = isFirstBlock || isSecondWithSticky ? 'pt-32 pb-24' : 'py-24';
            
            // Route to appropriate block component
            if (type.startsWith('B01')) {
                return <NavbarBlock block={block} isSticky={isStickyNav} isDark={isDark} onToggleTheme={onToggleTheme} />;
            }
            if (type.startsWith('B02')) {
                return <HeroBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B03')) {
                return <SkillsBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B04')) {
                return <ArticleBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B05')) {
                return <PortfolioBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B06')) {
                return <TimelineBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B07')) {
                return <AccordionBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B08')) {
                return <StatsBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B09')) {
                return <SpacerBlock block={block} />;
            }
            if (type.startsWith('B10')) {
                return <TabsBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B13')) {
                return <ContactFormBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B14')) {
                return <FooterBlock block={block} />;
            }
            if (type.startsWith('B15')) {
                return <BadgesBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B16')) {
                return <PreviewBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B21')) {
                return <LogosBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B22')) {
                return <ReviewsBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B17')) {
                return <MethodologyBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B18')) {
                return <TechStackBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B19')) {
                return <ProjectsBlock block={block} padding={padding} />;
            }
            if (type.startsWith('B24')) {
                return <SocialDockBlock block={block} padding={padding} />;
            }
            
            // Fallback to universal block
            return <UniversalBlock block={block} padding={padding} />;
        };

        // ========================================
        // MAIN APP
        // ========================================
        const App = () => {
            const [isDark, setIsDark] = useState(() => {
                const saved = localStorage.getItem('dna-theme');
                return saved ? saved === 'dark' : true;
            });

            useEffect(() => {
                localStorage.setItem('dna-theme', isDark ? 'dark' : 'light');
                document.body.className = isDark ? '' : 'light-mode';
            }, [isDark]);

            const state = window.__DNA_STATE__;
            const blocks = state.pages?.home || [];
            const visibleBlocks = blocks.filter(b => b.isVisible);

            return (
                <main>
                    {visibleBlocks.map((block, idx) => (
                        <BlockRenderer 
                            key={block.id} 
                            block={block} 
                            index={idx} 
                            isStickyNav={${isSticky}}
                            isDark={isDark}
                            onToggleTheme={() => setIsDark(!isDark)}
                        />
                    ))}
                </main>
            );
        };

        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      a.click();
      URL.revokeObjectURL(url);

      setTimeout(() => alert('✅ Site exported successfully!'), 500);

    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Export failed. Check console.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = () => {
    try {
      const dnaData = exportProjectData();
      const blob = new Blob([dnaData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dna-project.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export JSON');
    }
  };

  const handleImportJSON = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            importProjectData(json);
            alert('✅ Project imported successfully!');
          } catch (error) {
            alert('❌ Failed to import JSON. Invalid file format.');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    } catch (error) {
      alert('Failed to import JSON');
    }
  };

  return (
    <div className="w-[360px] h-full border-l flex flex-col" style={{ backgroundColor: uiTheme.lightPanel }}>
      <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: uiTheme.elements }}>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Production Hub</span>
        <button onClick={toggleDataPanel} className="opacity-20 hover:opacity-100 transition-opacity">
          <X size={18} />
        </button>
      </div>

      <div className="p-8 flex-1 space-y-4">
        <button
          onClick={handleExportProductionSite}
          disabled={exporting}
          className="w-full p-12 bg-blue-500/10 border-2 border-blue-500/20 rounded-[40px] flex flex-col items-center gap-6 hover:bg-blue-500/20 transition-all group disabled:opacity-50"
        >
          <Globe size={48} className="text-blue-500 group-hover:scale-110 transition-transform" />
          <div className="text-center">
            <div className="text-[14px] font-black uppercase text-blue-500 tracking-[0.2em]">
              {exporting ? 'Exporting...' : 'Export HTML Site'}
            </div>
            <div className="text-[8px] opacity-40 uppercase mt-2">Universal v25.0</div>
          </div>
        </button>

        <button
          onClick={handleExportJSON}
          className="w-full p-8 bg-green-500/10 border-2 border-green-500/20 rounded-[24px] flex items-center gap-4 hover:bg-green-500/20 transition-all"
        >
          <FileCode size={32} className="text-green-500" />
          <div className="text-left flex-1">
            <div className="text-[12px] font-bold text-green-500 uppercase">Export JSON</div>
            <div className="text-[8px] opacity-40 mt-1">Project data</div>
          </div>
        </button>

        <button
          onClick={handleImportJSON}
          className="w-full p-8 bg-purple-500/10 border-2 border-purple-500/20 rounded-[24px] flex items-center gap-4 hover:bg-purple-500/20 transition-all"
        >
          <Upload size={32} className="text-purple-500" />
          <div className="text-left flex-1">
            <div className="text-[12px] font-bold text-purple-500 uppercase">Import JSON</div>
            <div className="text-[8px] opacity-40 mt-1">Load project</div>
          </div>
        </button>

        <div className="mt-8 p-4 bg-white/5 rounded-lg">
          <div className="text-[10px] font-bold uppercase mb-2 text-green-400">✅ Supported Blocks:</div>
          <ul className="text-[9px] opacity-60 space-y-1 leading-relaxed">
            <li>• B01 - Navbar</li>
            <li>• B02 - Hero</li>
            <li>• B03 - Features/Services</li>
            <li>• B04 - Gallery</li>
            <li>• B05 - Testimonials</li>
            <li>• B06 - CTA</li>
            <li>• B07 - Footer</li>
            <li>• Universal fallback</li>
          </ul>
        </div>
      </div>
    </div>
  );
};