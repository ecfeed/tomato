import styles from './Tooltip.module.css';
import { useState } from "react";

export default function Tooltip({ children, info }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
    
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className={styles.tooltip} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && <div className={styles.info}>{ info }</div>}
    </div>
  );
}
