import styles from "./ParameterOptions.module.scss";
import { useParameterAction } from "./context/ParameterActionContext";
import { useParameterMouse } from "./context/ParameterMouseContext";

export function ParameterOptions() {
  const {
    parameters,
    choices,
    handleAddParameter,
    handleAddChoice,
    isSelected,
    isLocked,
    isFolded,
  } = useParameterAction();
  const {
    handleMouseOptionsBottomEnter,
    handleMouseOptionsBottomLeave,
    isOnParameter,
    isOnParameterChild,
  } = useParameterMouse();

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
