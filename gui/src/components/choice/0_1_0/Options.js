import styles from "./Options.module.css";

export function Options({ show, handleAdd, handleRemove, handleDisable }) {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.options}>
      <div role="button" onClick={handleAdd} className={`${styles.option} ${styles.left}`}>
        A
      </div>
      <div role="button" onClick={handleRemove} className={styles.option}>
        R
      </div>
      <div role="button" onClick={handleDisable} className={`${styles.option} ${styles.right}`}>
        D
      </div>
    </div>
  );
}
