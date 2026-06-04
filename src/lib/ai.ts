import OpenAI from "openai";

export const ai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const MODEL = "deepseek-chat";

export async function chat(system: string, userMessage: string, maxTokens = 350): Promise<string> {
  const response = await ai.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}
