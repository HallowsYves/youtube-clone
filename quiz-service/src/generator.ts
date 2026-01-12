import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { VideoQuiz } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const quizSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { 
      type: SchemaType.STRING 
    },
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          options: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING } 
          },
          answer: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING },
        },
        required: ["question", "options", "answer", "explanation"],
      },
    },
  },
  required: ["title", "questions"],
};

export async function generateQuizFromTranscript(transcript: string, videoId: string): Promise<VideoQuiz> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: quizSchema,
    },
  });

  const prompt = `Generate a 5-question educational quiz based on this transcript: ${transcript}`;
  const result = await model.generateContent(prompt);
  
  const quizData = JSON.parse(result.response.text());
  return { videoId, ...quizData };
}