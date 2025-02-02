declare global { 
  namespace NodeJS {
    interface ProcessEnv {
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      SPOTIFY_REFRESH_TOKEN: string;
      MONGODB_URI: string;
      NEXT_PUBLIC_PINECONE_API_KEY: string;
      NEXT_PUBLIC_OPENAI_API_KEY: string;
    }
  }
}

export { }