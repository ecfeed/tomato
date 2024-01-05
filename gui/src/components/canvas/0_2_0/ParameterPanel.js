import { useDrop } from "react-dnd";
import { ButtonDefault } from "./ButtonDefault";
import styles from "./ParameterPanel.module.scss";
import { useParameter } from "./context/ParameterContext";
import { moveParameter } from "./logic/model";
import { ItemTypes } from "./abstract/ItemTypes";

export function ParameterPanel() {
  const {
    id,
    top,
    setRoot,
    activeParameter,
    setActiveParameter,
    isLocked,
    isFolded,
    isDragged,
    isOnParameter,
    handleAddParameterParentLogic,
  } = useParameter();

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PARAMETER,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item) {
      const candidate = moveParameter(item.id, id);
      setActiveParameter(null);
      setRoot(candidate);
    },
  }));

  if (!top) {
    return null;
  }

  const handleInternalAddParameter = (input) => {
    handleAddParameterParentLogic(input);
  };

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
      {isOnParameter && !isFolded && !isLocked && !isDragged && activeParameter === id && (
        <div className={styles["panel-parameter__icon"]}>+</div>
      )}
    </>
  );
}
