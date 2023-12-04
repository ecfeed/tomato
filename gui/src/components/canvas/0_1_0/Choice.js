import { useState } from "react";
import styles from "./Choice.module.scss";
import { useParameter } from "./context/ParameterContext";
import { OptionsChoiceLeft } from "./OptionsChoiceLeft";

export function Choice({ name }) {
  const { activeChoice, isLocked } = useParameter();

  const [isOnChoice, setIsOnChoice] = useState();
  const [isOnOptionsChoiceLeft, setIsOnChoiceOptionsLeft] = useState();

  const handleMouseEnter = (e) => {
    e.preventDefault();

    if (!isLocked) {
      activeChoice.current = name;
    }

    setIsOnChoice(true);
  };

  const handleMouseLeave = (e) => {
    e.preventDefault();
    setIsOnChoice(false);
  };

  const handleMouseOptionsChoiceLeftEnter = (e) => {
    e.preventDefault();
    setIsOnChoiceOptionsLeft(true);
  };

  const handleMouseOptionsChoiceLeftLeave = (e) => {
    e.preventDefault();
    setIsOnChoiceOptionsLeft(false);
  };

  return (
    <div className={`${styles.choice} ${isOnChoice && !isLocked ? styles['choice--active'] : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <OptionsChoiceLeft
        name={name}
        isOnChoice={isOnChoice}
        setIsOnChoice={setIsOnChoice}
        isOnOptionsChoiceLeft={isOnOptionsChoiceLeft}
        setIsOnChoiceOptionsLeft={setIsOnChoiceOptionsLeft}
        handleMouseOptionsChoiceLeftEnter={handleMouseOptionsChoiceLeftEnter}
        handleMouseOptionsChoiceLeftLeave={handleMouseOptionsChoiceLeftLeave}
      />
      {name}
    </div>
  );
}
