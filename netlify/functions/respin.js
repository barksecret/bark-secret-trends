// This serverless function runs on Netlify's backend, not in the user's browser.
// It acts as a secure proxy to the Google Gemini API.

export const handler = async (event) => {
  // Dynamically import the @google/genai library from a CDN.
  // This is a simple way to use the dependency without needing a package.json for this function.
  const { GoogleGenAI } = await import("https://esm.sh/@google/genai@^1.9.0");

  // --- Security and Input Validation ---

  // Only allow POST requests.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Securely access the API key from the environment variables set in the Netlify UI.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: API_KEY environment variable not set in Netlify.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "The AI service is not configured on the server." }),
    };
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  let title, excerpt;
  try {
    const body = JSON.parse(event.body);
    title = body.title;
    excerpt = body.excerpt;
    if (!title || !excerpt) {
      throw new Error("Missing title or excerpt in request body");
    }
  } catch(e) {
      return { statusCode: 400, body: JSON.stringify({ error: e.message }) };
  }

  // --- AI Prompt and API Call ---
  
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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const text = response.text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    };

  } catch (error) {
    console.error('Error calling Gemini API in serverless function:', error);
    return {
      statusCode: 502, // Bad Gateway - indicates a problem with the upstream API
      body: JSON.stringify({ error: 'An error occurred while communicating with the AI service.' }),
    };
  }
};
