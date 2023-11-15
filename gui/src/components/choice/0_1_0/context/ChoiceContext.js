import { createContext, useContext, useEffect, useState } from "react";
import * as driver from "../logic/driver";

const ChoiceContext = createContext();

export function ChoiceProvider({
  children,
  structure,
  parentUpdate,
  parentCancelView,
  parentChoiceRemove,
}) {
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
    const candidate = driver.toggleDisabled(data);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setData(candidate);
    }
  };

  const handleChoiceAdd = () => {
    const candidate = driver.abstractChoiceAdd(data, driver.getSampleChoice());

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
    const candidate = driver.abstractChoiceDelete(data, choice);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setData(candidate);
    }
  };

  const handleChoiceUpdate = (choice) => {
    const candidate = driver.abstractChoiceUpdate(data, choice);

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
    <ChoiceContext.Provider
      value={{
        name,
        value,
        nested,
        labels,
        descriptions,
        isFolded,
        isRandomized,
        isAbstract,
        isDisabled,
        isControlled,
        isOnLeftSidebar,
        isOnRightSidebar,
        handleRightSidebarMouseEnter,
        handleRightSidebarMouseLeave,
        handleLeftSidebarMouseEnter,
        handleLeftSidebarMouseLeave,
        handleOptionsMouseEnter,
        handleOptionsMouseLeave,
        handleFold,
        handleDisable,
        handleCancelView,
        handleChoiceAdd,
        handleChoiceRemove,
        handleChoiceRemoveInitial,
        handleChoiceUpdate,
      }}>
      {children}
    </ChoiceContext.Provider>
  );
}

export function useChoices() {
  const context = useContext(ChoiceContext);

  if (context === undefined) {
    throw new Error("ChoiceContext cannot be used outside of the ChoiceProvider.");
  }

  return context;
}
