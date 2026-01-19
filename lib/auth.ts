import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.FROM_EMAIL,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { Resend: ResendClient } = await import("resend")
        const resend = new ResendClient(provider.apiKey)

        await resend.emails.send({
          from: provider.from!,
          to: identifier,
          subject: "Sign in to RIP Vault",
          html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
              <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Sign in to RIP Vault</h1>
              <p style="color: #666; margin: 20px 0;">
                Click the button below to sign in to your account. This link expires in 24 hours.
              </p>
              <a href="${url}"
                 style="display: inline-block; padding: 12px 24px;
                        background-color: #1c1917; color: white;
                        text-decoration: none; border-radius: 6px;
                        font-weight: 500;">
                Sign In
              </a>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </div>
          `,
        })
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
