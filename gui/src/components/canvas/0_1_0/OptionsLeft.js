import styles from "./OptionsLeft.module.scss";
import { useParameter } from "./context/ParameterContext";

export function OptionsLeft() {
  const {
    handleAddParameterParent,
    handleMouseOptionsLeftEnter,
    handleMouseOptionsLeftLeave,
    isOnOptionsLeft,
    isOnParameter,
    isOnParameterChild,
    isSelected,
    isLocked,
  } = useParameter();

  if (!isOnParameter || isOnParameterChild || isSelected || isLocked) {
    return null;
  }

  if (!isOnOptionsLeft) {
    return (
      <div
        className={styles["options-left--short"]}
        onMouseEnter={handleMouseOptionsLeftEnter}
        onMouseLeave={handleMouseOptionsLeftLeave}>
        !
      </div>
    );
  }

  return (
    <div
      className={styles["options-left--long"]}
      onMouseEnter={handleMouseOptionsLeftEnter}
      onMouseLeave={handleMouseOptionsLeftLeave}
      onClick={handleAddParameterParent}>
      Add
    </div>
  );
}
