import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../../styles/Auth.module.css'

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query

  const getErrorDetails = (error) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          message: 'There is a problem with the authentication configuration. Please contact support if this issue persists.',
          icon: '⚙️'
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this application. Please contact your administrator if you believe this is an error.',
          icon: '🚫'
        }
      case 'Verification':
        return {
          title: 'Verification Failed',
          message: 'The verification token has expired or has already been used. Please try signing in again.',
          icon: '⏰'
        }
      case 'Default':
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during authentication. Please try again or contact support if the problem persists.',
          icon: '❌'
        }
      case 'Signin':
        return {
          title: 'Sign In Error',
          message: 'There was a problem signing you in. Please check your credentials and try again.',
          icon: '🔐'
        }
      case 'OAuthSignin':
        return {
          title: 'OAuth Sign In Error',
          message: 'There was a problem connecting to CloudPrinter. Please try again or contact support.',
          icon: '🔗'
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          message: 'There was a problem processing the authentication response from CloudPrinter. Please try signing in again.',
          icon: '↩️'
        }
      case 'OAuthCreateAccount':
        return {
          title: 'Account Creation Error',
          message: 'There was a problem creating your account. Please try again or contact support.',
          icon: '👤'
        }
      case 'EmailCreateAccount':
        return {
          title: 'Email Account Error',
          message: 'There was a problem with email account creation. Please try again.',
          icon: '📧'
        }
      case 'Callback':
        return {
          title: 'Callback Error',
          message: 'There was a problem with the authentication callback. Please try signing in again.',
          icon: '🔄'
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          message: 'This account is not linked to your CloudPrinter profile. Please contact support to link your accounts.',
          icon: '🔗'
        }
      case 'EmailSignin':
        return {
          title: 'Email Sign In Error',
          message: 'There was a problem sending the sign in email. Please try again.',
          icon: '📨'
        }
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          message: 'The credentials you provided are invalid. Please check your username and password.',
          icon: '🔑'
        }
      case 'SessionRequired':
        return {
          title: 'Session Required',
          message: 'You need to be signed in to access this page. Please sign in and try again.',
          icon: '🔒'
        }
      default:
        return {
          title: 'Unknown Error',
          message: 'An unknown error occurred. Please try again or contact support if the problem persists.',
          icon: '❓'
        }
    }
  }

  const errorDetails = getErrorDetails(error)

  return (
    <div className={styles.errorContainer}>
      <Head>
        <title>Authentication Error - CloudPrinter App</title>
        <meta name="description" content="Authentication error occurred" />
      </Head>

      <div className={styles.errorCard}>
        <div className={styles.errorIcon}>
          {errorDetails.icon}
        </div>

        <h1 className={styles.errorTitle}>
          {errorDetails.title}
        </h1>

        <p className={styles.errorMessage}>
          {errorDetails.message}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signin" className={styles.backButton}>
            ← Try Again
          </Link>
        </div>

        {error && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Error Code: <code style={{ background: '#e5e7eb', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{error}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
