import styles from "./ChildrenParameters.module.scss";
import { ParameterStructure } from "./ParameterStructure";
import { useParameter } from "./context/ParameterContext";

export function ChildrenParameters() {
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
        <ParameterStructure
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
        </ParameterStructure>
      ))}
    </div>
  );
}
