import styles from "./OptionsChoiceLeft.module.scss";
import { useParameterAction } from "./context/ParameterActionContext";

export function OptionsChoiceLeft({
  isOnChoice,
  setIsOnChoice,
  isOnOptionsChoiceLeft,
  setIsOnChoiceOptionsLeft,
  handleMouseOptionsChoiceLeftEnter,
  handleMouseOptionsChoiceLeftLeave,
}) {
  const { handleRemoveChoiceLogic, isSelected, isLocked } =
    useParameterAction();

  const handleInternalAddChoice = (input) => {


    setIsOnChoice(false);
    setIsOnChoiceOptionsLeft(false);
  };

  const handleInternalRenameChoice = (input) => {

    setIsOnChoice(false);
    setIsOnChoiceOptionsLeft(false);
  };

  const handleInternalRemoveChoice = (input) => {
    handleRemoveChoiceLogic(input);

    setIsOnChoice(false);
    setIsOnChoiceOptionsLeft(false);
  };

  if (!isOnChoice || isSelected || isLocked) {
    return null;
  }

  if (!isOnOptionsChoiceLeft) {
    return (
      <div
        className={styles["options-left--short"]}
        onMouseEnter={handleMouseOptionsChoiceLeftEnter}
        onMouseLeave={handleMouseOptionsChoiceLeftLeave}>
        ?
      </div>
    );
  }

  return (
    <div
      className={styles["options-left--long"]}
      onMouseEnter={handleMouseOptionsChoiceLeftEnter}
      onMouseLeave={handleMouseOptionsChoiceLeftLeave}>
      <div onClick={handleInternalAddChoice}>&uarr; Add</div>
      <div onClick={handleInternalRenameChoice}>Rename</div>
      <div onClick={handleInternalRemoveChoice}>Delete</div>
    </div>
  );
}
