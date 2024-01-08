import styles from "./ChildrenParameters.module.scss";
import { ParameterStructure } from "./ParameterStructure";
import { useParameterAction } from "./context/ParameterActionContext";
import { useParameterMouse } from "./context/ParameterMouseContext";

export function ChildrenParameters() {
  const {
    root,
    setRoot,
    id,
    isFolded,
    parameters,
    isLocked,
    setIsLocked,
    handleParameterUpdate,
    handleAddParameterParentLogic,
    handleRenameParameterLogic,
    handleRemoveParameterParentLogic,
  } = useParameterAction();

  const {
    handleMouseParameterChild
  } = useParameterMouse();

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
