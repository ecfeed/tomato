import { ButtonDefault } from "./ButtonDefault";
import styles from "./ParameterPanel.module.scss";
import { useParameter } from "./context/ParameterContext";

export function ParameterPanel() {
  const {
    id,
    top,
    activeParameter,
    isLocked,
    isFolded,
    isOnParameter,
    drop,
    handleAddParameterParentLogic,
  } = useParameter();

  if (!top) {
    return null;
  }

  const handleInternalAddParameter = (input) => {
    handleAddParameterParentLogic(input);
  };

  console.log(activeParameter)

  return (
    <>
      <div
        ref={drop}
        className={isLocked ? styles["panel-parameter"] : styles["panel-parameter--active"]}>
        <ButtonDefault
          handler={handleInternalAddParameter}
          text="add\nparameter"
          forceBackground={true}
        />
      </div>
      {isOnParameter && !isFolded && !isLocked && activeParameter === id && (
        <div className={styles["panel-parameter__icon"]}>+</div>
      )}
    </>
  );
}
