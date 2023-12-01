import styles from "./Choice.module.scss";
import { useParameter } from "./context/ParameterContext";

export function Choice({ name }) {
  const { handleRemoveChoiceLogic } = useParameter();

  return (
    <div className={styles.choice} onClick={() => handleRemoveChoiceLogic(name)}>
      {name}
    </div>
  );
}
