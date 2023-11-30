import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";
import { useParameter } from "./context/ParameterContext";

export function PromptAddNestedChoices() {
  const { showAddChoice, handleAddChoicePlaceholder, handleAddChoiceCancel, handleAddChoiceLogic } =
    useParameter();

  if (!showAddChoice) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Add nested choices"
        text="To exit, press 'cancel' or 'escape'."
        placeholder={handleAddChoicePlaceholder}
        handleCancel={handleAddChoiceCancel}
        handleConfirm={handleAddChoiceLogic}
      />
    </div>
  );
}
