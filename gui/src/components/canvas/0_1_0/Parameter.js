import styles from "./Parameter.module.scss";

export function Parameter({ children, isFolded }) {
  return (
    <div className={`${styles['parameter']} ${isFolded ? styles['parameter--folded'] : ""}`}>
      {children}
    </div>
  );
}
