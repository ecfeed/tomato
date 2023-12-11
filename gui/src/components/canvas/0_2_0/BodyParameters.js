import styles from "./BodyParameters.module.scss";
import { MockParameter } from "./MockParameter";
import { useParameter } from "./context/ParameterContext";

export function BodyParameters() {
  const {
    root,
    setRoot,
    id,
    isFolded,
    parameters,
    isLocked,
    setIsLocked,
    handleMouseParameterChild,
    handleParameterUpdate,
    handleAddParameterParentLogic,
    handleRenameParameterLogic,
    handleRemoveParameterParentLogic,
  } = useParameter();

  if (isFolded) {
    return null;
  }
  return (
    <div className={styles["children"]}>
      {parameters.map((e, index) => (
        <MockParameter
          root={root}
          setRoot={setRoot}
          key={`${index} ${e.name}`}
          parameter={e}
          parameterParentId={id}
          parentMouseEvent={handleMouseParameterChild}
          parentUpdate={handleParameterUpdate}
          parentAdd={handleAddParameterParentLogic}
          parentRemove={handleRemoveParameterParentLogic}
          parentRename={handleRenameParameterLogic}
          isLocked={isLocked}
          setIsLocked={setIsLocked}>
          {e}
        </MockParameter>
      ))}
    </div>
  );
}
