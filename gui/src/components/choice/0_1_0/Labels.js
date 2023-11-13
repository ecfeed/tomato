import Tooltip from "../../tooltip/0_1_0/Tooltip";
import styles from "./Labels.module.css";

export function Labels({ labels, show }) {
  if (!show || !labels) {
    return null;
  }

  return (
    <div className={styles.labels}>
      {labels.map((e) => (
        <Tooltip info={e}>
          <div>- {e}</div>
        </Tooltip>
      ))}
    </div>
  );
}
