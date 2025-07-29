import styles from '../../styles/Dashboard.module.css'

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    </div>
  )
}
