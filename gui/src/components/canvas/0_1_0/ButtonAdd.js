import styles from "./ButtonAdd.module.scss";

export function ButtonAdd({ handleAddMainParameter }) {
  return (
    <button className={styles["button--next"]} onClick={handleAddMainParameter}>
      add
    </button>
  );
}
