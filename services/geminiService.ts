// Fix: Implement the Gemini API service to fetch niche data.
import { GoogleGenAI, Type } from "@google/genai";
import type { Niche } from '../types';

// Assumes process.env.API_KEY is configured in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      niche: { type: Type.STRING, description: 'The specific name of the Fiverr niche.' },
      description: { type: Type.STRING, description: 'High-level market overview.' },
      averagePrice: { type: Type.NUMBER, description: 'Estimated project price in USD.' },
      demand: { type: Type.NUMBER, description: 'Score 1-10 for buyer interest.' },
      competition: { type: Type.NUMBER, description: 'Score 1-10 for seller saturation.' },
      trend: { type: Type.NUMBER, description: 'Trend direction -1.0 to 1.0.' },
      // Enriched fields
      gigTitles: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: '3 optimized Fiverr gig titles.' 
      },
      gigDescription: { type: Type.STRING, description: 'A professional, high-converting gig description.' },
      keywords: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: '5 essential search tags.' 
      },
      faqs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          },
          required: ['question', 'answer']
        },
        description: '2 most important buyer FAQs.'
      },
      battlePlan: { type: Type.STRING, description: 'Strategic advice on how to outperform existing top sellers.' }
    },
    required: ['niche', 'description', 'averagePrice', 'demand', 'competition', 'trend', 'gigTitles', 'gigDescription', 'keywords', 'faqs', 'battlePlan'],
  },
};

export const fetchNicheData = async (): Promise<Niche[]> => {
  const prompt = `Act as a senior Fiverr market analyst. Discover 15 high-potential, specialized niches for 2025. 
For each niche, go beyond basic stats. I need a "Gig Execution Blueprint" including:
1. Optimized titles and tags.
2. A compelling description that addresses buyer pain points.
3. A "Battle Plan" describing the specific competitive advantage a new seller should focus on to win.

Return the data as a detailed JSON array following the strict schema provided.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from API. Expected an array.");
    }

    return data as Niche[];

  } catch (error) {
    console.error("Error fetching niche data from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch niche data: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching niche data.");
  }
};