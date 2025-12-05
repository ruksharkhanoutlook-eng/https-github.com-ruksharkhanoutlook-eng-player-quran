import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchQuranWithGemini = async (query: string): Promise<SearchResult> => {
  if (!query.trim()) return { surahNumbers: [] };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Query: "${query}"
      
      Task: Identify which Quran Surah number(s) (1-114) the user is looking for.
      
      Rules:
      1. If the user asks for a specific "Sipara" or "Juz" (e.g., "Sipara 1"), return ALL Surah numbers that are contained in or start in that Sipara.
      2. If the user asks for a specific "Surah" by name or number (e.g., "Surah 22", "Surah Yasin"), return that specific number.
      3. If the user asks for BOTH (e.g., "Sipara 1 Surah 22", "Juz 30 and Surah Fatiha"), return the combined list of Surahs (union of both sets).
      4. If the user describes a topic (e.g., "Surah about cows", "Heart of Quran"), return the relevant Surah number(s).
      5. Return ONLY the JSON object.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            surahNumbers: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: "Array of Surah numbers (1-114) matching the query"
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of why these were chosen (e.g. 'Surahs in Sipara 1 and Surah 22')"
            }
          },
          required: ["surahNumbers"]
        }
      }
    });

    const text = response.text;
    if (!text) return { surahNumbers: [] };
    
    return JSON.parse(text) as SearchResult;
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { surahNumbers: [], reasoning: "Search failed. Please try again." };
  }
};