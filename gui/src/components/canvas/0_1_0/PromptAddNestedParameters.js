import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";
import { useParameter } from "./context/ParameterContext";

export function PromptAddNestedParameters() {
  const {
    showAddParameter,
    handleAddParameterPlaceholder,
    handleAddParameterCancel,
    handleAddParameterLogic,
  } = useParameter();

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
