import styles from "./OptionsBottom.module.scss";
import { useParameter } from "./context/ParameterContext";

export function OptionsBottom() {
  const {
    parameters,
    choices,
    handleMouseOptionsBottomEnter,
    handleMouseOptionsBottomLeave,
    handleAddParameter,
    handleAddChoice,
    isOnParameter,
    isOnParameterChild,
    isSelected,
    isLocked,
    isFolded,
  } = useParameter();

  if (!isOnParameter || isOnParameterChild || isSelected || isLocked || isFolded) {
    return null;
  }

  if (parameters?.length > 0 && choices?.length === 0) {
    return (
      <div
        className={styles["options-bottom"]}
        onMouseEnter={handleMouseOptionsBottomEnter}
        onMouseLeave={handleMouseOptionsBottomLeave}>
        <div className={styles["option--center"]} role="button" onClick={handleAddParameter}>
          + p
        </div>
      </div>
    );
  }

  if (parameters?.length === 0 && choices?.length > 0) {
    return (
      <div
        className={styles["options-bottom"]}
        onMouseEnter={handleMouseOptionsBottomEnter}
        onMouseLeave={handleMouseOptionsBottomLeave}>
        <div className={styles["option--center"]} role="button" onClick={handleAddChoice}>
          + c
        </div>
      </div>
    );
  }

  if (parameters?.length === 0 && choices?.length === 0) {
    return (
      <div
        className={styles["options-bottom"]}
        onMouseEnter={handleMouseOptionsBottomEnter}
        onMouseLeave={handleMouseOptionsBottomLeave}>
        <div className={styles["option--left"]} role="button" onClick={handleAddParameter}>
          + p
        </div>
        <div className={styles["option--right"]} role="button" onClick={handleAddChoice}>
          + c
        </div>
      </div>
    );
  }

  return null;
}
