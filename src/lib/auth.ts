import { AuthOptions } from 'next-auth';
import WorldcoinProvider from 'next-auth/providers/worldcoin';

export const authOptions: AuthOptions = {
  providers: [
    WorldcoinProvider({
      clientId: import.meta.env.VITE_WLD_APP_ID,
      clientSecret: import.meta.env.VITE_WLD_CLIENT_SECRET,
    }),
  ],
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
  secret: import.meta.env.VITE_NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/',
    error: '/',
  },
};