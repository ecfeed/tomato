import { Outlet } from "react-router-dom";
import styles from "./PoC.module.css";
import { PageNav } from "./support/navigation/PageNav";
import { PageSidebar } from "./support/navigation/PageSidebar";

function PoC() {
  return (
    <div className={styles.poc}>
      <PageNav />
      <div className={styles.main}>
        <PageSidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default PoC;
