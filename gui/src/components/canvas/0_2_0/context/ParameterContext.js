import { createContext, useContext, useReducer, useRef, useState } from "react";
import {
  addChoice,
  addParameter,
  createChoice,
  createParameter,
  getNameFromId,
  getParentId,
  removeChoice,
  removeParameter,
  renameChoice,
  renameParameter,
} from "../logic/model";

const ParameterContext = createContext();

const initialState = {
  structure: {},

  isFolded: false,

  isOnParameter: false,
  isOnParameterChild: false,
  isOnOptionsBottom: false,
  isOnHeader: false,

  showAddParameter: false,
  showAddChoice: false,
  showRenameChoice: false,
};

const clean = {
  isOnParameter: false,
  isOnParameterChild: false,
  isOnOptionsBottom: false,
  isOnHeader: false,

  showAddParameter: false,
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
    case "mouse:options-bottom:enter":
      return { ...state, ...clean, isOnParameter: true, isOnOptionsBottom: true };
    case "mouse:options-bottom:leave":
      return { ...state, isOnOptionsBottom: false };
    case "mouse:child:enter":
      return { ...state, ...clean, isOnParameter: true, isOnParameterChild: true };
    case "mouse:child:leave":
      return { ...state, isOnParameterChild: false };
    case "mouse:header:enter":
      return { ...state, ...clean, isOnParameter: true, isOnHeader: true };
    case "mouse:header:leave":
      return { ...state, isOnHeader: false };
    case "folded:toggle":
      return { ...state, isFolded: !state.isFolded };
    case "folded:on":
      return { ...state, isFolded: true };
    case "folded:off":
      return { ...state, isFolded: false };
    case "prompt:parameter-add:on":
      return { ...state, ...clean, showAddParameter: true };
    case "prompt:parameter-add:off":
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
  top,
  activeParameter,
  setActiveParameter,
  setRoot,
  isLocked,
  setIsLocked,
  children,
  parameter,
  parentMouseEvent,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDragged, setIsDragged] = useState(false);

  const { isOnParameter, isOnHeader, isOnParameterChild, isOnOptionsLeft } = state;
  const { showAddParameter, showAddChoice, showRenameChoice } = state;
  const { isFolded } = state;

  const activeChoice = useRef();

  const { id, name, parameters = [], choices = [] } = parameter;
  const isStructure = parameters.length > 0;

  const isSelected = showAddChoice || showAddParameter;

  //-------------------------------------------------------------------------------------------

  const handleMouseParameterEnter = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    setActiveParameter(id);
    dispatch({ type: "mouse:body:enter" });

    if (parentMouseEvent) {
      parentMouseEvent(true);
    }
  };

  const handleMouseParameterLeave = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    setActiveParameter(null);
    dispatch({ type: "mouse:body:leave" });

    if (parentMouseEvent) {
      parentMouseEvent(false);
    }
  };

  const handleMouseHeaderEnter = (e) => {
    e.preventDefault();

    dispatch({ type: "mouse:header:enter" });
  };

  const handleMouseHeaderLeave = (e) => {
    e.preventDefault();

    dispatch({ type: "mouse:header:leave" });
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

    if (isLocked) {
      return;
    }

    dispatch({ type: "mouse:options-bottom:leave" });
  };

  const handleMouseParameterChild = (value) => {
    if (isLocked) {
      return;
    }

    if (value) {
      dispatch({ type: "mouse:child:enter" });
    } else {
      dispatch({ type: "mouse:child:leave" });
    }
  };

  const handleSetFolded = (value) => {
    if (isLocked) {
      return;
    }

    if (top) {
      if (value === undefined) {
        dispatch({ type: "folded:toggle" });
      } else {
        if (value === true) {
          dispatch({ type: "folded:on" });
        } else if (value === false) {
          dispatch({ type: "folded:off" });
        }
      }
    }
  };

  //-------------------------------------------------------------------------------------------

  const handleAddParameterCancel = () => {
    dispatch({ type: "prompt:parameter-add:off" });

    setIsLocked(false);
  };

  const handleAddParameter = () => {
    dispatch({ type: "prompt:parameter-add:on" });

    setIsLocked(true);
  };

  const handleAddParameterLogic = (input, index) => {
    if (!input) {
      return;
    }

    const [candidate, parameter] = addParameter(id, createParameter(input), index);

    setRoot(candidate);
    setActiveParameter(parameter.id);

    handleAddParameterCancel();
  };

  //-------------------------------------------------------------------------------------------

  const handleAddParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

    const parentId = getParentId(id);
    const candidate = addParameter(parentId, createParameter(""), id);

    setActiveParameter(null);
    dispatch({ type: "mouse:body:leave" });
    setIsLocked(true);
    setRoot(candidate);
  };

  //-------------------------------------------------------------------------------------------

  const handleRenameParameterLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = renameParameter(id, input);

    setActiveParameter(null);
    setRoot(candidate);
  };

  //-------------------------------------------------------------------------------------------

  const handleRemoveParameterParentLogic = () => {
    const candidate = removeParameter(id);

    setRoot(candidate);
  };

  //-------------------------------------------------------------------------------------------

  const handleAddChoiceCancel = () => {
    dispatch({ type: "prompt:choice-add:off" });

    setIsLocked(false);
  };

  const handleAddChoice = () => {
    dispatch({ type: "prompt:choice-add:on" });

    setIsLocked(true);
  };

  const handleAddChoiceLogic = (input) => {
    if (!input) {
      return;
    }

    if (activeChoice.current) {
      setRoot(addChoice(id, createChoice(input), activeChoice.current));
    } else {
      setRoot(addChoice(id, createChoice(input)));
    }
  };

  //-------------------------------------------------------------------------------------------

  const handleRemoveChoiceLogic = () => {
    if (!activeChoice.current) {
      return;
    }

    setRoot(removeChoice(activeChoice.current));
  };

  //-------------------------------------------------------------------------------------------

  const handleRenameChoiceCancel = () => {
    dispatch({ type: "prompt:choice-rename:off" });

    setIsLocked(false);
  };

  const handleRenameChoice = () => {
    dispatch({ type: "prompt:choice-rename:on" });

    setIsLocked(true);
  };

  const handleRenameChoiceLogic = (input) => {
    const candidate = renameChoice(activeChoice.current, input);

    setRoot(candidate);

    handleRenameChoiceCancel();
  };

  const handleRenameChoicePlaceholder = () => {
    return getNameFromId(activeChoice.current);
  };

  //-------------------------------------------------------------------------------------------

  return (
    <ParameterContext.Provider
      value={{
        activeParameter,
        setActiveParameter,
        setRoot,

        top,

        id,
        name,
        choices,
        parameters,

        isDragged,
        setIsDragged,

        handleMouseParameterEnter,
        handleMouseParameterLeave,
        handleMouseHeaderEnter,
        handleMouseHeaderLeave,
        handleMouseOptionsBottomEnter,
        handleMouseOptionsBottomLeave,

        handleMouseParameterChild,
        handleSetFolded,

        isOnOptionsLeft,
        isOnParameter,
        isOnHeader,
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

        showRenameChoice,
        handleRenameChoice,
        handleRenameChoiceLogic,
        handleRenameChoiceCancel,
        handleRenameChoicePlaceholder,

        showAddParameter,
        handleAddParameter,
        handleAddParameterLogic,
        handleAddParameterCancel,

        handleRenameParameterLogic,

        handleAddParameterParentLogic,

        handleRemoveParameterParentLogic,

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
