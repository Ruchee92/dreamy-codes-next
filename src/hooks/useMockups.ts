import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const MOCKUPS_KEY = 'dreamy_codes_mockups';

export const useMockups = (apiKeySelected: boolean) => {
  const [mockups, setMockups] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cached = localStorage.getItem(MOCKUPS_KEY);
    if (cached) {
      setMockups(JSON.parse(cached));
    }
  }, []);

  const generateMockups = async () => {
    if (!apiKeySelected) return;
    setLoading(true);
    setProgress(0);

    const basePrompt = "A highly detailed, professional UI/UX mockup of a modern Shopify e-commerce website. Clean, minimalist design, premium aesthetic, high-end branding, displayed on a sleek digital canvas. Consistent style.";
    
    const items = [
      { id: "cosmetics", prompt: `${basePrompt} Theme: Luxury Cosmetics and Skincare. Soft pastel colors, elegant typography.` },
      { id: "travel", prompt: `${basePrompt} Theme: Outdoor Travel and Nomad Gear. Earthy tones, rugged but premium feel.` },
      { id: "interior", prompt: `${basePrompt} Theme: Modern Interior Design and Home Decor. Neutral palette, sophisticated layout.` },
      { id: "skincare", prompt: `${basePrompt} Theme: Premium Organic Skincare. Clean white and sage green, minimalist.` },
      { id: "fitness", prompt: `${basePrompt} Theme: High-Performance Activewear and Fitness. Bold typography, energetic but clean dark mode.` },
      { id: "furniture", prompt: `${basePrompt} Theme: Artisanal Wood Furniture. Warm tones, elegant grid layout.` }
    ];

    const newMockups: Record<string, string> = {};

    try {
      // @ts-ignore
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-image-preview',
            contents: {
              parts: [{ text: item.prompt }],
            },
            config: {
              // @ts-ignore
              imageConfig: {
                aspectRatio: "3:4",
                imageSize: "1K"
              }
            }
          });

          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              newMockups[item.id] = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        } catch (e) {
          console.error(`Failed to generate mockup for ${item.id}:`, e);
        }
        setProgress(((i + 1) / items.length) * 100);
      }

      setMockups(newMockups);
      localStorage.setItem(MOCKUPS_KEY, JSON.stringify(newMockups));
    } catch (error) {
      console.error("Error initializing GenAI:", error);
    } finally {
      setLoading(false);
    }
  };

  return { mockups, loading, progress, generateMockups };
};
