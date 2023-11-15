import Choice from "./Choice";
import styles from "./NestedChoices.module.css";
import { useChoices } from "./context/ChoiceContext";

export function NestedChoices() {
  const { isFolded, nested, handleCancelView, handleChoiceRemove, handleChoiceUpdate } =
    useChoices();

  if (isFolded || !nested || nested?.length === 0) {
    return null;
  }

  return (
    <div className={styles.nested}>
      {nested.map((e) => (
        <Choice
          structure={e}
          parentCancelView={handleCancelView}
          parentChoiceRemove={handleChoiceRemove}
          parentUpdate={handleChoiceUpdate}
          key={e.name}
        />
      ))}
    </div>
  );
}
