import styles from '../../styles/Dashboard.module.css'

export default function CategoriesCard({ categories }) {
  if (!categories) return null

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>🏷️</span>
          Categories Data
        </h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.categoriesInfo}>
          {categories.error ? (
            <p className={styles.errorMessage}>
              <strong>Error:</strong> {categories.error}
            </p>
          ) : (
            <div className={styles.additionalInfo}>
              <h4>Categories Information:</h4>
              <pre className={styles.jsonDisplay}>
                {JSON.stringify(categories, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
