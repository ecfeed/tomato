import Tooltip from "../../tooltip/0_1_0/Tooltip";
import styles from './ViewSimple.module.css'
import { useChoices } from "./context/ChoiceContext";

export function ViewSimple() {
  const { name } = useChoices();

  return (
    <div className={styles.folded}>
      <Tooltip info={name}>{name}</Tooltip>
    </div>
  );
}
