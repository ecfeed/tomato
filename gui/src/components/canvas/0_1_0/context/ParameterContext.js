import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  choiceAdd,
  choiceAddAtPosition,
  choiceRemove,
  choiceRename,
  getChoice,
  getParameter,
  parameterAddAtPosition,
  parameterRemove,
  parameterRename,
  parameterUpdate,
} from "../logic/driver";

const ParameterContext = createContext();

const initialState = {
  structure: {},

  isFolded: false,

  isOnParameter: false,
  isOnParameterChild: false,
  isOnOptionsLeft: false,
  isOnOptionsBottom: false,

  showAddParameter: false,
  showAddParameterParent: false,
  showRenameParameter: false,
  showAddChoice: false,
  showRenameChoice: false,
};

const clean = {
  isOnParameter: false,
  isOnParameterChild: false,
  isOnOptionsLeft: false,
  isOnOptionsBottom: false,

  showAddParameter: false,
  showAddParameterParent: false,
  showRenameParameter: false,
  showAddChoice: false,
  showRenameChoice: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "structure:update":
      return { ...state, structure: action.payload };
    case "mouse:body:enter":
      return { ...state, isOnParameter: true };
    case "mouse:body:leave":
      return { ...state, ...clean };
    case "mouse:options-left:enter":
      return { ...state, ...clean, isOnParameter: true, isOnOptionsLeft: true };
    case "mouse:options-left:leave":
      return { ...state, isOnOptionsLeft: false };
    case "mouse:options-bottom:enter":
      return { ...state, ...clean, isOnParameter: true, isOnOptionsBottom: true };
    case "mouse:options-bottom:leave":
      return { ...state, isOnOptionsBottom: false };
    case "mouse:child:enter":
      return { ...state, ...clean, isOnParameter: true, isOnParameterChild: true };
    case "mouse:child:leave":
      return { ...state, isOnParameterChild: false };
    case "folded:toggle":
      return { ...state, isFolded: !state.isFolded };
    case "prompt:parameter-add:on":
      return { ...state, ...clean, showAddParameter: true };
    case "prompt:parameter-add:off":
      return { ...state, ...clean };
    case "prompt:parameter-parent-add:on":
      return { ...state, ...clean, showAddParameterParent: true };
    case "prompt:parameter-parent-add:off":
      return { ...state, ...clean, showAddParameterParent: false };
    case "prompt:parameter-rename:on":
      return { ...state, ...clean, showRenameParameter: true };
    case "prompt:parameter-rename:off":
      return { ...state, ...clean };
    case "prompt:parameter-remove":
      return { ...state, ...clean };
    case "prompt:choice-add:on":
      return { ...state, ...clean, showAddChoice: true };
    case "prompt:choice-add:off":
      return { ...state, ...clean };
    case "prompt:choice-rename:on":
      return { ...state, ...clean, showRenameChoice: true };
    case "prompt:choice-rename:off":
      return { ...state, ...clean };
    default:
      throw new Error("Unknown action");
  }
};

