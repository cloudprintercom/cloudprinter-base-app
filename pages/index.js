import Head from 'next/head'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Automatically redirect to dashboard after successful OAuth2 authorization
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [status, session, router])

  return (
    <div className={styles.container}>
      <Head>
        <title>CloudPrinter App - Next.js with OAuth2</title>
        <meta name="description" content="Next.js app with CloudPrinter OAuth2 authentication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.cloudprinter}>CloudPrinter</span> App!
        </h1>

        <p className={styles.description}>
          Base App with Cloudprinter OAuth2 authentication
        </p>

        {/* Authentication Status */}
        <div className={styles.authSection}>
          {status === 'loading' && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading authentication status...</p>
            </div>
          )}

          {status === 'authenticated' && session && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Redirecting to dashboard...</p>
            </div>
          )}

          {status === 'unauthenticated' && (
            <div className={styles.signInSection}>
              <div className={styles.signInCard}>
                <button
                  onClick={() => signIn('cloudprinter')}
                  className={styles.signInButton}
                >
                  Sign in with Cloudprinter account.
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.cloudprinter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Cloudprinter.com
        </a>
      </footer>
    </div>
  )
}
