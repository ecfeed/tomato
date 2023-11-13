import { SidebarDescriptions } from "./SidebarDescriptions";
import { SidebarAbstract } from "./SidebarAbstract";
import { SidebarRandomized } from "./SidebarRandomized";
import styles from "./SidebarLeft.module.css";

export function SidebarLeft({
  isFolded,
  isRandom,
  isAbstract,
  descriptions,
  handleMouseEnter,
  handleMouseLeave,
}) {
  if (!(isAbstract || isRandom || descriptions || descriptions?.length === 0)) {
    return null;
  }

  return (
    <div
      className={`${styles.markers} ${styles.left} ${
        isFolded ? styles.horizontal : styles.vertical
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <SidebarRandomized className={styles.marker} isRandom={isRandom} isAbstract={isAbstract} />
      <SidebarAbstract className={styles.marker} isAbstract={isAbstract} />
      <SidebarDescriptions className={styles.marker} descriptions={descriptions} />
    </div>
  );
}
