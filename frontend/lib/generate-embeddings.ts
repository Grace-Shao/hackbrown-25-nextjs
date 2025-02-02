import OpenAI from 'openai';
const TEXT_EMBEDDING_MODEL = 'text-embedding-3-small';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Configuration for OpenAI client
 */
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  maxRetries: MAX_RETRIES,
  timeout: 30000 // 30 second timeout
});

/**
 * Generates an embedding vector for the given text using OpenAI's API
 * @param text - The text to generate an embedding for
 * @returns Promise resolving to array of embedding numbers
 * @throws Error if OpenAI API call fails after retries
 */
export const generateEmbedding = async(text: string): Promise<number[]> => {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    // Make API call with retries
    const response = await retry(
      async () => await openai.embeddings.create({
        model: TEXT_EMBEDDING_MODEL,
        input: text.trim(),
      }),
      MAX_RETRIES,
      RETRY_DELAY_MS
    );

    return response.data[0].embedding;

  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Helper function to retry failed API calls
 */
async function retry<T>(
  fn: () => Promise<T>, 
  retries: number, 
  delay: number
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay);
    }
    throw error;
  }
}
