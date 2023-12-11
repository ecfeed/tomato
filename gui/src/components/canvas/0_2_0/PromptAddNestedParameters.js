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
        header="Add a parameter"
        text="
          The parameter will be added as a nested parameter.
        "
        placeholder={handleAddParameterPlaceholder}
        handleCancel={handleAddParameterCancel}
        handleConfirm={handleAddParameterLogic}
        buttons={['add', 'cancel']}
      />
    </div>
  );
}
