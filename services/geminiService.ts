import { GoogleGenerativeAI } from "@google/generative-ai";
import { Slide, SlideLayout } from "../types";

const API_KEY = 'AIzaSyAhITCED-rlL45PX-Y04p1M5TKxtJkFHc4';

const parseJson = (text: string) => {
    try {
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const start = cleanText.indexOf('{');
        const end = cleanText.lastIndexOf('}');
        if (start === -1 || end === -1) throw new Error("Invalid JSON");
        return JSON.parse(cleanText.substring(start, end + 1));
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return null;
    }
}

export const generatePresentationContent = async (
  topic: string,
  detailedInput: string,
  slideCount: number,
  themeName: string
): Promise<{ title: string; subtitle: string; slides: Slide[] }> => {
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    const prompt = `You are an expert presentation designer. Create a professional ${slideCount}-slide presentation.

Topic: "${topic}"
${detailedInput ? 'Additional Context: ' + detailedInput : ''}
Theme: "${themeName}"

REQUIREMENTS:
- Exactly ${slideCount} slides
- First slide: Title slide with engaging subtitle
- Last slide: Strong conclusion with call-to-action
- Middle slides: Well-structured content with clear narrative
- Each slide: 3-5 concise bullet points (8-12 words each)
- Include specific data, statistics, or examples
- Professional, executive-level language
- Compelling headlines (5-8 words)

Return ONLY valid JSON (no markdown, no code blocks):
{
  "presentationTitle": "Compelling Main Title",
  "presentationSubtitle": "Engaging Subtitle",
  "slides": [
    {
      "type": "title",
      "title": "Opening Slide Title",
      "content": ["Key point 1", "Key point 2"],
      "speakerNotes": "Detailed presenter notes with statistics and talking points",
      "imagePrompt": "Professional corporate image: modern office space with natural lighting, glass walls, business professionals collaborating, clean minimalist design, corporate photography style"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const data = parseJson(text);
    
    if (!data || !data.slides || !Array.isArray(data.slides)) {
      throw new Error("Invalid response format from AI");
    }

    const slides: Slide[] = data.slides.map((s: any, index: number) => ({
      id: `slide-${index}-${Date.now()}`,
      type: (s.type as SlideLayout) || 'content',
      title: s.title || 'Untitled Slide',
      content: Array.isArray(s.content) ? s.content : [],
      speakerNotes: s.speakerNotes || '',
      imagePrompt: s.imagePrompt || '',
      transition: index === 0 ? 'fade' : ['push', 'wipe', 'cover'][index % 3] as any
    }));

    return {
      title: data.presentationTitle || topic,
      subtitle: data.presentationSubtitle || '',
      slides
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate presentation. Please check your API key and try again.");
  }
};

export const generateSlideImage = async (imagePrompt: string): Promise<string | null> => {
    if (!imagePrompt || imagePrompt.length < 10) {
        return null;
    }
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent([
            { text: `Generate a professional business image: ${imagePrompt}` }
        ]);
        
        const response = result.response;
        
        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.warn("Image generation failed:", error);
        return null;
    }
};
