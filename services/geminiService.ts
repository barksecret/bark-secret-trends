// The Gemini SDK is no longer used on the client-side.
// We now call our own secure serverless function which acts as a proxy.

/**
 * The AI initialization check is no longer needed on the client.
 * If the function fails, the UI will show an error from the API call.
 * This function is kept to avoid breaking the component that uses it,
 * but it will now always return null. The button will always be enabled
 * and the check happens on click.
 */
export function getAiInitializationError(): string | null {
  return null;
}

/**
 * Calls our secure serverless function to "respin" an article's content.
 * @param title The original article title.
 * @param excerpt The original article excerpt.
 * @returns A promise that resolves to the AI-generated markdown string.
 * @throws An error if the API call fails.
 */
export async function respinArticleContent(title: string, excerpt: string): Promise<string> {
  // The endpoint for our serverless function. Netlify automatically proxies this.
  const endpoint = '/.netlify/functions/respin';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, excerpt }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Use the error from the serverless function if available, otherwise a default.
      throw new Error(data.error || `Request to AI service failed with status ${response.status}`);
    }

    if (!data.content) {
      throw new Error("Received an empty response from the AI service.");
    }

    return data.content;

  } catch (error: any) {
    console.error("Error calling respin function:", error);
    // Provide a user-friendly error message for the UI.
    throw new Error("Sorry, the AI was unable to respin this article. Please try again later.");
  }
}
