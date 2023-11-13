import { SidebarLabels } from "./SidebarLabels";
import styles from './SidebarRight.module.css'

export function SidebarRight({ isFolded, labels, handleMouseEnter, handleMouseLeave }) {
  if (!labels || labels?.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.markers} ${styles.right} ${isFolded ? styles.horizontal : styles.vertical}`}>
      <SidebarLabels
        className={styles.marker}
        labels={labels}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
