import * as pdfjsLib from 'pdfjs-dist';

// IMPORTANT: In a real environment, you would point to the worker file.
// For this environment, we attempt to set it to a CDN location or assume it is loaded.
// If using specific bundlers, this might need adjustment.
// We use a try-catch block to handle environment specific issues gracefully.
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (e) {
  console.warn("Could not set PDF worker source via CDN. PDF extraction might fail if local worker is not configured.");
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
  }
};