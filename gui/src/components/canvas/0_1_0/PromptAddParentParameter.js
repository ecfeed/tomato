import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";
import { useParameter } from "./context/ParameterContext";

export function PromptAddParentParameter() {
  const {
    showAddParameterParent,
    handleAddParameterParentPlaceholder,
    handleAddParameterParentCancel,
    handleAddParameterParentLogic,
  } = useParameter();

  if (!showAddParameterParent) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Add a parameter"
        text="
          The parameter will be added before the selected one.
        "
        placeholder={handleAddParameterParentPlaceholder}
        handleCancel={handleAddParameterParentCancel}
        handleConfirm={handleAddParameterParentLogic}
        buttons={["add", "cancel"]}
      />
    </div>
  );
}
