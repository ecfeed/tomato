import styles from "./OptionsBottom.module.scss";

export function OptionsBottom({
  parameters,
  choices,
  handleAddParameter,
  handleAddChoice,
  isOnParameter,
  isOnParameterChild,
  isSelected,
  isLocked,
  isFolded,
}) {
  if (!isOnParameter || isOnParameterChild || isSelected || isLocked || isFolded) {
    return null;
  }

  if (parameters?.length > 0 && choices?.length === 0) {
    return (
      <div className={styles['options-bottom']}>
        <div className={styles['option--center']} role="button" onClick={handleAddParameter}>
          + parameter
        </div>
      </div>
    );
  }

  if (parameters?.length === 0 && choices?.length > 0) {
    return (
      <div className={styles['options-bottom']}>
        <div className={styles['option--center']} role="button" onClick={handleAddChoice}>
          + choice
        </div>
      </div>
    );
  }

  if (parameters?.length === 0 && choices?.length === 0) {
    return (
      <div className={styles['options-bottom']}>
        <div className={styles['option--left']} role="button" onClick={handleAddParameter}>
          + param
        </div>
        <div className={styles['option--right']} role="button" onClick={handleAddChoice}>
          + choice
        </div>
      </div>
    );
  }

  return null;
}
