import React, { useState, useEffect, useCallback } from 'react';
import { PresentationData, Slide, ThemeId, Theme, GenerationSettings, TransitionType } from './types';
import { THEMES, DEFAULT_SLIDE_COUNT, TRANSITION_OPTIONS } from './constants';
import { generatePresentationContent, generateSlideImage } from './services/geminiService';
import { generatePptx } from './services/pptxService';
import InputSection from './components/InputSection';
import PreviewSection from './components/PreviewSection';
import { Download, Sparkles, RefreshCw, Presentation, Layout, Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, Info } from 'lucide-react';
import AboutPage from './components/AboutPage';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    slideCount: DEFAULT_SLIDE_COUNT,
    themeId: ThemeId.MODERN_BLUE,
    transition: 'fade'
  });
  
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSlideIndex, setPlaySlideIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const currentTheme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];

  const handleGenerate = async () => {
    if (!topic && !description) {
      setError("Please provide a topic or upload a PDF.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setPresentation(null);

    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const randomTransition = TRANSITION_OPTIONS[Math.floor(Math.random() * TRANSITION_OPTIONS.length)].value;
    
    setSettings(prev => ({
        ...prev,
        themeId: randomTheme.id,
        transition: randomTransition
    }));

    try {
      const result = await generatePresentationContent(
        topic, 
        description, 
        settings.slideCount, 
        randomTheme.name
      );
      
      setPresentation({
          title: result.title || topic || 'Untitled Presentation',
          subtitle: result.subtitle,
          slides: result.slides
      });

      // Background Image Generation
      // We do not await this so the UI updates with text immediately
      generateImagesForSlides(result.slides);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImagesForSlides = async (slides: Slide[]) => {
      // Process slides sequentially or in small batches to avoid rate limits if necessary
      // For now, simple parallel mapping, but we update state one by one
      
      slides.forEach(async (slide, index) => {
          if (slide.imagePrompt && slide.imagePrompt.length > 5) {
              try {
                  const base64Image = await generateSlideImage(slide.imagePrompt);
                  
                  if (base64Image) {
                      setPresentation(prev => {
                          if (!prev) return null;
                          const newSlides = [...prev.slides];
                          // Ensure we are updating the correct slide by ID if possible, but index is safe if list hasn't changed
                          // We'll trust index here as the list shouldn't mutate deeply during generation
                          if (newSlides[index]) {
                               newSlides[index] = { ...newSlides[index], imageData: base64Image };
                          }
                          return { ...prev, slides: newSlides };
                      });
                  }
              } catch (e) {
                  console.warn(`Failed to generate image for slide ${index}`, e);
                  // Optionally set an error state on the slide or just leave it blank
              }
          }
      });
  };

  const handleDownload = async () => {
    if (!presentation) return;
    setIsDownloading(true);
    try {
      await generatePptx(presentation, currentTheme, settings.transition);
    } catch (err) {
      setError("Failed to generate PowerPoint file.");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const updateSlide = (index: number, updatedSlide: Slide) => {
    if (!presentation) return;
    const newSlides = [...presentation.slides];
    newSlides[index] = updatedSlide;
    setPresentation({ ...presentation, slides: newSlides });
  };

  const deleteSlide = (index: number) => {
    if (!presentation) return;
    const newSlides = presentation.slides.filter((_, i) => i !== index);
    setPresentation({ ...presentation, slides: newSlides });
  };

  const resetApp = () => {
      if(window.confirm("Are you sure you want to clear everything and start over?")) {
          setTopic('');
          setDescription('');
          setPresentation(null);
          setError(null);
      }
  };

  const startPresentation = () => {
      setPlaySlideIndex(0);
      setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || !presentation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setPlaySlideIndex(prev => Math.min(prev + 1, presentation.slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setPlaySlideIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, presentation]);


  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-surface-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-primary-600 to-primary-400 p-2.5 rounded-xl shadow-glow">
                <Presentation className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                SlideGen <span className="text-primary-600">AI</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Professional Deck Builder</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <button 
                onClick={() => setShowAbout(true)}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
             >
                <Info size={16} />
                <span className="hidden sm:inline">About</span>
             </button>
             {presentation && (
                 <button 
                    onClick={resetApp}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                    <span className="hidden sm:inline">New Project</span>
                    <span className="sm:hidden">New</span>
                </button>
             )}
             <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
             <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">System Ready</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:h-[calc(100vh-88px)] min-h-[600px]">
        
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 order-2 lg:order-1 h-full overflow-hidden">
            <div className="bg-white rounded-3xl p-1 shadow-card border border-slate-100 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Create Deck</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">Describe your topic, we'll handle the design.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <Layout size={14} /> Slide Count
                            </label>
                            <div className="relative">
                                <select 
                                    value={settings.slideCount}
                                    onChange={(e) => setSettings({...settings, slideCount: parseInt(e.target.value)})}
                                    className="w-full appearance-none pl-4 pr-8 py-3 bg-surface-50 hover:bg-surface-100 rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-medium text-slate-700 cursor-pointer"
                                    disabled={isGenerating}
                                >
                                    <option value={5}>5 Slides</option>
                                    <option value={8}>8 Slides</option>
                                    <option value={12}>12 Slides</option>
                                    <option value={15}>15 Slides</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-100"></div>

                    <div className="flex-1 flex flex-col">
                        <InputSection 
                            topic={topic} 
                            setTopic={setTopic} 
                            description={description} 
                            setDescription={setDescription}
                            isGenerating={isGenerating}
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-50 bg-white sticky bottom-0 z-10">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || (!topic && !description)}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 disabled:shadow-none hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="animate-spin" size={20} />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} className="text-primary-100" />
                                <span>Generate Presentation</span>
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                        Theme & Animation will be auto-selected
                    </p>
                </div>
            </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 flex flex-col order-1 lg:order-2 h-full min-h-[400px] sm:min-h-[500px]">
             <div className="bg-white rounded-3xl shadow-float border border-slate-100 p-1 h-full flex flex-col overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${presentation ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Workspace</h2>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2">
                         {presentation && (
                             <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-none"
                            >
                                {isDownloading ? (
                                    <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>
                                ) : (
                                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform duration-300" />
                                )}
                                <span className="hidden sm:inline">Export PPTX</span>
                                <span className="sm:hidden">Export</span>
                            </button>
                         )}
                     </div>
                </div>

                <div className="flex-1 bg-surface-50 relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    
                    <div className="flex-1 relative z-10 p-4 sm:p-6 lg:p-8 flex flex-col">
                        <PreviewSection 
                            slides={presentation?.slides || []} 
                            theme={currentTheme}
                            onUpdateSlide={updateSlide}
                            onDeleteSlide={deleteSlide}
                            onPlay={startPresentation}
                        />
                    </div>
                </div>
             </div>
        </div>

      </main>
      
      {isPlaying && presentation && (
          <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col">
              <button 
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
              >
                  <X size={24} />
              </button>
              
              <div className="flex-1 flex items-center justify-center p-8 relative">
                  <button 
                    onClick={() => setPlaySlideIndex(prev => Math.max(prev - 1, 0))}
                    disabled={playSlideIndex === 0}
                    className="absolute left-2 sm:left-4 p-2 sm:p-4 text-white/50 hover:text-white disabled:opacity-0 transition-all hover:scale-110"
                  >
                      <ChevronLeft size={32} className="sm:w-12 sm:h-12" />
                  </button>

                  <div 
                      className="w-full max-w-6xl aspect-video bg-white text-slate-900 shadow-2xl rounded-xl overflow-hidden relative flex flex-col p-4 sm:p-8 lg:p-16 animate-in zoom-in-95 duration-300"
                      style={{
                          backgroundColor: currentTheme.colors.background,
                          color: currentTheme.colors.text,
                          fontFamily: currentTheme.fonts.body
                      }}
                  >
                        {/* Play Mode Header */}
                        <div className="mb-4 sm:mb-10 flex justify-between items-start">
                             <h2 
                                className="text-2xl sm:text-4xl lg:text-5xl font-bold max-w-4xl leading-tight"
                                style={{ 
                                    color: currentTheme.colors.primary, 
                                    fontFamily: currentTheme.fonts.heading 
                                }}
                            >
                                {presentation.slides[playSlideIndex].title}
                            </h2>
                        </div>

                        {/* Play Mode Body */}
                        <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-12 overflow-hidden">
                             <div className="flex-1 overflow-y-auto pr-2 sm:pr-4">
                                <ul className="space-y-2 sm:space-y-6">
                                    {presentation.slides[playSlideIndex].content.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-2 sm:gap-4 text-base sm:text-2xl lg:text-3xl leading-relaxed">
                                            <span className="mt-4 w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: currentTheme.colors.secondary }}></span>
                                            <div dangerouslySetInnerHTML={{ __html: point }} />
                                        </li>
                                    ))}
                                </ul>
                             </div>
                             
                             {/* Play Mode Image */}
                             {presentation.slides[playSlideIndex].imageData && (
                                 <div className="w-full sm:w-1/3 flex items-center justify-center h-32 sm:h-full mt-4 sm:mt-0">
                                      <img 
                                        src={presentation.slides[playSlideIndex].imageData} 
                                        className="max-h-full w-full object-contain rounded-lg shadow-xl"
                                        alt="Slide Visual"
                                      />
                                 </div>
                             )}
                        </div>
                        
                        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-sm sm:text-xl opacity-50">
                            {playSlideIndex + 1} / {presentation.slides.length}
                        </div>
                        <div className="absolute bottom-0 left-0 h-3 w-full" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                  </div>

                  <button 
                    onClick={() => setPlaySlideIndex(prev => Math.min(prev + 1, presentation.slides.length - 1))}
                    disabled={playSlideIndex === presentation.slides.length - 1}
                    className="absolute right-2 sm:right-4 p-2 sm:p-4 text-white/50 hover:text-white disabled:opacity-0 transition-all hover:scale-110"
                  >
                      <ChevronRight size={32} className="sm:w-12 sm:h-12" />
                  </button>
              </div>

              <div className="h-12 sm:h-16 bg-zinc-900 flex items-center justify-center text-xs sm:text-sm text-zinc-500 gap-2 sm:gap-8 px-4">
                  <span className="hidden sm:inline">Use Arrow Keys to Navigate</span>
                  <span>{playSlideIndex + 1} of {presentation.slides.length}</span>
                  <span className="hidden sm:inline">ESC to Exit</span>
              </div>
          </div>
      )}
      
      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
      
      {error && (
          <div className="fixed bottom-8 right-8 bg-red-50 text-red-900 border border-red-100 px-6 py-4 rounded-2xl shadow-float flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-md">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="font-medium text-sm leading-snug">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-800 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
          </div>
      )}
    </div>
  );
};

export default App;