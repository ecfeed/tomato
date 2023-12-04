import styles from "./OptionsLeft.module.scss";
import { useParameter } from "./context/ParameterContext";

export function OptionsLeft() {
  const {
    handleAddParameterParent,
    handleRenameParameter,
    handleRemoveParameterParentInitialLogic,
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
      >
        <div onClick={handleAddParameterParent}>&larr; Add</div>
        <div onClick={handleRenameParameter}>Rename</div>
        <div onClick={handleRemoveParameterParentInitialLogic}>Delete</div>
    
    </div>
  );
}
