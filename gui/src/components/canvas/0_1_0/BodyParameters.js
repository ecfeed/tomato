import styles from "./BodyParameters.module.scss";
import { MockParameter } from "./MockParameter";

export function BodyParameters({
  isFolded,
  parameters,
  parentMouseEvent,
  parentUpdate,
  parentAdd,
  isLocked,
  setIsLocked,
}) {
  if (isFolded) {
    return null;
  }
  return (
    <div className={styles['children']}>
      {parameters.map((e, index) => (
        <MockParameter
          key={`${index} ${e.name}`}
          parameter={e}
          parentMouseEvent={parentMouseEvent}
          parentUpdate={parentUpdate}
          parentAdd={parentAdd}
          isLocked={isLocked}
          setIsLocked={setIsLocked}>
          {e}
        </MockParameter>
      ))}
    </div>
  );
}
