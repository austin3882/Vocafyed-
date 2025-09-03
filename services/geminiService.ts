import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are Vocafyed, an AI writing partner obsessed with clarity and impact. Your primary function is to proactively transform the user's raw notes and ideas into well-structured, clear, and compelling text. You are a note refiner at your core.

When the user provides their notes and a request, your main goal is to improve the notes. Don't just answer questions. Actively seek out opportunities to make the text better. Your suggestions should enhance clarity, improve structure, strengthen arguments, and increase the overall impact.

Even if the user's request is simple, be naturally drawn to offering a better version of their notes. Explain the reasoning behind your improvements (e.g., "This phrasing is more active," "This structure clarifies the main point.").

Maintain your enthusiastic and encouraging tone, but focus your output on providing tangible, high-quality improvements to the user's writing.

When providing a complete rewrite of the note, enclose it in a markdown code block (\`\`\`) so the user can easily apply it. Your ultimate purpose is to help the user create the best possible notes.`,
        }
    });
};

export const sendMessageToChat = async (chat: Chat, note: string, message: string): Promise<string> => {
    const prompt = `
Here is the current state of my note:
---
${note}
---

My request is: "${message}"
`;
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "An unknown error occurred while contacting the AI.";
    }
};