import styles from "./Options.module.css";
import { useChoices } from "./context/ChoiceContext";

export function Options() {
  const { isControlled, isOnLeftSidebar, isOnRightSidebar, handleChoiceAdd, handleChoiceRemoveInitial, handleDisable } = useChoices();
  const show = isControlled && !isOnLeftSidebar && !isOnRightSidebar;

  if (!show) {
    return null;
  }

  return (
    <div className={styles.options}>
      <div role="button" onClick={handleChoiceAdd} className={`${styles.option} ${styles.left}`}>
        A
      </div>
      <div role="button" onClick={handleChoiceRemoveInitial} className={styles.option}>
        R
      </div>
      <div role="button" onClick={handleDisable} className={`${styles.option} ${styles.right}`}>
        D
      </div>
    </div>
  );
}
