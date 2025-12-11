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
    You are a professional presentation designer.
    Create a PowerPoint presentation about: "${topic}".
    Context and Details: "${detailedInput}".
    
    The presentation should have exactly ${slideCount} slides.
    The visual theme will be "${themeName}", so write content that fits this tone.
    
    Return the response in strict JSON format matching the schema.
    
    Structure:
    1. Title Slide (Intro)
    2. Introduction/Agenda
    3. Main Content Slides (broken down logically)
    4. Conclusion/Summary
    
    For each slide, provide:
    - type: 'title', 'content', 'section', or 'conclusion'
    - title: The headline of the slide
    - content: An array of strings (bullet points). Limit to 4-6 points per slide for readability.
    - speakerNotes: A short paragraph for the presenter.
    - imagePrompt: A detailed, descriptive visual prompt to generate a high-quality, professional, photorealistic or illustration-style image relevant to this specific slide. Describe the scene, objects, lighting, and style. Do NOT include instructions like "Create an image of". Just describe the visual content directly (e.g., "A modern office building with glass facade under a blue sky").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
            model: 'gemini-2.5-flash-image',
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