import styles from "./ChildrenChoices.module.scss";
import { Choice } from "./Choice";
import { useParameterAction } from "./context/ParameterActionContext";

export function ChildrenChoices() {
  const { choices, isFolded, isStructure } = useParameterAction();

  if (isFolded || isStructure) {
    return null;
  }
  return (
    <div className={styles.parameter_choices}>
      <div>
        {choices.map((e, index) => (
          <Choice key={`${index} ${e.name}`} name={e.name} id={e.id} />
        ))}
      </div>
    </div>
  );
}
