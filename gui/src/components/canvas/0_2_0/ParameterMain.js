import styles from "./ParameterMain.module.scss";
import { useParameter } from "./context/ParameterContext";

export function ParameterMain({ children }) {
  const { name, isSelected, top } = useParameter();

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
    <div className={classMain}>
      {children}
    </div>
  );
}
