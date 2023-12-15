import { useEffect, useRef, useState } from "react";
import styles from "./ParameterHeader.module.scss";
import { useParameter } from "./context/ParameterContext";
import { checkIfChildExists, getParentId } from "./logic/model";
import Tooltip from "../../tooltip/0_1_0/Tooltip";

const inputExists = "↳ The name is not unique.";
const inputEmpty = "↳ The name is not defined.";

export function ParameterHeader() {
  const {
    isLocked,
    setIsLocked,
    isOnParameter,
    root,
    id,
    name,
    handleSetFolded,
    isFolded,
    isSelected,
    choices,
    parameters,
    handleRenameParameterLogic,
    handleRemoveParameterParentLogic,
  } = useParameter();

  const [nameValue, setNameValue] = useState(name);
  const [labelValue, setLabelValue] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);
  const [showMenuRight, setShowMenuRight] = useState(false);
  const [hover, setHover] = useState(false);

  const element = useRef(null);

  const hasChildren = parameters?.length > 0 || choices?.length > 0;
  const isUnderlined = false && hasChildren && !isFolded;

  useEffect(() => {
    if (!name) {
      element.current.focus();
    }
  }, [name]);

  useEffect(() => {
    if (!isOnParameter) {
      setShowMenuRight(false);
    }
  }, [showMenuRight, isOnParameter]);

  useEffect(() => {
    setNameValue(name);
  }, [name]);

  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Enter") {
        if (!isDuplicated && nameValue) {
          handleRenameParameterLogic(nameValue);
          setIsLocked(false);
        }
      } else if (e.code === "Escape") {
        if (name) {
          setNameValue(name);
          setIsDuplicated(false);
          setLabelValue("");
        } else {
          handleRemoveParameterParentLogic();
          setIsLocked(false);
        }
      }
    };

    const target = element.current;

    target.addEventListener("keydown", callback);

    return () => target.removeEventListener("keydown", callback);
  }, [
    setNameValue,
    setIsLocked,
    handleRemoveParameterParentLogic,
    handleRenameParameterLogic,
    name,
    nameValue,
    isDuplicated,
  ]);

  const handleInputOnSubmit = (e) => {
    e.preventDefault();

    if (!name && !nameValue) {
      handleRemoveParameterParentLogic();
      setIsLocked(false);
    } else if (!isDuplicated && nameValue) {
      handleRenameParameterLogic(nameValue);
      setIsLocked(false);
    }
  };

  const handleInputOnNameChange = (e) => {
    const value = e.target.value;

    const duplicated = checkIfChildExists(root, getParentId(id), value);

    if (duplicated) {
      setLabelValue(inputExists);
    } else if (!value) {
      setLabelValue(inputEmpty);
    } else {
      setLabelValue("");
    }

    if (duplicated !== isDuplicated) {
      setIsDuplicated(duplicated);
    }

    setNameValue(e.target.value);
  };

  const handleInputFocusIn = () => {
    handleSetFolded(false);
    setIsDuplicated(false);

    element.current.select();
  };

  const handleInputFocusOut = () => {
    setIsDuplicated(false);
    setLabelValue("");

    if (name) {
      setNameValue(name);
    } else {
      handleRemoveParameterParentLogic();
      setIsLocked(false);
    }
  };

  const handleMenuRightToggle = () => {
    setShowMenuRight((value) => !value);
  };

  const handleMenuLeftFold = (value) => {
    handleSetFolded(value);
  };

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  const classParameter =
    `${styles["header"]} ` +
    `${isSelected ? styles["color--negative"] : styles["color--default"]} `;

  const classInput =
    `${styles["header__input"]} ` +
    `${isSelected ? styles["color--negative"] : styles["color--default"]} ` +
    `${isUnderlined ? styles["style--underline"] : ""} ` +
    `${isDuplicated ? styles["style--stroke"] : ""}`;

  return (
    <div className={classParameter} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <form onSubmit={handleInputOnSubmit}>
        <Tooltip
          hide={isFolded || isLocked || name.length < 22}
          info={nameValue === name ? name : `Original: ${name}\xa0 0l`}>
          <input
            ref={element}
            type="text"
            className={classInput}
            value={nameValue}
            placeholder={name}
            onChange={handleInputOnNameChange}
            onFocus={handleInputFocusIn}
            onBlur={handleInputFocusOut}
            id="input"
          />
          <label className={styles["header__label"]}>{labelValue}</label>
        </Tooltip>
      </form>
      {hover && !isFolded && !isLocked && <div className={styles["header__icon"]}>+</div>}
      {name && (
        <Tooltip hide={isFolded || isLocked} info="Hide the content of the parameter.">
          <OptionsHeaderLeft menuLeftFold={handleMenuLeftFold} />
        </Tooltip>
      )}
      {name && !isFolded && <OptionsHeaderRight menuRightToggle={handleMenuRightToggle} />}
      {name && !isFolded && (
        <MenuPanel
          show={showMenuRight}
          toggle={handleMenuRightToggle}
          actionRemove={handleRemoveParameterParentLogic}
        />
      )}
    </div>
  );
}

function OptionsHeaderLeft({ menuLeftFold }) {
  return (
    <>
      <div className={styles["options-header-left"]} onClick={() => menuLeftFold()}>
        &#8635;
      </div>
    </>
  );
}

function OptionsHeaderRight({ menuRightToggle }) {
  return (
    <>
      <div className={styles["options-header-right"]} onClick={menuRightToggle}>
        &#8230;
      </div>
    </>
  );
}

function MenuPanel({ show, toggle, actionRemove }) {
  if (!show) {
    return null;
  }

  return (
    <div className={styles["menu-panel__overlay"]}>
      <div className={styles["menu-panel__main"]}>
        <div className={styles["menu-panel__header"]}>
          <div className={styles["menu-panel__title"]}>actions</div>
          <div className={styles["menu-panel__close"]} onClick={toggle}>
            &times;
          </div>
        </div>
        <ul>
          <li onClick={actionRemove}>delete</li>
        </ul>
      </div>
    </div>
  );
}
