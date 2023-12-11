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
        header="Add choices"
        text="
          You may add as many choices as required.\n
          To return, press 'escape' or 'exit'.
        "
        placeholder={handleAddChoicePlaceholder}
        handleCancel={handleAddChoiceCancel}
        handleConfirm={handleAddChoiceLogic}
        buttons={["add", "exit"]}
      />
    </div>
  );
}
