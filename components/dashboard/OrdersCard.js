import styles from '../../styles/Dashboard.module.css'

export default function OrdersCard({ orders }) {
  if (!orders) return null

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>📋</span>
          Orders Data
        </h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.ordersInfo}>
          {orders.error ? (
            <p className={styles.errorMessage}>
              <strong>Error:</strong> {orders.error}
            </p>
          ) : (
            <div className={styles.additionalInfo}>
              <h4>Orders Information:</h4>
              <pre className={styles.jsonDisplay}>
                {JSON.stringify(orders, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
