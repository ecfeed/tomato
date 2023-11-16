import { Outlet, useLocation } from "react-router-dom";
import styles from "./PoC.module.css";
import { PageNav } from "./support/navigation/PageNav";
import { PageSidebar } from "./support/navigation/PageSidebar";
import { getAllVersions as getChoiceVersions } from '../drivers/choice/ChoiceDriver'
import { getAllVersions as getTooltipVersions } from '../drivers/tooltip/TooltipDriver'

function PoC() {
  const location = useLocation();
  
  let versions = [];

  if (location.pathname.endsWith('choice')) {
    versions = getChoiceVersions();
  } else if (location.pathname.endsWith('tooltip')) {
    versions = getTooltipVersions();
  }

  return (
    <div className={styles.poc}>
      <PageNav />
      <div className={styles.main}>
        <PageSidebar versions={versions}/>
        <Outlet />
      </div>
    </div>
  );
}

export default PoC;
