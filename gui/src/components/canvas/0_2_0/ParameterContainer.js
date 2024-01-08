import styles from "./ParameterContainer.module.scss";
import { useParameter } from "./context/ParameterContext";
import { isTop } from "./logic/model";

export function ParameterContainer({ children }) {
  const { id, isFolded, handleMouseParameterEnter, handleMouseParameterLeave } =
    useParameter();

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
