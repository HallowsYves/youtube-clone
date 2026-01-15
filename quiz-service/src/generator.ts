import { GoogleGenAI} from "@google/genai";
import { VideoQuiz } from "./types";

const quizSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answer: { type: "STRING" },
          explanation: { type: "STRING" },
        },
        required: ["question", "options", "answer", "explanation"],
      },
    },
  },
  required: ["title", "questions"],
};

export async function generateQuizFromTranscript(transcript: string, videoId: string): Promise<VideoQuiz> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error(" GEMINI_API_KEY is undefined. Check your .env file and import order.");
  }

  delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

  const gemini_ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a 5-question quiz based on this: ${transcript}`;

  try {
    const result = await gemini_ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    return { videoId, ...JSON.parse(result.text || "{}") };
  } catch (error: any) {
    console.error("AI Error Details:", error.message);
    throw error;
  }
}