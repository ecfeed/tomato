import styles from "./OptionsLeft.module.scss";

export function OptionsLeft({
  handleAppParameterParent,
  handleMouseOptionsLeftEnter,
  handleMouseOptionsLeftLeave,
  isOnOptionsRight,
  isOnParameter,
  isOnParameterChild,
  isSelected,
  isLocked,
  isFolded,
}) {
  if (!isOnParameter || isOnParameterChild || isSelected || isLocked || isFolded) {
    return null;
  }

  if (!isOnOptionsRight) {
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
      onClick={handleAppParameterParent}>
      Add
    </div>
  );
}
