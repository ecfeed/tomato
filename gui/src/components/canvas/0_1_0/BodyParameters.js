import styles from "./BodyParameters.module.scss";
import { MockParameter } from "./MockParameter";
import { useParameter } from "./context/ParameterContext";

export function BodyParameters() {
  const {
    isFolded,
    parameters,
    isLocked,
    setIsLocked,
    handleMouseParameterChild,
    handleParameterUpdate,
    handleAddParameterParentLogic,
    handleRemoveParameterParentLogic
  } = useParameter();

  if (isFolded) {
    return null;
  }
  return (
    <div className={styles["children"]}>
      {parameters.map((e, index) => (
        <MockParameter
          key={`${index} ${e.name}`}
          parameter={e}
          parentMouseEvent={handleMouseParameterChild}
          parentUpdate={handleParameterUpdate}
          parentAdd={handleAddParameterParentLogic}
          parentRemove={handleRemoveParameterParentLogic}
          isLocked={isLocked}
          setIsLocked={setIsLocked}>
          {e}
        </MockParameter>
      ))}
    </div>
  );
}
