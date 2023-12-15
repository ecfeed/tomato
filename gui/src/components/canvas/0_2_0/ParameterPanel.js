import { ButtonAdd } from "./ButtonAdd";
import styles from "./ParameterPanel.module.scss";
import { useParameter } from "./context/ParameterContext";

export function ParameterPanel() {
  const { top, isLocked, handleAddParameterParentLogic } =
    useParameter();

  if (!top) {
    return null;
  }

  const handleInternalAddParameter = (input) => {
    handleAddParameterParentLogic(input);
  };

  return (
    <>
      <div className={isLocked ? styles["panel-parameter"] : styles["panel-parameter--active"]}>
        <ButtonAdd handleAddMainParameter={handleInternalAddParameter} />
      </div>
    </>
  );
}
