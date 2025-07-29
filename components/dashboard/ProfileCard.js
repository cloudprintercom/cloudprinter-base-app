import styles from '../../styles/Dashboard.module.css'

export default function ProfileCard({ session }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>👤</span>
          Profile Information
        </h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.profileInfo}>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className={styles.avatar}
            />
          )}
          <div className={styles.userDetails}>
            <p><strong>Name:</strong> {session.user?.name || 'Not provided'}</p>
            <p><strong>Email:</strong> {session.user?.email || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
