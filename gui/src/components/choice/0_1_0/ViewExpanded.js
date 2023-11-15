import Tooltip from "../../tooltip/0_1_0/Tooltip";
import styles from './ViewExpanded.module.css'
import { useChoices } from "./context/ChoiceContext";

export function ViewExtended() {
  const { name, value } = useChoices();

  return (
    <div className={styles.expanded}>
      <div className={styles.name}>
        <Tooltip info={name}>{name}</Tooltip>
      </div>

      <div className={styles.value}>
        <Tooltip info={value}>{value}</Tooltip>
      </div>
    </div>
  );
}
