import "./Tooltip_0_1_0.css";
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
    <div className="tooltip" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && <div className="info">{ info }</div>}
    </div>
  );
}
