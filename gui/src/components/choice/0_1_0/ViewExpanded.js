import Tooltip from "../../tooltip/0_1_0/Tooltip";
import styles from './ViewExpanded.module.css'

export function ViewExtended({ name, value }) {
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
