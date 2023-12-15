import styles from "./ButtonAdd.module.scss";

export function ButtonAdd({ handleAddMainParameter }) {
  return (
    <button className={styles["button--next"]} onClick={handleAddMainParameter}>
      <div className={styles['button--text']}>add</div>
      <div className={styles['button--text']}>parameter</div>
    </button>
  );
}
