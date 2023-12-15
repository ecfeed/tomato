import styles from './Tooltip.module.scss';
import { useState } from "react";

export default function Tooltip({ children, info, hide }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className={styles['tooltip']} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible  && !hide && <div className={styles['tooltip__info']}>{ info }</div>}
    </div>
  );
}
