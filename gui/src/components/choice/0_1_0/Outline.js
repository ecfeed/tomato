import styles from "./Outline.module.css";

export function Outline({ children, isDisabled, handleOptionsMouseLeave }) {
  return (
    <div
      className={`${styles.choice} ${isDisabled ? styles.disabled : styles.enabled}`}
      onMouseLeave={handleOptionsMouseLeave}>
      {children}
    </div>
  );
}
