import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";

export function PromptAddMainParameters({
  showAddMainParameter,
  handleAddParameterPlaceholder,
  handleAddParameterCancel,
  handleAddParameterLogic,
}) {
  if (!showAddMainParameter) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Add main parameters"
        text="To exit, press 'cancel' or 'escape'."
        placeholder={handleAddParameterPlaceholder}
        handleCancel={handleAddParameterCancel}
        handleConfirm={handleAddParameterLogic}
      />
    </div>
  );
}
