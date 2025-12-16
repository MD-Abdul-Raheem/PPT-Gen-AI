import React from 'react';
import { X, Sparkles, Zap, Palette, Download, FileText, Image, Presentation } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6 sm:p-8 rounded-t-3xl z-10">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Presentation size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">SlideGen AI</h1>
              <p className="text-primary-100 text-sm sm:text-base">Professional Presentation Generator</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="text-primary-600" size={24} />
              What is SlideGen AI?
            </h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              SlideGen AI is an intelligent presentation builder powered by Google's Gemini AI. 
              Simply provide a topic or upload a PDF document, and our AI will automatically generate 
              a professional, visually stunning PowerPoint presentation with relevant content, images, 
              and animations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <FeatureCard 
                icon={<Zap className="text-yellow-500" size={24} />}
                title="AI-Powered Content"
                description="Gemini AI generates structured, professional content tailored to your topic"
              />
              <FeatureCard 
                icon={<Image className="text-blue-500" size={24} />}
                title="Auto Image Generation"
                description="AI creates relevant, high-quality images for each slide automatically"
              />
              <FeatureCard 
                icon={<Palette className="text-purple-500" size={24} />}
                title="Smart Themes"
                description="Randomly selected professional themes with beautiful color schemes"
              />
              <FeatureCard 
                icon={<FileText className="text-green-500" size={24} />}
                title="PDF Upload"
                description="Extract text from PDF documents to base your presentation on"
              />
              <FeatureCard 
                icon={<Download className="text-red-500" size={24} />}
                title="Export to PPTX"
                description="Download your presentation as a fully editable PowerPoint file"
              />
              <FeatureCard 
                icon={<Presentation className="text-indigo-500" size={24} />}
                title="Live Preview & Edit"
                description="Edit slides in real-time with rich text formatting and preview mode"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use</h2>
            <ol className="space-y-4">
              <Step 
                number={1}
                title="Enter Your Topic"
                description="Type in a topic or upload a PDF document as your content source"
              />
              <Step 
                number={2}
                title="Select Slide Count"
                description="Choose how many slides you want (5, 8, 12, or 15 slides)"
              />
              <Step 
                number={3}
                title="Generate Presentation"
                description="Click 'Generate Presentation' and let AI create your deck with auto-selected theme and animations"
              />
              <Step 
                number={4}
                title="Edit & Customize"
                description="Use the edit mode to refine content, add/remove points, and adjust slide transitions"
              />
              <Step 
                number={5}
                title="Preview & Export"
                description="Use Play mode to preview your presentation, then export as PPTX when ready"
              />
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              <TechBadge name="React 19" />
              <TechBadge name="TypeScript" />
              <TechBadge name="Google Gemini AI" />
              <TechBadge name="Tailwind CSS" />
              <TechBadge name="Vite" />
              <TechBadge name="PptxGenJS" />
              <TechBadge name="PDF.js" />
              <TechBadge name="Lucide Icons" />
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 border border-primary-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Requirements</h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></span>
                <span><strong>Gemini API Key:</strong> Set your GEMINI_API_KEY in .env.local file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></span>
                <span><strong>Node.js:</strong> Required for running the development server</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></span>
                <span><strong>Modern Browser:</strong> Chrome, Firefox, Safari, or Edge recommended</span>
              </li>
            </ul>
          </section>

          <section className="text-center pt-4 border-t border-slate-200">
            <p className="text-slate-500 text-sm">
              Built with ❤️ using Google AI Studio • Version 1.0.0
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all">
    <div className="flex items-start gap-3">
      <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
      <div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Step: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
  <li className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  </li>
);

const TechBadge: React.FC<{ name: string }> = ({ name }) => (
  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-primary-300 hover:shadow-sm transition-all">
    {name}
  </span>
);

export default AboutPage;
