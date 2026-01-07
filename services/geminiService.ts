
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
      scalabilityIndex: { type: Type.NUMBER },
      aiDisruptionRisk: { type: Type.NUMBER },
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
      painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      strategicForecast: { type: Type.STRING }
    },
    required: [
      'niche', 'description', 'averagePrice', 'demand', 'competition', 
      'trend', 'scalabilityIndex', 'aiDisruptionRisk', 'gigTitles', 
      'gigDescription', 'keywords', 'faqs', 'battlePlan', 
      'competitorWeakness', 'competitionNote', 'targetAudience',
      'marketingChannels', 'painPoints', 'strategicForecast'
    ],
  },
};

const normalizeNiche = (n: any): Niche => ({
  ...n,
  demand: Math.min(10, Math.max(1, Math.round(n.demand || 5))),
  competition: Math.min(10, Math.max(1, Math.round(n.competition || 5))),
  scalabilityIndex: Math.min(10, Math.max(1, Math.round(n.scalabilityIndex || 5))),
  aiDisruptionRisk: Math.min(10, Math.max(1, Math.round(n.aiDisruptionRisk || 3))),
  averagePrice: n.averagePrice || 75,
  trend: n.trend || 0.6,
  gigTitles: n.gigTitles?.slice(0, 4) || [`Advanced ${n.niche} Strategy Service`],
  gigDescription: n.gigDescription || n.description,
  keywords: n.keywords?.slice(0, 6) || n.niche.toLowerCase().split(' '),
  faqs: n.faqs?.slice(0, 4) || [{ question: "AI Workflow?", answer: "Expert human oversight combined with advanced automation." }],
  battlePlan: n.battlePlan || "Exploit slow legacy competitor turnaround times.",
  competitorWeakness: n.competitorWeakness || "Outdated manual workflows and high friction.",
  competitionNote: n.competitionNote || "Market is currently shifting toward high-speed delivery models.",
  targetAudience: n.targetAudience || "Series B startups and established digital creators.",
  marketingChannels: n.marketingChannels?.slice(0, 4) || ["LinkedIn", "Twitter/X", "Private Communities"],
  painPoints: n.painPoints?.slice(0, 3) || ["Slow delivery", "Low personalization", "Lack of strategy"],
  strategicForecast: n.strategicForecast || "Expect market evolution over the next 12 months; establish authority early."
});

/**
 * Robustly cleans and parses JSON from the Gemini response.
 * Handles common issues like markdown code blocks or trailing text.
 */
const cleanAndParseJSON = (rawText: string): any[] => {
  let cleaned = rawText.trim();
  
  // Remove markdown code block wrappers if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error. Attempting recovery on content:", cleaned.substring(0, 100) + "...");
    // Simple recovery: if it ends abruptly, try to close the array
    if (cleaned.startsWith('[') && !cleaned.endsWith(']')) {
      try {
        // Find last complete object closing brace
        const lastBrace = cleaned.lastIndexOf('}');
        if (lastBrace !== -1) {
          const truncated = cleaned.substring(0, lastBrace + 1) + ']';
          return JSON.parse(truncated);
        }
      } catch (innerError) {
        throw new Error("Critical JSON failure: Output was truncated too early for recovery.");
      }
    }
    throw e;
  }
};

export const fetchNicheData = async (): Promise<Niche[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const unifiedPrompt = `CURRENT DATE: JANUARY 2026.
  ACTION: Perform a high-velocity market scan for 6 elite Fiverr niches.
  
  CRITICAL INSTRUCTION:
  Be extremely concise in text fields. Keep descriptions under 25 words. 
  Ensure all strings are properly terminated. 
  
  CORE MISSION:
  1. 2026 DYNAMICS: Analyze current January 2026 saturation and demand signals.
  2. HYBRID SERVICES: Target niches requiring human strategy coupled with 2026-era automation.
  3. FUTURE FORECAST: Provide a specific outlook for the next 6-12 months.
  4. BATTLE PLAN: Identify specific weaknesses in competitors' current January 2026 profiles.
  
  Use Google Search to verify real-time 2026 marketplace data. Return valid JSON only.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: unifiedPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: unifiedNicheSchema,
        tools: [{ googleSearch: {} }],
        temperature: 0.8,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 4096 }
      },
    });

    const rawText = response.text || "[]";
    const rawResults = cleanAndParseJSON(rawText);
    return rawResults.map(normalizeNiche);
  } catch (error) {
    console.error("Intelligence scan failed:", error);
    throw error;
  }
};
