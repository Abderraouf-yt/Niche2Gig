
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { Niche } from '../types';

const unifiedNicheSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      niche: { type: Type.STRING },
      description: { type: Type.STRING },
      averagePrice: { type: Type.NUMBER },
      demand: { type: Type.NUMBER },
      competition: { type: Type.NUMBER },
      trend: { type: Type.NUMBER },
      gigTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
      gigDescription: { type: Type.STRING },
      keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      faqs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          }
        }
      },
      battlePlan: { type: Type.STRING },
      competitorWeakness: { type: Type.STRING },
      competitionNote: { type: Type.STRING },
      targetAudience: { type: Type.STRING },
      marketingChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
      painPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: [
      'niche', 'description', 'averagePrice', 'demand', 'competition', 
      'trend', 'gigTitles', 'gigDescription', 'keywords', 'faqs', 
      'battlePlan', 'competitorWeakness', 'competitionNote', 'targetAudience',
      'marketingChannels', 'painPoints'
    ],
  },
};

const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out.`)), ms)
    ),
  ]);
};

const normalizeNiche = (n: any): Niche => ({
  ...n,
  demand: Math.min(10, Math.max(1, Math.round(n.demand || 5))),
  competition: Math.min(10, Math.max(1, Math.round(n.competition || 5))),
  averagePrice: n.averagePrice || 50,
  trend: n.trend || 0.5,
  gigTitles: n.gigTitles?.slice(0, 3) || [`Expert ${n.niche} Services`],
  gigDescription: n.gigDescription || n.description,
  keywords: n.keywords?.slice(0, 5) || n.niche.toLowerCase().split(' '),
  faqs: n.faqs?.slice(0, 3) || [{ question: "Requirement?", answer: "Project brief." }],
  battlePlan: n.battlePlan || "Leverage first-mover advantage.",
  competitorWeakness: n.competitorWeakness || "Generic or non-specialized providers.",
  competitionNote: n.competitionNote || "Low-quality generic listings.",
  targetAudience: n.targetAudience || "Tech-savvy entrepreneurs.",
  marketingChannels: n.marketingChannels?.slice(0, 3) || ["LinkedIn", "Twitter", "Cold Outreach"],
  painPoints: n.painPoints?.slice(0, 3) || ["High cost of alternatives", "Slow delivery", "Lack of niche expertise"]
});

export const fetchNicheData = async (): Promise<Niche[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const unifiedPrompt = `DEEP MARKET SCAN 2025-2026: 
  Search for 8 specialized, high-growth Fiverr niches. 
  For each niche, generate a complete high-conversion blueprint.
  
  RULES FOR CONVERSION (2025/2026 PSYCHOLOGY):
  1. TITLES: Use surgical precision. Incorporate "Transformation" and "ROI" hooks.
  2. FAQS: MUST include both compelling Questions and Objection-Handling Answers.
  3. AUDIENCE INSIGHTS: Identify 3 specific Buyer Pain Points and 3 most effective Marketing Channels (e.g., Subreddits, Discord groups, TikTok tags) where this audience hangs out.
  4. BATTLE PLAN: Identify a specific gap in top-seller service delivery and exploit it.
  5. DESCRIPTION: Use the PAS (Problem-Agitate-Solution) framework.
  
  Return as JSON array with all required fields. Return ONLY valid JSON.`;

  try {
    const response: GenerateContentResponse = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: unifiedPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: unifiedNicheSchema,
          tools: [{ googleSearch: {} }],
          temperature: 0.8,
          thinkingConfig: { thinkingBudget: 0 } 
        },
      }),
      120000, 
      "Deep Intelligence Scan"
    );

    const rawResults = JSON.parse(response.text || "[]");
    if (!rawResults.length) throw new Error("Market scan returned no results. Try again.");

    return rawResults.map(normalizeNiche);
  } catch (error) {
    console.error("Unified scan failed:", error);
    throw error;
  }
};
