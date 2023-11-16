import styles from './PageSidebar.module.css'

export function PageSidebar() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.version}>Version</div>
            <div className={styles.list}>Other</div>
        </div>
    )
}
