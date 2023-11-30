import styles from "./Parameter.module.scss";
import { useParameter } from "./context/ParameterContext";

export function Parameter({ children }) {
  const { isFolded } = useParameter();

  return (
    <div className={`${styles['parameter']} ${isFolded ? styles['parameter--folded'] : ""}`}>
      {children}
    </div>
  );
}
