import styles from "./Prompt.module.scss";
import { Prompt } from "../../prompt/0_1_0/Prompt";
import { useParameter } from "./context/ParameterContext";

export function PromptRenameParameter() {
  const {
    showRenameParameter,
    handleRenameParameterPlaceholder,
    handleRenameParameterCancel,
    handleRenameParameterInitialLogic,
  } = useParameter();

  if (!showRenameParameter) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <Prompt
        header="Rename the parameter"
        text="
          The parameter will be renamed.
        "
        placeholder={handleRenameParameterPlaceholder}
        handleCancel={handleRenameParameterCancel}
        handleConfirm={handleRenameParameterInitialLogic}
        buttons={["rename", "cancel"]}
      />
    </div>
  );
}
