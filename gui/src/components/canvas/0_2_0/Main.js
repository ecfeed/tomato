import styles from "./Main.module.scss";
import { useParameter } from "./context/ParameterContext";

export function Main({ children }) {
  const { name, isSelected, top, drag } = useParameter();

  const classMain = `
  ${styles["main"]} 
  ${top ? styles["main--top"] : styles["main--nested"]} 
  ${
    isSelected
      ? styles["main--negative"]
      : name.length !== 0
      ? styles["main--default"]
      : styles["main--ephemeral"]
  } 
  `;

  return (
    <div ref={drag} className={classMain}>
      {children}
    </div>
  );
}
