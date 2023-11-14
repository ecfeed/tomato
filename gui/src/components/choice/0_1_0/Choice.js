import { createContext, useEffect, useState } from "react";
import * as driver from "./logic/driver";
import { Labels } from "./Labels";
import { Options } from "./Options";
import { NestedChoices } from "./NestedChoices";
import { SidebarRight } from "./SidebarRight";
import { SidebarLeft } from "./SidebarLeft";
import { View } from "./View";
import styles from "./Choice.module.css";

export default function Choice({ structure, parentUpdate, parentCancelView, parentChoiceRemove }) {
  const [data, setData] = useState({});
  const [isFolded, setIsFolded] = useState(true);
  const [isControlled, setIsControlled] = useState(false);
  const [isOnLeftSidebar, setIsOnLeftSidebar] = useState(false);
  const [isOnRightSidebar, setIsOnRightSidebar] = useState(false);

  const { name, value, meta, nested } = data;
  const { descriptions, labels } = data.meta || {};

  const isRandomized = meta?.randomized;
  const isDisabled = meta?.disabled;
  const isAbstract = nested?.length > 0;

  useEffect(() => {
    setData(structure);
  }, [structure]);

  const handleFold = () => {
    setIsFolded(e => !e);
  };

  const handleDisable = () => {
    let candidate = driver.toggleDisabled(data);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setData(candidate)
    }
  };

  const handleChoiceAdd = () => {
    let candidate = driver.abstractChoiceAdd(data, driver.getSampleChoice());

    setData(candidate)
    setIsFolded(false);
  };

  const handleChoiceRemoveInitial = () => {
    if (parentUpdate) {
      parentChoiceRemove(data);
    } else {
      alert("Cannot remove the top-level element!");
    }
  };

  const handleChoiceRemove = (choice) => {
    let candidate = driver.abstractChoiceDelete(data, choice);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setData(candidate)
    }
  };

  const handleChoiceUpdate = (choice) => {
    let candidate = driver.abstractChoiceUpdate(data, choice);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setData(candidate)
    }
  };

  const handleOptionsMouseEnter = () => {
    if (parentCancelView) {
      parentCancelView();
    }

    setIsControlled(true);
  };

  const handleOptionsMouseLeave = () => {
    setIsControlled(false);
  };

  const handleRightSidebarMouseEnter = () => {
    setIsOnRightSidebar(true);
  };

  const handleRightSidebarMouseLeave = () => {
    setIsOnRightSidebar(false);
  };

  const handleLeftSidebarMouseEnter = () => {
    setIsOnLeftSidebar(true);
  };

  const handleLeftSidebarMouseLeave = () => {
    setIsOnLeftSidebar(false);
  };

  const handleCancelView = () => {
    setIsControlled(false);
  };

  return (
    // <ChoiceContext.Provider>
      <div
        className={`${styles.choice} ${isDisabled ? styles.disabled : styles.enabled}`}
        onMouseLeave={handleOptionsMouseLeave}>
        <div className={styles.main} onMouseOver={handleOptionsMouseEnter} onClick={handleFold}>
          <SidebarLeft
            isFolded={isFolded}
            isRandomized={isRandomized}
            isDisabled={isDisabled}
            isAbstract={isAbstract}
            descriptions={descriptions}
            handleMouseEnter={handleLeftSidebarMouseEnter}
            handleMouseLeave={handleLeftSidebarMouseLeave}
          />
          <View isFolded={isFolded} isAbstract={isAbstract} name={name} value={value} />
          <SidebarRight
            isFolded={isFolded}
            labels={labels}
            handleMouseEnter={handleRightSidebarMouseEnter}
            handleMouseLeave={handleRightSidebarMouseLeave}
          />
        </div>
        <div className="">
          <Options
            show={isControlled && !isOnLeftSidebar && !isOnRightSidebar}
            handleDisable={handleDisable}
            handleAdd={handleChoiceAdd}
            handleRemove={handleChoiceRemoveInitial}
          />
          <Labels show={isOnRightSidebar} labels={labels} />
          <NestedChoices
            show={!isFolded}
            nested={nested}
            clean={handleCancelView}
            parentUpdate={handleChoiceUpdate}
            parentChoiceRemove={handleChoiceRemove}
          />
        </div>
      </div>
    // </ChoiceContext.Provider>
  );
}
