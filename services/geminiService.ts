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
      description: { type: Type.STRING, description: 'A detailed description of the niche, including services offered, potential keywords, and a brief market outlook.' },
      averagePrice: { type: Type.NUMBER, description: 'The estimated average price in USD for a standard project in this niche.' },
      demand: { type: Type.NUMBER, description: 'A score from 1 (low) to 10 (high) representing current buyer demand.' },
      competition: { type: Type.NUMBER, description: 'A score from 1 (low) to 10 (high) representing the number of sellers. Lower is better for new freelancers.' },
      trend: { type: Type.NUMBER, description: 'A score from -1.0 (declining) to 1.0 (growing) indicating the market trend over the last 6-12 months.' },
    },
    required: ['niche', 'description', 'averagePrice', 'demand', 'competition', 'trend'],
  },
};

export const fetchNicheData = async (): Promise<Niche[]> => {
  const prompt = `Analyze the current Fiverr marketplace and generate a diverse list of 20 potentially profitable niches for freelancers. For each niche, provide the following details:
- niche: The specific name of the Fiverr niche.
- description: A detailed description of the niche, including what services it offers, potential keywords for a gig, and a brief market outlook (e.g., "Growing demand due to AI boom").
- averagePrice: The estimated average price in USD for a standard project in this niche.
- demand: A score from 1 (low) to 10 (high) representing current buyer demand.
- competition: A score from 1 (low) to 10 (high) representing the number of sellers. Lower is better for new freelancers.
- trend: A score from -1.0 (declining) to 1.0 (growing) indicating the market trend over the last 6-12 months.
Return the data as a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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