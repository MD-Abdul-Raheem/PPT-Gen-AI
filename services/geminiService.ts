import { GoogleGenAI, Type } from "@google/genai";
import { Slide, SlideLayout } from "../types";

const parseJson = (text: string) => {
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start === -1 || end === -1) throw new Error("Invalid JSON");
        return JSON.parse(text.substring(start, end + 1));
    } catch (e) {
        return null;
    }
}

export const generatePresentationContent = async (
  topic: string,
  detailedInput: string,
  slideCount: number,
  themeName: string
): Promise<{ title: string; subtitle: string; slides: Slide[] }> => {
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert presentation designer with 10+ years creating executive-level presentations.
    
    Topic: "${topic}"
    Context: "${detailedInput}"
    Slides: ${slideCount}
    Theme: "${themeName}"
    
    STRUCTURE:
    1. Opening: Powerful title with engaging subtitle
    2. Executive Summary (1 slide)
    3. Main Content: Logical sections with clear narrative
    4. Data/Evidence: Statistics, facts, case studies
    5. Conclusion: Strong closing with call-to-action
    
    CONTENT RULES:
    - Action-oriented, concise language
    - 8-12 words per bullet point maximum
    - Include specific numbers/percentages/data
    - Use power words and compelling phrases
    - 3-5 bullets per slide (never exceed 6)
    - ONE clear message per slide
    
    For each slide:
    - type: 'title', 'content', 'section', or 'conclusion'
    - title: Compelling headline (5-8 words)
    - content: Concise, impactful bullet points
    - speakerNotes: Professional notes with key talking points and statistics
    - imagePrompt: Professional visual description with subject, composition, lighting, color palette, mood, style. Example: "Modern glass office building at sunset, warm golden lighting, professional atmosphere, clean lines, corporate photography style"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            presentationTitle: { type: Type.STRING },
            presentationSubtitle: { type: Type.STRING },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: [SlideLayout.TITLE, SlideLayout.CONTENT, SlideLayout.SECTION, SlideLayout.CONCLUSION] },
                  title: { type: Type.STRING },
                  content: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  speakerNotes: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING, description: "Visual description for generating an image." }
                },
                required: ["type", "title", "content", "imagePrompt"]
              }
            }
          },
          required: ["presentationTitle", "slides"]
        }
      }
    });

    const data = parseJson(response.text);
    
    if (!data) throw new Error("Failed to parse generation result");

    // Map to internal types ensuring IDs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slides: Slide[] = data.slides.map((s: any, index: number) => ({
      id: `slide-${index}-${Date.now()}`,
      type: s.type as SlideLayout,
      title: s.title,
      content: s.content || [],
      speakerNotes: s.speakerNotes || '',
      imagePrompt: s.imagePrompt
    }));

    return {
      title: data.presentationTitle,
      subtitle: data.presentationSubtitle || '',
      slides
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate presentation content. Please try again.");
  }
};

export const generateSlideImage = async (imagePrompt: string): Promise<string | null> => {
    if (!imagePrompt || imagePrompt.length < 5 || imagePrompt.toLowerCase() === 'n/a') {
        return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: imagePrompt, // Pass string directly
            config: {
                imageConfig: {
                    aspectRatio: "4:3", 
                }
            }
        });
        
        // Find the image part in the response
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        
        console.warn(`Image generation returned no image data for prompt: "${imagePrompt.substring(0, 30)}..."`);
        return null;
    } catch (error) {
        console.error("Image Generation Error:", error);
        return null; // Return null gracefully
    }
};