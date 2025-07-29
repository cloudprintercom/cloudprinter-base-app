import styles from '../../styles/Dashboard.module.css'

export default function Header({ session, onSignOut }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>Cloudprinter Demo App</h1>
        <div className={styles.userActions}>
          <span className={styles.welcome}>
            Welcome, {session.user?.name || session.user?.email || 'User'}!
          </span>
          <button onClick={onSignOut} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
