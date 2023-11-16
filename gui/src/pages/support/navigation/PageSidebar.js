import { NavLink } from "react-router-dom";
import styles from "./PageSidebar.module.css";

export function PageSidebar({ versions = [] }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.version}>Versions</div>

        <div className={styles.nav}>
            {versions.map((e, index) => <NavLink to={`?version=${e}`} key={`${e}_${index}`}>{e.replaceAll('_', ' ')}</NavLink>)}
         
        </div>

    </div>
  );
}
