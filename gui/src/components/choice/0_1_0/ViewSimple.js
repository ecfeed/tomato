import Tooltip from "../../tooltip/0_1_0/Tooltip";
import styles from './ViewSimple.module.css'

export function ViewSimple({ name }) {
  return (
    <div className={styles.folded}>
      <Tooltip info={name}>{name}</Tooltip>
    </div>
  );
}
