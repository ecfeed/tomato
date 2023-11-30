import styles from "./OptionsLeft.module.scss";

export function OptionsLeft({
  handleAddParameterParent,
  handleMouseOptionsLeftEnter,
  handleMouseOptionsLeftLeave,
  isOnOptionsLeft,
  isOnParameter,
  isOnParameterChild,
  isSelected,
  isLocked,
  isFolded,
}) {
  if (!isOnParameter || isOnParameterChild || isSelected || isLocked || isFolded) {
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
