import styles from "./ParameterContainer.module.scss";
import { useParameterAction } from "./context/ParameterActionContext";
import { useParameterMouse } from "./context/ParameterMouseContext";
import { isTop } from "./logic/model";

export function ParameterContainer({ children }) {
  const { id, isFolded } = useParameterAction();
  const { handleMouseParameterEnter, handleMouseParameterLeave } = useParameterMouse();

  const classStyle = isFolded
    ? styles["container--folded"]
    : isTop(id)
    ? styles["container--top"]
    : styles["container--nested"];

  return (
    <div
      key={id}
      className={`${styles["container"]} ${classStyle}`}
      onMouseEnter={handleMouseParameterEnter}
      onMouseLeave={handleMouseParameterLeave}>
      {children}
    </div>
  );
}
