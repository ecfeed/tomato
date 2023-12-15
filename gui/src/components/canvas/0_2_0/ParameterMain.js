import styles from "./ParameterMain.module.scss";
import { useParameter } from "./context/ParameterContext";

export function ParameterMain({ children }) {
  const { name, isSelected, top } = useParameter();

  const classMain = `
  ${top ? styles["position--top"] : styles["position--nested"]} 
  ${
    isSelected
      ? styles["style--negative"]
      : name.length !== 0
      ? styles["style--default"]
      : styles["style--ephemeral"]
  } 
  `;

  return (
    <div className={classMain}>
      {children}
    </div>
  );
}
