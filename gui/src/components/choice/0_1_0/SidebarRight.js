import { SidebarLabels } from "./SidebarLabels";
import styles from "./SidebarRight.module.css";
import { useChoices } from "./context/ChoiceContext";

export function SidebarRight() {
  const { isFolded, labels } = useChoices();

  if (!labels || labels?.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.markers} ${styles.right} ${
        isFolded ? styles.horizontal : styles.vertical
      }`}>
      <SidebarLabels className={styles.marker} />
    </div>
  );
}
