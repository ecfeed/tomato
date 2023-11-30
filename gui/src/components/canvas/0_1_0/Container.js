import styles from "./Container.module.scss";
import { useParameter } from "./context/ParameterContext";

export function Container({ children }) {
  const { isFolded, top, handleMouseParameterEnter, handleMouseParameterLeave } = useParameter();
  
  return (
    <div
      className={`${styles["container"]} ${
        isFolded
          ? styles["container--folded"]
          : top
          ? styles["container--top"]
          : styles["container--nested"]
      }`}
      onMouseEnter={handleMouseParameterEnter}
      onMouseLeave={handleMouseParameterLeave}>
      {children}
    </div>
  );
}
