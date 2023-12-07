import styles from "./Main.module.scss";
import { useParameter } from "./context/ParameterContext";

export function Main({ children }) {
  const { isSelected, top, drag } = useParameter();

  return (
    <div ref={drag}
      className={`${styles["main"]} ${
        isSelected ? styles["main--negative"] : styles["main--default"]
      } ${top ? styles["main--top"] : styles["main--nested"]}`}>
      {children}
    </div>
  );
}
