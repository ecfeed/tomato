import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";
import { useParameter } from "./context/ParameterContext";

export function PromptAddParentParameter() {
  const {
    showAddParameterParent,
    handleAddParameterPlaceholder,
    handleAddParameterParentCancel,
    handleAddParameterParentInitialLogic,
  } = useParameter();

  if (!showAddParameterParent) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Add a parent parameter"
        text="To exit, press 'cancel' or 'escape'."
        placeholder={handleAddParameterPlaceholder}
        handleCancel={handleAddParameterParentCancel}
        handleConfirm={handleAddParameterParentInitialLogic}
      />
    </div>
  );
}
