// Global type declarations for missing modules

declare module 'json5' {
  const json5: any;
  export = json5;
}

declare module 'phoenix' {
  const phoenix: any;
  export = phoenix;
}

// Extend global types if needed
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      REDIS_URL: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};