import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";

export function PromptAddParentParameter({
  showAddParameterParent,
  handleAddParameterPlaceholder,
  handleAddParameterParentCancel,
  handleAddParameterParentInitialLogic,
}) {
  if (!showAddParameterParent) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Add parent parameters"
        text="To exit, press 'cancel' or 'escape'."
        placeholder={handleAddParameterPlaceholder}
        handleCancel={handleAddParameterParentCancel}
        handleConfirm={handleAddParameterParentInitialLogic}
      />
    </div>
  );
}
