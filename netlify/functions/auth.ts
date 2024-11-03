import { Handler } from '@netlify/functions';
import NextAuth from 'next-auth';
import WorldcoinProvider from 'next-auth/providers/worldcoin';

const authOptions = {
  providers: [
    WorldcoinProvider({
      clientId: process.env.VITE_WLD_APP_ID,
      clientSecret: process.env.VITE_WLD_CLIENT_SECRET,
    }),
  ],
  secret: process.env.VITE_NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.worldcoinId = profile.sub;
        token.verificationType = profile['https://id.worldcoin.org/v1']?.verification_level;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.worldcoinId) {
        session.user.worldcoinId = token.worldcoinId as string;
        session.user.verificationType = token.verificationType as string;
      }
      return session;
    },
  },
};

const handler: Handler = async (event, context) => {
  if (!event.body && event.httpMethod !== 'GET') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' }),
    };
  }

  const req = {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : undefined,
    query: event.queryStringParameters || {},
  };

  try {
    const response = await NextAuth(authOptions)(req as any);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...response.headers,
      },
      body: JSON.stringify(response.body),
    };
  } catch (error) {
    console.error('Auth Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};