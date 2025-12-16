import React, { useState, useEffect, useRef } from 'react';
import { Slide, Theme, TransitionType } from '../types';
import { TRANSITION_OPTIONS } from '../constants';
import { ChevronLeft, ChevronRight, Edit3, Trash2, Bold, Italic, Underline, Plus, X, Check, MonitorPlay, Play, Settings2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface PreviewSectionProps {
  slides: Slide[];
  theme: Theme;
  onUpdateSlide: (index: number, updatedSlide: Slide) => void;
  onDeleteSlide: (index: number) => void;
  onPlay: () => void;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  slides,
  theme,
  onUpdateSlide,
  onDeleteSlide,
  onPlay,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  const [previewAnimation, setPreviewAnimation] = useState<TransitionType | null>(null);

  // Monitor selection to update toolbar state
  useEffect(() => {
    if (!isEditing) return;

    const checkFormats = () => {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline')
      });
    };

    document.addEventListener('selectionchange', checkFormats);
    return () => document.removeEventListener('selectionchange', checkFormats);
  }, [isEditing]);

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(slides.length - 1);
    }
  }, [slides.length, currentIndex]);

  // Clear preview animation after duration
  useEffect(() => {
    if (previewAnimation) {
      const timer = setTimeout(() => setPreviewAnimation(null), 800);
      return () => clearTimeout(timer);
    }
  }, [previewAnimation]);

  if (slides.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-4 sm:p-8 border-2 border-dashed border-slate-300 rounded-3xl bg-white/50">
          <div className="w-20 h-20 mb-6 bg-surface-100 rounded-full flex items-center justify-center animate-pulse">
            <MonitorPlay size={40} className="text-slate-300 ml-1" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Ready for your ideas</h3>
          <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">Fill in the details on the left and hit generate to see your slides come to life here.</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSlide(currentIndex, { ...currentSlide, title: e.target.value });
  };

  const handleContentChange = (index: number, val: string) => {
    const newContent = [...currentSlide.content];
    newContent[index] = val;
    onUpdateSlide(currentIndex, { ...currentSlide, content: newContent });
  };

  const addPoint = () => {
      onUpdateSlide(currentIndex, { ...currentSlide, content: [...currentSlide.content, 'New Point'] });
  };
  
  const removePoint = (idx: number) => {
      const newContent = currentSlide.content.filter((_, i) => i !== idx);
      onUpdateSlide(currentIndex, { ...currentSlide, content: newContent });
  };

  const executeCommand = (command: string) => {
    document.execCommand(command, false);
    setActiveFormats(prev => ({ ...prev, [command]: !prev[command as keyof typeof prev] }));
  };
  
  const handleTransitionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newVal = e.target.value as TransitionType;
      onUpdateSlide(currentIndex, { ...currentSlide, transition: newVal });
      
      // Trigger preview
      setPreviewAnimation(null);
      requestAnimationFrame(() => {
          setTimeout(() => setPreviewAnimation(newVal), 10);
      });
  };

  const getAnimationStyles = (type: TransitionType | null): React.CSSProperties => {
      if (!type || type === 'none') return {};
      switch (type) {
          case 'fade': return { animation: 'preview-fade 0.6s ease-in-out' };
          case 'push': return { animation: 'preview-push 0.6s ease-in-out' };
          case 'wipe': return { animation: 'preview-wipe 0.6s cubic-bezier(0.4, 0, 0.2, 1)' };
          case 'cover': return { animation: 'preview-cover 0.6s ease-out' };
          case 'uncover': return { animation: 'preview-uncover 0.6s ease-out' };
          default: return {};
      }
  };

  const slideStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
  };

  const titleStyle: React.CSSProperties = {
    color: theme.colors.primary,
    fontFamily: theme.fonts.heading,
  };

  const animationKeyframes = `
    @keyframes preview-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes preview-push { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes preview-wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
    @keyframes preview-cover { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes preview-uncover { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;

  return (
    <div className="flex flex-col h-full gap-6">
      <style>{animationKeyframes}</style>
      
      {/* Top Controls Bar */}
      <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-slate-200/50 mx-2 sm:mx-4 lg:mx-10 mt-2 z-20 flex-wrap gap-2">
        <div className="flex items-center gap-3 pl-2">
          <div className="bg-slate-100 text-slate-500 font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide">
             Slide
          </div>
          <span className="text-sm font-semibold text-slate-700">
             {currentIndex + 1} <span className="text-slate-300 mx-1">/</span> {slides.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
             <button
                onClick={onPlay}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-all font-medium text-sm mr-2"
                title="Play Presentation"
            >
                <Play size={16} className="fill-current" />
                <span className="hidden sm:inline">Play</span>
            </button>

            {isEditing && (
                <div className="flex items-center gap-2 mr-2 border-r border-slate-200 pr-3">
                     <Settings2 size={14} className="text-slate-400" />
                     <select 
                        value={currentSlide.transition || ''} 
                        onChange={handleTransitionChange}
                        className="text-xs font-medium text-slate-600 bg-transparent border-none outline-none cursor-pointer focus:ring-0"
                        title="Slide Transition"
                     >
                         <option value="">Default Transition</option>
                         {TRANSITION_OPTIONS.map(opt => (
                             <option key={opt.value} value={opt.value}>{opt.label}</option>
                         ))}
                     </select>
                </div>
            )}

            <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium text-sm border ${
                    isEditing 
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
            >
                {isEditing ? <><Check size={14} strokeWidth={3} /> Done</> : <><Edit3 size={14} /> Edit</>}
            </button>
             <div className="w-px h-6 bg-slate-200 mx-1"></div>
             <button 
                onClick={() => onDeleteSlide(currentIndex)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete Slide"
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="flex-1 flex items-center justify-center relative min-h-0">
        <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 sm:left-2 lg:left-4 z-20 p-2 sm:p-3 bg-white hover:bg-slate-50 rounded-full shadow-float border border-slate-100 text-slate-700 disabled:opacity-0 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95 group"
        >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button 
            onClick={handleNext}
            disabled={currentIndex === slides.length - 1}
            className="absolute right-0 sm:right-2 lg:right-4 z-20 p-2 sm:p-3 bg-white hover:bg-slate-50 rounded-full shadow-float border border-slate-100 text-slate-700 disabled:opacity-0 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95 group"
        >
            <ChevronRight size={20} className="sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="relative w-full max-w-4xl px-8 sm:px-12 md:px-16 perspective-1000">
            <div 
                className="w-full aspect-video shadow-2xl rounded-xl overflow-hidden flex flex-col p-4 sm:p-8 lg:p-12 relative transition-transform duration-500 bg-white ring-1 ring-black/5"
                style={{
                     ...slideStyle,
                     transform: 'rotateX(0deg) translateZ(0)',
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.02)',
                     ...getAnimationStyles(previewAnimation)
                }}
            >
                {/* Formatting Toolbar */}
                {isEditing && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white border border-slate-200 shadow-xl rounded-lg p-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
                      className={`p-1.5 rounded transition-colors ${activeFormats.bold ? 'bg-primary-100 text-primary-700' : 'hover:bg-slate-100 text-slate-600'}`} 
                      title="Bold (Ctrl+B)"
                    >
                      <Bold size={16} strokeWidth={activeFormats.bold ? 3 : 2} />
                    </button>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
                      className={`p-1.5 rounded transition-colors ${activeFormats.italic ? 'bg-primary-100 text-primary-700' : 'hover:bg-slate-100 text-slate-600'}`} 
                      title="Italic (Ctrl+I)"
                    >
                      <Italic size={16} strokeWidth={activeFormats.italic ? 3 : 2} />
                    </button>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
                      className={`p-1.5 rounded transition-colors ${activeFormats.underline ? 'bg-primary-100 text-primary-700' : 'hover:bg-slate-100 text-slate-600'}`} 
                      title="Underline (Ctrl+U)"
                    >
                      <Underline size={16} strokeWidth={activeFormats.underline ? 3 : 2} />
                    </button>
                  </div>
                )}

                {/* Slide Header */}
                <div className="mb-3 sm:mb-6 border-b-2 border-transparent relative group min-h-[2.5rem] sm:min-h-[4rem]">
                    {isEditing ? (
                        <input 
                            value={currentSlide.title}
                            onChange={handleTitleChange}
                            className="w-full text-lg sm:text-3xl lg:text-4xl font-bold bg-transparent border-b-2 border-primary-500/20 focus:border-primary-500 outline-none pb-2 placeholder-slate-300 transition-colors"
                            style={titleStyle}
                            placeholder="Slide Title"
                        />
                    ) : (
                        <h2 className="text-lg sm:text-3xl lg:text-4xl font-bold pb-2 sm:pb-4 leading-tight" style={titleStyle}>
                            {currentSlide.title}
                        </h2>
                    )}
                </div>

                {/* Content Area with Flex for Image + Text */}
                <div className="flex-1 overflow-hidden flex flex-col sm:flex-row gap-4 sm:gap-8">
                     {/* Text Section */}
                     <div className={`flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col`}>
                        <ul className="space-y-2 sm:space-y-4">
                            {currentSlide.content.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-4 group/item">
                                    <span className="mt-2.5 w-2 h-2 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: theme.colors.secondary }}></span>
                                    {isEditing ? (
                                        <div className="flex-1 flex gap-2 items-start relative">
                                            <RichTextEditor
                                                html={point}
                                                onChange={(val) => handleContentChange(idx, val)}
                                                style={{ color: theme.colors.text }}
                                            />
                                            <button 
                                                onClick={() => removePoint(idx)} 
                                                className="absolute -right-8 top-1 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover/item:opacity-100 transition-all"
                                                title="Remove Point"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="text-sm sm:text-lg lg:text-xl leading-relaxed opacity-90 font-medium"
                                            dangerouslySetInnerHTML={{ __html: point }}
                                        />
                                    )}
                                </li>
                            ))}
                            {isEditing && (
                                <li className="pl-6 pt-2">
                                    <button 
                                        onClick={addPoint} 
                                        className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-bold px-3 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-dashed border-primary-200 hover:border-primary-300"
                                    >
                                        <Plus size={14} strokeWidth={2.5} /> Add Point
                                    </button>
                                </li>
                            )}
                        </ul>
                     </div>

                     {/* Image Section */}
                     {(currentSlide.imagePrompt || currentSlide.imageData) && (
                         <div className="w-full sm:w-1/3 flex flex-col items-center justify-center">
                             {currentSlide.imageData ? (
                                 <div className="relative group/img rounded-lg overflow-hidden shadow-md border border-slate-200">
                                    <img 
                                        src={currentSlide.imageData} 
                                        alt="Slide illustration" 
                                        className="w-full h-auto max-h-32 sm:max-h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover/img:bg-transparent transition-colors"></div>
                                 </div>
                             ) : (
                                 <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2 sm:gap-3 p-2 sm:p-4 text-center">
                                      <Loader2 size={24} className="animate-spin text-primary-400" />
                                      <span className="text-xs font-medium">Generating visual...</span>
                                 </div>
                             )}
                         </div>
                     )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-2 sm:bottom-6 right-4 sm:right-8 text-xs sm:text-sm opacity-50 select-none font-medium tracking-widest">
                    {currentIndex + 1}
                </div>
                
                <div 
                    className="absolute bottom-0 left-0 h-2.5 w-full"
                    style={{ backgroundColor: theme.colors.primary }}
                ></div>
            </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="h-20 sm:h-28 flex items-center gap-2 sm:gap-3 overflow-x-auto px-2 sm:px-6 pb-2 sm:pb-4 scrollbar-hide flex-shrink-0">
          {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-28 h-16 sm:w-36 sm:h-20 rounded-lg border overflow-hidden transition-all duration-300 group relative ${
                  idx === currentIndex 
                    ? 'border-primary-500 ring-2 ring-primary-200 shadow-lg scale-105 z-10' 
                    : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300 hover:scale-[1.02]'
                }`}
              >
                  <div className="w-full h-full bg-white p-2 flex flex-col pointer-events-none relative">
                      <div className="h-1 w-full mb-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div className="text-[7px] font-bold text-slate-800 text-left line-clamp-2 leading-tight mb-1 pr-6">{slide.title || 'Untitled Slide'}</div>
                      <div className="space-y-[3px] opacity-30">
                          <div className="h-[2px] w-full bg-slate-800 rounded-full"></div>
                          <div className="h-[2px] w-3/4 bg-slate-800 rounded-full"></div>
                      </div>
                      
                      {/* Thumbnail Image Indicator */}
                      {(slide.imageData) && (
                          <div className="absolute bottom-2 right-2 w-6 h-6 rounded bg-slate-100 border border-slate-200 overflow-hidden">
                              <img src={slide.imageData} className="w-full h-full object-cover" alt="thumb" />
                          </div>
                      )}
                  </div>
                  {idx === currentIndex && (
                      <div className="absolute inset-0 bg-primary-500/5 pointer-events-none"></div>
                  )}
              </button>
          ))}
      </div>
    </div>
  );
};

// Rich Text Editor Component
const RichTextEditor: React.FC<{
    html: string;
    onChange: (html: string) => void;
    style?: React.CSSProperties;
}> = ({ html, onChange, style }) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentEditableRef.current && document.activeElement !== contentEditableRef.current) {
            if (contentEditableRef.current.innerHTML !== html) {
                contentEditableRef.current.innerHTML = html;
            }
        }
    }, [html]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    return (
        <div
            ref={contentEditableRef}
            contentEditable
            onInput={handleInput}
            onBlur={(e) => onChange(e.currentTarget.innerHTML)}
            className="w-full bg-slate-50 border border-transparent hover:border-slate-300 focus:border-primary-500 focus:bg-white outline-none p-2 rounded-lg text-lg sm:text-xl leading-relaxed min-h-[1.5em] transition-all cursor-text"
            style={style}
            suppressContentEditableWarning={true}
            spellCheck={false}
        />
    );
};

export default PreviewSection;