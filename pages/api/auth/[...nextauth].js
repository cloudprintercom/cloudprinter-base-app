import NextAuth from 'next-auth'
import { CLOUDPRINTER_API } from '../../../lib/constants'

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url = CLOUDPRINTER_API.OAUTH.TOKEN_URL

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.CLOUDPRINTER_CLIENT_ID,
        client_secret: process.env.CLOUDPRINTER_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log("Error refreshing access token:", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth({
  providers: [
    {
      id: "cloudprinter",
      name: "CloudPrinter",
      type: "oauth",
      authorization: {
        url: CLOUDPRINTER_API.OAUTH.AUTHORIZE_URL,
        params: {
          scope: "read-write",
          response_type: "code",
        }
      },
      token: CLOUDPRINTER_API.OAUTH.TOKEN_URL,
      userinfo: {
        // CloudPrinter doesn't have a standard userinfo endpoint
        // We'll need to make a custom request to get user data
        url: `${CLOUDPRINTER_API.BASE_URL}${CLOUDPRINTER_API.ENDPOINTS.USER_INFO}`,
        async request(context) {
          const response = await fetch(`${CLOUDPRINTER_API.BASE_URL}${CLOUDPRINTER_API.ENDPOINTS.USER_INFO}`, {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          })
          return await response.json()
        }
      },
      clientId: process.env.CLOUDPRINTER_CLIENT_ID,
      clientSecret: process.env.CLOUDPRINTER_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.user.email,
          name: profile.user.name,
          email: profile.user.email,
          image: ''
        }
      },
    }
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at * 1000 // Convert to milliseconds
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.error = token.error
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign in
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
