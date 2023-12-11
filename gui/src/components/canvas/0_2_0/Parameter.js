import styles from "./Parameter.module.scss";
import { useParameter } from "./context/ParameterContext";

export function Parameter({ children }) {
  const { top, isFolded } = useParameter();

  return (
    <div
      className={`${styles["parameter"]} ${isFolded ? styles["parameter--folded"] : ""} ${
        top ? styles["parameter--animated"] : styles["parameter--nested"]
      }`}>
      {children}
    </div>
  );
}
