import { useEffect, useState } from "react";
import * as driver from "./logic/driver";
import { Labels } from "./Labels";
import { Options } from "./Options";
import { NestedChoices } from "./NestedChoices";
import { SidebarRight } from "./SidebarRight";
import { SidebarLeft } from "./SidebarLeft";
import { View } from "./View";
import { Outline } from "./Outline";
import { Header } from "./Header";

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
    setIsFolded((e) => !e);
  };

  const handleDisable = () => {
    let candidate = driver.toggleDisabled(data);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setData(candidate);
    }
  };

  const handleChoiceAdd = () => {
    let candidate = driver.abstractChoiceAdd(data, driver.getSampleChoice());

    setData(candidate);
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
      setData(candidate);
    }
  };

  const handleChoiceUpdate = (choice) => {
    let candidate = driver.abstractChoiceUpdate(data, choice);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setData(candidate);
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
    <Outline isDisabled={isDisabled} handleOptionsMouseLeave={handleOptionsMouseLeave}>
      <Header handleOptionsMouseEnter={handleOptionsMouseEnter} handleFold={handleFold}>
        <SidebarLeft
          isFolded={isFolded}
          isRandomized={isRandomized}
          isDisabled={isDisabled}
          isAbstract={isAbstract}
          descriptions={descriptions}
          handleSidebarLeftMouseEnter={handleLeftSidebarMouseEnter}
          handleSidebarLeftMouseLeave={handleLeftSidebarMouseLeave}
        />
        <View isFolded={isFolded} isAbstract={isAbstract} name={name} value={value} />
        <SidebarRight
          isFolded={isFolded}
          labels={labels}
          handleSidebarRightMouseEnter={handleRightSidebarMouseEnter}
          handleSidebarRightMouseLeave={handleRightSidebarMouseLeave}
        />
      </Header>
      <Options
        show={isControlled && !isOnLeftSidebar && !isOnRightSidebar}
        handleAdd={handleChoiceAdd}
        handleRemove={handleChoiceRemoveInitial}
        handleDisable={handleDisable}
      />
      <Labels show={isOnRightSidebar} labels={labels} />
      <NestedChoices
        show={!isFolded}
        nested={nested}
        clean={handleCancelView}
        parentUpdate={handleChoiceUpdate}
        parentChoiceRemove={handleChoiceRemove}
      />
    </Outline>
    // </ChoiceContext.Provider>
  );
}
