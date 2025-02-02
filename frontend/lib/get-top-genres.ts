import { Pinecone } from '@pinecone-database/pinecone';

interface PineconeMatch {
  id: string;
  score: number;
  metadata: {
    genres?: string[];
  };
}

interface PineconeResponse {
  matches: PineconeMatch[];
}

const pinecone = new Pinecone({
  apiKey: "pcsk_5LUkk4_AVUjAQr5WKiicKoM2494iUPCqrfLzDKBjzxAP9AScyR5KVx5JNzAWybAQJXBzZu",
});

const index = pinecone.index('hackbrown-search');

export async function getTopGenres(input: number[], genre: string): Promise<string[]> {
  try {
    const queryResponse = await index.query({
      topK: 10,
      includeMetadata: true,
      vector: input,
      filter: {
        genre: { $eq: genre }
      }
    });

    const topGenres = queryResponse.matches.map(match => {
      if (Array.isArray(match.metadata?.genres)) {
        return match.metadata.genres[0] as string;
      }
      return '';
    });
    return topGenres;
  } catch (error) {
    console.error('Failed to query Pinecone:', error);
    throw error;
  }
}