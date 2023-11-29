import styles from "./BodyChoices.module.scss";

export function BodyChoices({ choices, isFolded, isStructure }) {
  if (isFolded || isStructure) {
    return null;
  }
  return (
    <div className={styles.parameter_choices}>
      <div>
        {choices.map((e, index) => (
          <div key={`${index} ${e.name}`} className={styles.choice}>
            {e.name}
          </div>
        ))}
      </div>
    </div>
  );
}
