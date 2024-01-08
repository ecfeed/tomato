import { useDrop } from "react-dnd";
import { ButtonDefault } from "./ButtonDefault";
import styles from "./ParameterPanel.module.scss";
import { useParameterAction } from "./context/ParameterActionContext";
import { isTop, moveParameter } from "./logic/model";
import { ItemTypes } from "./abstract/ItemTypes";
import { useParameterMouse } from "./context/ParameterMouseContext";

export function ParameterPanel() {
  const {
    id,
    setRoot,
    activeParameter,
    setActiveParameter,
    isLocked,
    isFolded,
    handleAddParameterParentLogic,
  } = useParameterAction();
  const { isDragged, isOnParameter } = useParameterMouse();

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

  if (!isTop(id)) {
    return null;
  }

  if (isFolded) {
    return <div className={styles["panel-parameter--empty"]} />;
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
