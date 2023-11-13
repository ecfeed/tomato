import Choice from "./Choice";
import styles from './NestedChoices.module.css'

export function NestedChoices({ show, parentChoiceRemove, parentUpdate, nested, clean }) {
  if (!show || !nested || nested?.length === 0) {
    return null;
  }

  return (
    <div className={styles.nested}>
      {nested.map((e) => (
        <Choice
          structure={e}
          parentCancelView={clean}
          parentChoiceRemove={parentChoiceRemove}
          parentUpdate={parentUpdate}
          key={e.name}
        />
      ))}
    </div>
  );
}
