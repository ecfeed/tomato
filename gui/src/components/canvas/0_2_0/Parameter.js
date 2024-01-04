import styles from "./Parameter.module.scss";
import { useParameter } from "./context/ParameterContext";
import { checkAdded } from "./logic/model";

export function Parameter({ children }) {
  const { top, id, isFolded } = useParameter();

  const styleAnimated = checkAdded(id) ? styles["parameter--animated"] : '';
  const styleNested = styles["parameter--nested"];
  const styleTop = top ? styleAnimated : styleNested;
  const styleFolded = isFolded ? styles["parameter--folded"] : "";

  return (
    <div
      className={`${styles["parameter"]} ${styleFolded} ${styleTop}`}>
      {children}
    </div>
  );
}
