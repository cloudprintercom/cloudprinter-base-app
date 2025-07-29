import { useSession, getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Dashboard.module.css'
import Header from '../components/dashboard/Header'
import Loading from '../components/dashboard/Loading'
import ProfileCard from '../components/dashboard/ProfileCard'
import SessionCard from '../components/dashboard/SessionCard'
import ApiStatusCard from '../components/dashboard/ApiStatusCard'
import OrdersCard from '../components/dashboard/OrdersCard'
import CategoriesCard from '../components/dashboard/CategoriesCard'
import QuickActionsCard from '../components/dashboard/QuickActionsCard'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [orders, setOrders] = useState(null)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [categories, setCategories] = useState(null)
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/dashboard'))
      return
    }

    if (session.error === "RefreshAccessTokenError") {
      console.log('Token refresh failed, redirecting to sign in...')
      signOut({ callbackUrl: '/auth/signin?error=TokenRefreshFailed' })
      return
    }

    setLoading(false)
    fetchUserProfile()
  }, [session, status, router])

  const fetchUserProfile = async () => {
    if (!session?.accessToken) return

    try {
      const response = await fetch('/api/cloudprinter/profile')
      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
      } else if (response.status === 401) {
        const errorData = await response.json()
        if (errorData.requiresReauth) {
          console.log('Authentication required, redirecting to sign in...')
          signOut({ callbackUrl: '/auth/signin?error=AuthenticationRequired' })
          return
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const fetchOrders = async () => {
    if (!session?.accessToken) return

    setOrdersLoading(true)
    try {
      const response = await fetch('/api/cloudprinter/orders')
      if (response.ok) {
        const ordersData = await response.json()
        setOrders(ordersData)
      } else if (response.status === 401) {
        const errorData = await response.json()
        if (errorData.requiresReauth) {
          console.log('Authentication required, redirecting to sign in...')
          signOut({ callbackUrl: '/auth/signin?error=AuthenticationRequired' })
          return
        }
        setOrders({ error: 'Authentication failed' })
      } else {
        console.error('Failed to fetch orders:', response.status)
        setOrders({ error: 'Failed to fetch orders' })
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders({ error: error.message })
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchCategories = async () => {
    if (!session?.accessToken) return

    setCategoriesLoading(true)
    try {
      const response = await fetch('/api/cloudprinter/categories')
      if (response.ok) {
        const categoriesData = await response.json()
        setCategories(categoriesData)
      } else if (response.status === 401) {
        const errorData = await response.json()
        if (errorData.requiresReauth) {
          console.log('Authentication required, redirecting to sign in...')
          signOut({ callbackUrl: '/auth/signin?error=AuthenticationRequired' })
          return
        }
        setCategories({ error: 'Authentication failed' })
      } else {
        console.error('Failed to fetch categories:', response.status)
        setCategories({ error: 'Failed to fetch categories' })
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories({ error: error.message })
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (loading || status === 'loading') {
    return <Loading />
  }

  if (!session) {
    return null
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard - CloudPrinter App</title>
        <meta name="description" content="Your CloudPrinter dashboard" />
      </Head>

      <Header session={session} onSignOut={handleSignOut} />

      <main className={styles.main}>
        <div className={styles.grid}>
          <ProfileCard session={session} />

          <SessionCard session={session} />

          <ApiStatusCard session={session} userProfile={userProfile} />

          <OrdersCard orders={orders} />

          <CategoriesCard categories={categories} />

          <QuickActionsCard
            onRefreshProfile={fetchUserProfile}
            onFetchOrders={fetchOrders}
            onFetchCategories={fetchCategories}
            ordersLoading={ordersLoading}
            categoriesLoading={categoriesLoading}
          />
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=' + encodeURIComponent('/dashboard'),
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
