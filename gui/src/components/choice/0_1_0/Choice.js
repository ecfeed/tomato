import { useEffect, useReducer } from "react";
import * as driver from "./logic";
import { Labels } from "./Labels";
import { Options } from "./Options";
import { NestedChoices } from "./NestedChoices";
import { SidebarRight } from "./SidebarRight";
import { SidebarLeft } from "./SidebarLeft";
import { View } from "./View";
import styles from "./Choice.module.css";

const initialState = {
  structure: {},
  ui: {
    isFolded: true,
    isOnRightSidebar: false,
    isControlled: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "reload":
      return { ...state, structure: action.payload };
    case "setIsFolded":
      return { ...state, ui: { ...state.ui, isFolded: action.payload } };
    case "setIsControlled":
      return { ...state, ui: { ...state.ui, isControlled: action.payload } };
    case "setIsOnRightSidebar":
      return { ...state, ui: { ...state.ui, isOnRightSidebar: action.payload } };
    case "setIsOnLeftSidebar":
      return { ...state, ui: { ...state.ui, isOnLeftSidebar: action.payload } };
    case "toggleIsFolded":
      return { ...state, ui: { ...state.ui, isFolded: !state.ui.isFolded } };

    default:
      throw new Error("Unknown action!");
  }
}

export default function Choice({ structure, parentUpdate, parentCancelView, parentChoiceRemove }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { name, value, meta, nested } = state.structure;
  const { descriptions, labels } = state.structure.meta || {};
  const { isFolded, isControlled, isOnRightSidebar, isOnLeftSidebar } = state.ui;

  const isRandomized = meta?.randomized;
  const isDisabled = meta?.disabled;
  const isAbstract = nested?.length > 0;

  useEffect(() => {
    dispatch({ type: "reload", payload: structure });
  }, [structure]);

  const handleFold = () => {
    dispatch({ type: "toggleIsFolded" });
  };

  const handleDisable = () => {
    driver.handleDisable(state.structure, dispatch, parentUpdate);
  };

  const handleChoiceAdd = () => {
    driver.handleChoiceAdd(state.structure, dispatch);
  };

  const handleChoiceRemoveInitial = () => {
    driver.handleChoiceRemoveInitial(state.structure, parentUpdate, parentChoiceRemove);
  };

  const handleChoiceRemove = (choice) => {
    driver.handleChoiceRemove(state.structure, choice, dispatch, parentUpdate);
  };

  const handleChoiceUpdate = (choice) => {
    driver.handleChoiceUpdate(state.structure, choice, dispatch, parentUpdate);
  };

  const handleOptionsMouseEnter = () => {
    if (parentCancelView) {
      parentCancelView();
    }

    dispatch({ type: "setIsControlled", payload: true });
  };

  const handleOptionsMouseLeave = () => {
    dispatch({ type: "setIsControlled", payload: false });
  };

  const handleRightSidebarMouseEnter = () => {
    dispatch({ type: "setIsOnRightSidebar", payload: true });
  };

  const handleRightSidebarMouseLeave = () => {
    dispatch({ type: "setIsOnRightSidebar", payload: false });
  };

  const handleLeftSidebarMouseEnter = () => {
    dispatch({ type: "setIsOnLeftSidebar", payload: true });
  };

  const handleLeftSidebarMouseLeave = () => {
    dispatch({ type: "setIsOnLeftSidebar", payload: false });
  };

  const handleCancelView = () => {
    dispatch({ type: "setIsControlled", payload: false });
  };

  return (
    <div
      className={`${styles.choice} ${isDisabled ? styles.disabled : styles.enabled}`}
      onMouseLeave={handleOptionsMouseLeave}>
      <div className={styles.main} onMouseOver={handleOptionsMouseEnter} onClick={handleFold}>
        <SidebarLeft
          isFolded={isFolded}
          isRandom={isRandomized}
          isAbstract={isAbstract}
          isDisabled={isDisabled}
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
  );
}
