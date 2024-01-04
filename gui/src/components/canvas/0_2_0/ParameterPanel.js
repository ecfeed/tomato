import { ButtonDefault } from "./ButtonDefault";
import styles from "./ParameterPanel.module.scss";
import { useParameter } from "./context/ParameterContext";

export function ParameterPanel() {
  const { top, isLocked, isFolded, isOnParameter, drop, canDrop, handleAddParameterParentLogic } = useParameter();

  if (!top) {
    return null;
  }

  const handleInternalAddParameter = (input) => {
    handleAddParameterParentLogic(input);
  };

  return (
    <>
      <div ref={drop} className={isLocked ? styles["panel-parameter"] : styles["panel-parameter--active"]}>
        <ButtonDefault
          handler={handleInternalAddParameter}
          text="add\nparameter"
          forceBackground={true}
        />
      </div>
      {isOnParameter && !isFolded && !isLocked && (
        <div className={styles["panel-parameter__icon"]}>+</div>
      )}
    </>
  );
}
