import { useEffect, useState } from "react";
import styles from "./Prompt.module.css";

export function Prompt({ header, text, placeholder, handleConfirm, handleCancel }) {
  const [valuePlaceholder, setValuePlaceholder] = useState(() =>
    placeholder ? placeholder() : ""
  );
  const [value, setValue] = useState("");

  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Escape") {
        if (handleCancel) {
          if (value === "" && placeholder !== "") {
            handleCancel(valuePlaceholder);
          } else {
            handleCancel(value);
          }
        }

        setValue("");
      } else if (e.code === "Enter") {
        if (handleConfirm) {
          if (value === "" && placeholder !== "") {
            handleConfirm(valuePlaceholder);
          } else {
            handleConfirm(value);
          }
        }

        setValue("");
        setValuePlaceholder(placeholder ? placeholder() : "");
      }
    };

    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [value, handleCancel, handleConfirm, placeholder, valuePlaceholder]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClickOnConfirm = () => {
    if (handleConfirm) {
      if (value === "" && placeholder !== "") {
        handleConfirm(valuePlaceholder);
      } else {
        handleConfirm(value);
      }
    }

    setValue("");
    setValuePlaceholder(placeholder ? placeholder() : "");
  };

  const handleClickOnCancel = () => {
    if (handleCancel) {
      if (value === "" && placeholder !== "") {
        handleCancel(valuePlaceholder);
      } else {
        handleCancel(value);
      }
    }

    setValue("");
  };

  return (
    <div className={styles.prompt}>
      <div className={styles.header}>
        <div className={styles.header_text}>{header} </div>
        <div
          type="button"
          className={styles.header_close}
          onClick={() => handleClickOnCancel(value)}>
          &times;
        </div>
      </div>
      <div className={styles.text}>{text}</div>
      <input
        placeholder={valuePlaceholder}
        value={value}
        className={styles.input}
        onChange={handleChange}
      />
      <footer className={styles.footer}>
        <div
          type="button"
          className={`${styles.cancel} ${styles.option}`}
          onClick={() => handleClickOnCancel(value)}>
          Cancel
        </div>
        <div
          type="button"
          className={`${styles.ok} ${styles.option}`}
          onClick={() => handleClickOnConfirm(value)}>
          Ok
        </div>
      </footer>
    </div>
  );
}
