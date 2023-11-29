import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";

export function PromptAddNestedParameters({
  showAddParameter,
  handleAddParameterPlaceholder,
  handleAddParameterCancel,
  handleAddParameterLogic,
}) {
  if (!showAddParameter) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Add nested parameters"
        text="To exit, press 'cancel' or 'escape'."
        placeholder={handleAddParameterPlaceholder}
        handleCancel={handleAddParameterCancel}
        handleConfirm={handleAddParameterLogic}
      />
    </div>
  );
}
