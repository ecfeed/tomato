import styles from "./Container.module.scss";

export function Container({
  children,
  isFolded,
  top,
  handleMouseParameterEnter,
  handleMouseParameterLeave,
}) {
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
