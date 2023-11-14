import styles from "./Header.module.css";

export function Header({ children, handleFold, handleOptionsMouseEnter }) {
  return (
    <div className={styles.main} onMouseOver={handleOptionsMouseEnter} onClick={handleFold}>
      {children}
    </div>
  );
}
