import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.scss";
import { useParameter } from "./context/ParameterContext";
import { checkIfChildExists, getParentId } from "./logic/model";

const labelInputUnchanged = "↳ Leave the name unchanged.";
const labelInputDuplicated = "↳ The name is not unique.";
const labelInputValidated = "↳ Change the name.";
const labelInputDeleted = "↳ Delete the parameter.";

export function Header() {
  const {
    root,
    id,
    name,
    isFolded,
    isSelected,
    choices,
    parameters,
    handleRenameParameterLogic,
    handleRemoveParameterParentLogic,
  } = useParameter();

  const [nameValue, setNameValue] = useState(name);
  const [labelValue, setLabelValue] = useState(labelInputUnchanged);
  const [isDuplicated, setIsDuplicated] = useState(false);

  const element = useRef(null);

  useEffect(() => {
    setNameValue(name);
  }, [name]);

  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Enter") {
        if (!nameValue) {
          handleRemoveParameterParentLogic();
        } else if (!isDuplicated) {
          handleRenameParameterLogic(nameValue);
        }
      } else if (e.code === "Escape") {
        setNameValue(name);
      } else if (e.code === "Delete") {
        handleRemoveParameterParentLogic();
      }
    };

    const target = element.current;

    target.addEventListener("keydown", callback);

    return () => target.removeEventListener("keydown", callback);
  }, [
    setNameValue,
    handleRemoveParameterParentLogic,
    handleRenameParameterLogic,
    name,
    nameValue,
    isDuplicated,
  ]);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!nameValue) {
      handleRemoveParameterParentLogic();
    } else if (!isDuplicated) {
      handleRenameParameterLogic(nameValue);
    }
  };

  const handleOnNameChange = (e) => {
    const value = e.target.value;

    const duplicated = checkIfChildExists(root, getParentId(id), value);

    if (!value) {
      setLabelValue(labelInputDeleted);
    } else if (value === name) {
      setLabelValue(labelInputUnchanged);
    } else if (duplicated) {
      setLabelValue(labelInputDuplicated);
    } else {
      setLabelValue(labelInputValidated);
    }

    if (duplicated !== isDuplicated) {
      setIsDuplicated(duplicated);
    }

    setNameValue(e.target.value);
  };

  const handleFocusIn = (e) => {
    setLabelValue(labelInputUnchanged);
    setIsDuplicated(false);
  };

  const handleFocusOut = (e) => {
    setNameValue(name);
  };

  const isUnderlined = false && (choices?.length > 0 || parameters?.length > 0) && !isFolded;

  const classParameter = `
    ${styles["parameter-header"]} 
    ${isSelected ? styles["negative"] : styles["default"]} 
  `;

  const classInput = `
    ${styles["parameter-input"]} 
    ${isSelected ? styles["negative"] : styles["default"]} 
    ${isUnderlined ? styles["underline"] : ""} 
    ${isDuplicated ? styles["line"] : ""}
  `;

  return (
    <div className={classParameter}>
      <form onSubmit={handleOnSubmit}>
        <input
          ref={element}
          type="text"
          className={classInput}
          value={nameValue}
          placeholder={name}
          onChange={handleOnNameChange}
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
          id="input"
        />
        <label className={styles["parameter-label"]} htmlFor="input">
          {labelValue}
        </label>
      </form>
    </div>
  );
}
