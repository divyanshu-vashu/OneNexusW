// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import axios from "axios";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       // Send Google user data to your backend
//       try {
//         await axios.post("http://localhost:5000/google-login", {
//           name: user.name,
//           email: user.email,
//         });
//         return true;
//       } catch (error) {
//         console.error("Google login sync failed:", error);
//         return false;
//       }
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id || token.sub;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL || 'http://localhost:3000'}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              accessToken: account.id_token,
            }),
          });

          if (!response.ok) {
            console.error('Failed to sync user with backend');
            return false;
          }

          const data = await response.json();
          user.id = data.user?.id || user.email;
          return true;
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          return false;
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };