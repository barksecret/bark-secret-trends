import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI;
let initError: string | null = null;

try {
  // Per guidelines, API key MUST come from environment variables.
  // In a pure browser environment, `process` is not defined.
  // This try-catch block handles that expected error gracefully.
  const apiKey = (process as any).env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  ai = new GoogleGenAI({ apiKey });
} catch (e: any) {
  console.error("Failed to initialize GoogleGenAI:", e);
  // Provide a clear error message to be displayed in the UI.
  if (e.message.includes('process is not defined') || e.message.includes('API_KEY is not defined')) {
     initError = "AI service is not configured. An API_KEY environment variable is required.";
  } else {
     initError = "Failed to initialize the AI service: " + e.message;
  }
}

/**
 * Returns a string with an initialization error message if the AI service
 * failed to start, otherwise returns null.
 */
export function getAiInitializationError(): string | null {
    return initError;
}

/**
 * Uses the Gemini AI to "respin" an article's title and excerpt.
 * @param title The original article title.
 * @param excerpt The original article excerpt.
 * @returns A promise that resolves to the AI-generated markdown string.
 * @throws An error if the API call fails or the service is not initialized.
 */
export async function respinArticleContent(title: string, excerpt: string): Promise<string> {
  if (initError || !ai) {
    throw new Error(initError || "AI Service is not initialized.");
  }

  const prompt = `
    You are an expert content creator and SEO specialist with deep knowledge in herbal remedies, natural wellness, and gardening.
    Your task is to take a given article title and excerpt and "respin" it into a more engaging, insightful, and actionable piece of content.

    **Instructions:**
    1.  **Enhance the Title:** If possible, suggest a more compelling, SEO-friendly title. Start the response with "### New Title Suggestion:".
    2.  **Expand the Content:** Elaborate on the original excerpt. Add new perspectives, practical tips, or related interesting facts. Structure this under a "### Enhanced Summary:" heading.
    3.  **Improve Engagement:** Use a captivating tone. Use bullet points or numbered lists for clarity, and include a call-to-action if appropriate.
    4.  **Maintain Core Topic:** Stay true to the original article's subject matter.
    5.  **Format with Markdown:** Use Markdown for formatting (e.g., **bold**, *italics*, lists).

    **Original Content to Respin:**

    **Title:** "${title}"

    **Excerpt:** "${excerpt}"
  `;

  try {
    // Using the modern, compliant API for content generation.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Using a valid, non-deprecated model.
        contents: prompt
    });

    // Correctly extracting the text from the response object.
    return response.text;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    // Throw a user-friendly error to be displayed in the UI.
    if (error.message.includes('API key not valid')) {
        throw new Error("The request was blocked. Please check if the API key is valid.");
    }
    throw new Error("Sorry, the AI was unable to respin this article. Please try again later.");
  }
}