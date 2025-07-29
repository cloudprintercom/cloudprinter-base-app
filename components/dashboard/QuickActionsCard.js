import styles from '../../styles/Dashboard.module.css'

export default function QuickActionsCard({
  onRefreshProfile,
  onFetchOrders,
  onFetchCategories,
  ordersLoading,
  categoriesLoading
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>⚡</span>
          Quick Actions
        </h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.actions}>
          <button
            onClick={onRefreshProfile}
            className={styles.actionButton}
          >
            🔄 Refresh Profile
          </button>
          <button
            onClick={onFetchOrders}
            className={styles.actionButton}
            disabled={ordersLoading}
          >
            {ordersLoading ? '⏳ Loading...' : '📋 Fetch Orders'}
          </button>
          <button
            onClick={onFetchCategories}
            className={styles.actionButton}
            disabled={categoriesLoading}
          >
            {categoriesLoading ? '⏳ Loading...' : '🏷️ Fetch Categories'}
          </button>
        </div>
      </div>
    </div>
  )
}
