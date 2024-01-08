import styles from "./Parameter.module.scss";
import { useParameterAction } from "./context/ParameterActionContext";
import { checkAdded, isTop } from "./logic/model";

export function Parameter({ children }) {
  const { id, isFolded } = useParameterAction();

  const styleAnimated = checkAdded(id) ? styles["parameter--animated"] : '';
  const styleNested = styles["parameter--nested"];
  const styleTop = isTop(id) ? styleAnimated : styleNested;
  const styleFolded = isFolded ? styles["parameter--folded"] : "";

  return (
    <div
      className={`${styles["parameter"]} ${styleFolded} ${styleTop}`}>
      {children}
    </div>
  );
}
