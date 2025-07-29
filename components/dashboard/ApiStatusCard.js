import styles from '../../styles/Dashboard.module.css'

export default function ApiStatusCard({ session, userProfile }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>🖨️</span>
          CloudPrinter API
        </h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.apiStatus}>
          <p><strong>Status:</strong>
            <span className={`${styles.statusBadge} ${session.accessToken ? styles.statusBadgeConnected : styles.statusBadgeDisconnected}`}>
              {session.accessToken ? '✅ Connected' : '❌ Not Connected'}
            </span>
          </p>
          <p><strong>Scope:</strong> read-write</p>
          {userProfile && (
            <div className={styles.additionalInfo}>
              <h4>User Info Data:</h4>
              <pre className={styles.jsonDisplay}>
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
