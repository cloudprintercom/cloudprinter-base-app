import styles from '../../styles/Dashboard.module.css'

export default function SessionCard({ session }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>🔐</span>
          Session Details
        </h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.sessionInfo}>
          <p><strong>Provider:</strong> CloudPrinter</p>
          <p><strong>Access Token:</strong>
            <span className={styles.tokenPreview}>
              {session.accessToken ? '••••••••' + session.accessToken.slice(-8) : 'Not available'}
            </span>
          </p>
          <p><strong>Session Expires:</strong> {session.expires || 'Not specified'}</p>
        </div>
      </div>
    </div>
  )
}
