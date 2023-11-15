import styles from "./Outline.module.css";
import { useChoices } from "./context/ChoiceContext";

export function Outline({ children }) {
  const { isDisabled, handleOptionsMouseLeave } = useChoices();

  return (
    <div
      className={`${styles.choice} ${isDisabled ? styles.disabled : styles.enabled}`}
      onMouseLeave={handleOptionsMouseLeave}>
      {children}
    </div>
  );
}
