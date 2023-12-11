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
        header="Add"
        text="
          The parameter will be added at the end of the container.
        "
        placeholder={handleAddParameterPlaceholder}
        handleCancel={handleAddParameterCancel}
        handleConfirm={handleAddParameterLogic}
        buttons={['add', 'cancel']}
      />
    </div>
  );
}
