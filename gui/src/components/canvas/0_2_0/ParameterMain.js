import { useDrag, useDragLayer } from "react-dnd";
import styles from "./ParameterMain.module.scss";
import { useParameterAction } from "./context/ParameterActionContext";

import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect } from "react";
import { ItemTypes } from "./abstract/ItemTypes";
import { isTop } from "./logic/model";
import { useParameterMouse } from "./context/ParameterMouseContext";

export function ParameterMain({ children }) {
  const { id, name, isFolded, isSelected } = useParameterAction();
  const { setIsDragged} = useParameterMouse();

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.PARAMETER,
    item: { id, name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    setIsDragged(isDragging);
  }, [isDragging, setIsDragged]);

  useEffect(() => {
    dragPreview(getEmptyImage());
  }, [dragPreview]);

  const classType = isTop(id) ? isFolded ? styles['position--folded'] : styles["position--top"] : styles["position--nested"];
  const classStyle = isSelected
    ? styles["style--negative"]
    : name.length !== 0
    ? styles["style--default"]
    : styles["style--ephemeral"];
  const classMain = `${classType} ${classStyle}`;

  return (
    <>
      <div ref={isFolded ? null : drag} className={classMain}>
        {children}
      </div>
      <ParameterMainDragLayer id={id}/>
    </>
  );
}

const ParameterMainDragLayer = ({ id }) => {
  const { isDragging, currentOffset, item } = useDragLayer((monitor) => {
    return {
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
      item: monitor.getItem(),
    };
  });

  return isDragging && currentOffset && id === item.id? (
    <div
      style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
      className={styles["drag"]}>
      {item.name}
    </div>
  ) : null;
};
