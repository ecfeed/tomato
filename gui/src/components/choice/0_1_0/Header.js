import styles from "./Header.module.css";
import { useChoices } from "./context/ChoiceContext";

export function Header({ children }) {
  const { handleFold, handleOptionsMouseEnter } = useChoices();

  return (
    <div className={styles.main} onMouseOver={handleOptionsMouseEnter} onClick={handleFold}>
      {children}
    </div>
  );
}
