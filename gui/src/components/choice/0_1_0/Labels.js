import Tooltip from "../../tooltip/0_1_0/Tooltip";
import styles from "./Labels.module.css";
import { useChoices } from "./context/ChoiceContext";

export function Labels() {
  const { labels, isOnRightSidebar } = useChoices();

  if (!isOnRightSidebar || !labels) {
    return null;
  }

  return (
    <div className={styles.labels}>
      {labels.map((e, index) => (
        <Tooltip info={e} key={index}>
          <div>- {e}</div>
        </Tooltip>
      ))}
    </div>
  );
}
