import styles from "./Main.module.scss";

export function Main({ children, isSelected, top }) {
  return (
    <div
      className={`${styles["main"]} ${
        isSelected ? styles["main--negative"] : styles["main--default"]
      } ${top ? styles["main--top"] : styles["main--nested"]}`}>
      {children}
    </div>
  );
}
