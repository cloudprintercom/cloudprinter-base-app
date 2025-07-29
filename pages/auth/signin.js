import { getProviders, signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../../styles/Auth.module.css'

export default function SignIn({ providers }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { error } = router.query

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  const handleSignIn = async (providerId) => {
    setLoading(true)
    try {
      await signIn(providerId, {
        callbackUrl: router.query.callbackUrl || '/'
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setLoading(false)
    }
  }

  const getErrorMessage = (error) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The verification token has expired or has already been used.'
      default:
        return 'An error occurred during sign in. Please try again.'
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sign In - CloudPrinter App</title>
        <meta name="description" content="Sign in to your CloudPrinter account" />
      </Head>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to CloudPrinter</h1>
          <p className={styles.subtitle}>
            Sign in to access your printing dashboard
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <p>{getErrorMessage(error)}</p>
          </div>
        )}

        <div className={styles.providers}>
          {Object.values(providers || {}).map((provider) => (
            <div key={provider.name} className={styles.provider}>
              <button
                onClick={() => handleSignIn(provider.id)}
                disabled={loading}
                className={styles.signInButton}
              >
                {loading ? (
                  <span className={styles.loading}>Signing in...</span>
                ) : (
                  <>
                    <span className={styles.providerIcon}>🖨️</span>
                    Sign in with {provider.name}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.info}>
          <p>
            By signing in, you agree to CloudPrinter's terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
