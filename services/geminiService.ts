
//import { GoogleGenAI } from "@google/genai";

//const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSpiceExpertAdvice = async (userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: "You are the AI Spice Expert for 'DDH Masale', a premium Indian spice brand. Answer customer queries about spices, culinary uses, storage, and health benefits. Keep it helpful, professional, and slightly traditional.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a little trouble connecting to my spice knowledge right now. Please try again in a moment!";
  }
};
