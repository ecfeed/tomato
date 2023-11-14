import { SidebarDescriptions } from "./SidebarDescriptions";
import { SidebarAbstract } from "./SidebarAbstract";
import { SidebarRandomized } from "./SidebarRandomized";
import styles from "./SidebarLeft.module.css";

export function SidebarLeft({
  isFolded,
  isRandomized,
  isAbstract,
  descriptions,
  handleSidebarLeftMouseEnter,
  handleSidebarLeftMouseLeave,
}) {

  if (!(isAbstract || isRandomized || descriptions || descriptions?.length === 0)) {
    return null;
  }

  return (
    <div
      className={`${styles.markers} ${styles.left} ${
        isFolded ? styles.horizontal : styles.vertical
      }`}
      onMouseEnter={handleSidebarLeftMouseEnter}
      onMouseLeave={handleSidebarLeftMouseLeave}>
      <SidebarRandomized className={styles.marker} isRandomized={isRandomized} isAbstract={isAbstract} />
      <SidebarAbstract className={styles.marker} isAbstract={isAbstract} />
      <SidebarDescriptions className={styles.marker} descriptions={descriptions} />
    </div>
  );
}
