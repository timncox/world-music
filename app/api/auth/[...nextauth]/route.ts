import NextAuth from "next-auth";
import WorldcoinProvider from "next-auth/providers/worldcoin";

const handler = NextAuth({
  providers: [
    WorldcoinProvider({
      clientId: process.env.WORLD_APP_ID!,
      clientSecret: process.env.WORLD_APP_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.worldcoinId = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.worldcoinId) {
        session.user.worldcoinId = token.worldcoinId as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };