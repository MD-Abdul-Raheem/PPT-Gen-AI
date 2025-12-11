import React, { useRef, useState } from 'react';
import { FileUp, Type, AlertCircle, X, FileText, CheckCircle2 } from 'lucide-react';
import { MAX_CHAR_COUNT } from '../constants';
import { extractTextFromPdf } from '../services/pdfService';

interface InputSectionProps {
  topic: string;
  setTopic: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  isGenerating: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  topic,
  setTopic,
  description,
  setDescription,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsProcessingPdf(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      // Append extracted text to description
      const newDescription = (description + '\n\n' + text).trim();
      if (newDescription.length > MAX_CHAR_COUNT) {
         setDescription(newDescription.substring(0, MAX_CHAR_COUNT));
         setError(`PDF content truncated to ${MAX_CHAR_COUNT} characters.`);
      } else {
         setDescription(newDescription);
      }
      
      setPdfName(file.name);
      
      // Try to guess a topic if empty
      if (!topic) {
          setTopic(file.name.replace('.pdf', '').replace(/[-_]/g, ' '));
      }
    } catch (err) {
      setError('Failed to read PDF. Text extraction might not be supported in this environment.');
    } finally {
      setIsProcessingPdf(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearPdf = () => {
      setDescription('');
      setPdfName(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="space-y-4">
        <label htmlFor="topic" className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Type size={14} /> Topic & Source
        </label>
        
        <div className="relative group">
            <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The Future of Renewable Energy"
                className="w-full px-4 py-4 bg-surface-50 hover:bg-surface-100 focus:bg-white rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium text-lg"
                disabled={isGenerating}
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none"></div>
        </div>

        {/* PDF Status or Upload Button */}
        <div className="flex items-center gap-3">
             <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            
            {!pdfName ? (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isGenerating || isProcessingPdf}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-primary-200 bg-primary-50/50 hover:bg-primary-50 text-primary-700 font-semibold text-sm transition-all hover:border-primary-300 group"
                >
                    {isProcessingPdf ? (
                         <span className="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"/>
                    ) : (
                        <FileUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    )}
                    {isProcessingPdf ? "Extracting Text..." : "Upload PDF Source"}
                </button>
            ) : (
                <div className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-surface-50 border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-red-100 p-1.5 rounded-lg text-red-600">
                             <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">{pdfName}</p>
                            <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 size={10} /> Processed
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={clearPdf}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove PDF"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Helper text since we removed the textarea */}
      <div className="mt-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">How it works</h4>
          <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></span>
                  Enter a topic above, or upload a PDF to base the content on.
              </li>
              <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></span>
                  Our AI will analyze your input and structure a professional presentation automatically.
              </li>
              <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></span>
                  A random professional theme and animation style will be applied.
              </li>
          </ul>
      </div>

      {error && (
        <div className="flex items-start gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl animate-in fade-in slide-in-from-top-1 border border-red-100 mt-auto">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto hover:text-red-800 p-0.5 rounded-md hover:bg-red-100">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InputSection;