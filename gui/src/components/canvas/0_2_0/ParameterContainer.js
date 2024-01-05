import styles from "./ParameterContainer.module.scss";
import { useParameter } from "./context/ParameterContext";

export function ParameterContainer({ children }) {
  const { id, top, isFolded, handleMouseParameterEnter, handleMouseParameterLeave } =
    useParameter();

  const classStyle = isFolded
    ? styles["container--folded"]
    : top
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
