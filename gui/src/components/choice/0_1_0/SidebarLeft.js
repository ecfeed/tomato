import { SidebarDescriptions } from "./SidebarDescriptions";
import { SidebarAbstract } from "./SidebarAbstract";
import { SidebarRandomized } from "./SidebarRandomized";
import styles from "./SidebarLeft.module.css";
import { useChoices } from "./context/ChoiceContext";

export function SidebarLeft() {
  const { isFolded, isRandomized, isAbstract, descriptions, handleSidebarLeftMouseEnter, handleSidebarLeftMouseLeave} = useChoices();

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
      <SidebarRandomized className={styles.marker} />
      <SidebarAbstract className={styles.marker} />
      <SidebarDescriptions className={styles.marker} />
    </div>
  );
}
