import styles from "./OptionsParameterLeft.module.scss";
import { useParameter } from "./context/ParameterContext";

export function OptionsParameterLeft() {
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
    isFolded,
    top,
  } = useParameter();

  const handleInternalAddParameter = (input) => {
    handleAddParameterParent(input);
  };

  const handleInternalRenameParameter = (input) => {
    handleRenameParameter(input);
  };

  const handleInternalRemoveParameter = (input) => {
    handleRemoveParameterParentInitialLogic(input);
  };

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
      onMouseLeave={handleMouseOptionsLeftLeave}>
      {top ? (
        <div onClick={handleInternalAddParameter}>&larr; Add</div>
      ) : (
        <div onClick={handleInternalAddParameter}>&uarr; Add</div>
      )}
      <div onClick={handleInternalRenameParameter}>Rename</div>
      <div onClick={handleInternalRemoveParameter}>Delete</div>
    </div>
  );
}
