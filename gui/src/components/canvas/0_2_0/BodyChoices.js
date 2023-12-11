import styles from "./BodyChoices.module.scss";
import { Choice } from "./Choice";
import { useParameter } from "./context/ParameterContext";

export function BodyChoices() {
  const { choices, isFolded, isStructure } = useParameter();

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
