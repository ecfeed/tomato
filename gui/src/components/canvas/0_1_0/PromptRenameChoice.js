import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";
import { useParameter } from "./context/ParameterContext";

export function PromptRenameChoice() {
  const {
    showRenameChoice,
    handleRenameChoicePlaceholder,
    handleRenameChoiceCancel,
    handleRenameChoiceLogic,
  } = useParameter();

  if (!showRenameChoice) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Rename the choice"
        text="
          The choice will be renamed.
        "
        placeholder={handleRenameChoicePlaceholder}
        handleCancel={handleRenameChoiceCancel}
        handleConfirm={handleRenameChoiceLogic}
        buttons={["rename", "cancel"]}
      />
    </div>
  );
}