export function ParameterProvider({
  children,
  parameter,
  parentMouseEvent,
  parentUpdate,
  parentAdd,
  parentRename,
  parentRemove,
  isLocked,
  setIsLocked,
  top,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { structure } = state;
  const { isOnParameter, isOnParameterChild, isOnOptionsLeft } = state;
  const {
    showAddParameter,
    showAddParameterParent,
    showRenameParameter,
    showAddChoice,
    showRenameChoice,
  } = state;
  const { isFolded } = state;

  const activeChoice = useRef();

  const { name, parameters = [], choices = [] } = structure;
  const isStructure = parameters.length > 0;

  const isSelected =
    showAddChoice || showAddParameter || showAddParameterParent || showRenameParameter;

  useEffect(() => {
    dispatch({ type: "structure:update", payload: parameter });
  }, [parameter]);

  //-------------------------------------------------------------------------------------------

  const handleMouseParameterEnter = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    dispatch({ type: "mouse:body:enter" });

    if (parentMouseEvent) {
      parentMouseEvent(true);
    }
  };

  const handleMouseParameterLeave = (e) => {
    e.preventDefault();

    dispatch({ type: "mouse:body:leave" });

    if (parentMouseEvent) {
      parentMouseEvent(false);
    }
  };

  const handleMouseOptionsLeftEnter = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    dispatch({ type: "mouse:options-left:enter" });
  };

  const handleMouseOptionsLeftLeave = (e) => {
    e.preventDefault();

    dispatch({ type: "mouse:options-left:leave" });
  };

  const handleMouseOptionsBottomEnter = (e) => {
    e.preventDefault();

    if (!isLocked) {
      activeChoice.current = null;
    }

    dispatch({ type: "mouse:options-bottom:enter" });
  };

  const handleMouseOptionsBottomLeave = (e) => {
    e.preventDefault();

    dispatch({ type: "mouse:options-bottom:leave" });
  };

  const handleMouseParameterChild = (value) => {
    dispatch({ type: "mouse:child:enter" });
  };

  const handleMouseHeaderClick = (e) => {
    e.preventDefault();

    if (top) {
      dispatch({ type: "folded:toggle" });
    }
  };

  //-------------------------------------------------------------------------------------------

  const handleParameterUpdate = (parameter) => {
    const candidate = parameterUpdate(structure, parameter);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }
  };

  //-------------------------------------------------------------------------------------------

  const handleAddParameter = () => {
    dispatch({ type: "prompt:parameter-add:on" });

    setIsLocked(true);
  };

  const handleAddParameterLogic = (input, index) => {
    if (!input) {
      return;
    }

    const candidate = parameterAddAtPosition(structure, getParameter(input), index);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }

    dispatch({ type: "prompt:parameter-add:off" });

    setIsLocked(false);
  };

  const handleAddParameterCancel = () => {
    dispatch({ type: "prompt:parameter-add:off" });

    setIsLocked(false);
  };

  const handleAddParameterPlaceholder = () => {
    return faker.internet.domainWord();
  };

  //-------------------------------------------------------------------------------------------

  const handleRenameParameter = () => {
    dispatch({ type: "prompt:parameter-rename:on" });

    setIsLocked(true);
  };

  const handleRenameParameterLogic = (name, input) => {
    const candidate = parameterRename(structure, name, input);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }
  };

  const handleRenameParameterInitialLogic = (input) => {
    if (!input) {
      return;
    }

    if (parentRename) {
      parentRename(name, input);
    }

    dispatch({ type: "prompt:parameter-rename:off" });

    setIsLocked(false);
  };

  const handleRenameParameterCancel = () => {
    dispatch({ type: "prompt:parameter-rename:off" });

    setIsLocked(false);
  };

  const handleRenameParameterPlaceholder = () => {
    return name;
  };

  //-------------------------------------------------------------------------------------------

  const handleRenameChoice = () => {
    dispatch({ type: "prompt:choice-rename:on" });

    setIsLocked(true);
  };

  const handleRenameChoiceLogic = (input) => {
    const candidate = choiceRename(structure, activeChoice.current, input);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }

    dispatch({ type: "prompt:choice-rename:off" });

    setIsLocked(false);
  };

  const handleRenameChoiceCancel = () => {
    dispatch({ type: "prompt:choice-rename:off" });

    setIsLocked(false);
  };

  const handleRenameChoicePlaceholder = () => {
    return activeChoice.current;
  };

  //-------------------------------------------------------------------------------------------

  const handleAddParameterParent = () => {
    dispatch({ type: "prompt:parameter-parent-add:on" });

    setIsLocked(true);
  };

  const handleAddParameterParentLogic = (input, index) => {
    const candidate = parameterAddAtPosition(structure, getParameter(input), index);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }
  };

  const handleAddParameterParentInitialLogic = (input) => {
    if (!input) {
      return;
    }

    if (parentAdd) {
      parentAdd(input, name);
    }

    dispatch({ type: "prompt:parameter-parent-add:off" });

    setIsLocked(false);
  };

  const handleAddParameterParentCancel = () => {
    dispatch({ type: "prompt:parameter-parent-add:off" });

    setIsLocked(false);
  };

  const handleAddParameterParentPlaceholder = () => {
    return faker.internet.domainWord();
  };

  //-------------------------------------------------------------------------------------------

  const handleRemoveParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = parameterRemove(structure, input);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }
  };

  const handleRemoveParameterParentInitialLogic = () => {
    if (parentRemove) {
      parentRemove(name);
    }

    dispatch({ type: "prompt:parameter-remove" });
  };

  //-------------------------------------------------------------------------------------------

  const handleAddChoice = () => {
    dispatch({ type: "prompt:choice-add:on" });

    setIsLocked(true);
  };

  const handleAddChoiceLogic = (input) => {
    if (!input) {
      return;
    }

    let candidate;

    if (activeChoice.current) {
      candidate = choiceAddAtPosition(structure, getChoice(input), activeChoice.current);
    } else {
      candidate = choiceAdd(structure, getChoice(input));
    }

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }
  };

  const handleAddChoiceCancel = () => {
    dispatch({ type: "prompt:choice-add:off" });

    setIsLocked(false);
  };

  const handleAddChoicePlaceholder = () => {
    return faker.internet.userName();
  };

  //-------------------------------------------------------------------------------------------

  const handleRemoveChoiceLogic = () => {
    if (!activeChoice.current) {
      return;
    }

    const candidate = choiceRemove(structure, activeChoice.current);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "structure:update", payload: candidate });
    }
  };

  //-------------------------------------------------------------------------------------------

  return (
    <ParameterContext.Provider
      value={{
        top,
        name,
        parameters,
        choices,
        handleMouseParameterEnter,
        handleMouseParameterLeave,
        handleMouseOptionsLeftEnter,
        handleMouseOptionsLeftLeave,
        handleMouseOptionsBottomEnter,
        handleMouseOptionsBottomLeave,

        handleMouseParameterChild,
        handleMouseHeaderClick,

        handleParameterUpdate,

        isOnOptionsLeft,
        isOnParameter,
        isOnParameterChild,
        isSelected,
        isLocked,
        isFolded,
        isStructure,
        setIsLocked,

        showAddChoice,
        handleAddChoice,
        handleAddChoiceLogic,
        handleAddChoiceCancel,
        handleAddChoicePlaceholder,

        showRenameChoice,
        handleRenameChoice,
        handleRenameChoiceLogic,
        handleRenameChoiceCancel,
        handleRenameChoicePlaceholder,

        showAddParameter,
        handleAddParameter,
        handleAddParameterLogic,
        handleAddParameterCancel,
        handleAddParameterPlaceholder,

        showRenameParameter,
        handleRenameParameter,
        handleRenameParameterLogic,
        handleRenameParameterInitialLogic,
        handleRenameParameterCancel,
        handleRenameParameterPlaceholder,

        showAddParameterParent,
        handleAddParameterParent,
        handleAddParameterParentLogic,
        handleAddParameterParentInitialLogic,
        handleAddParameterParentCancel,
        handleAddParameterParentPlaceholder,

        handleRemoveParameterParentLogic,
        handleRemoveParameterParentInitialLogic,

        handleRemoveChoiceLogic,

        activeChoice,
      }}>
      {children}
    </ParameterContext.Provider>
  );
}

export function useParameter() {
  const context = useContext(ParameterContext);

  if (context === undefined) {
    throw new Error("ParameterContext was used outside of the ParameterProvider.");
  }

  return context;
}
