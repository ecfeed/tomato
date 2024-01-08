import { createContext, useContext, useReducer, useRef } from "react";
import {
  addChoice,
  addParameter,
  createChoice,
  createParameter,
  getNameFromId,
  getParentId,
  isTop,
  removeChoice,
  removeParameter,
  renameChoice,
  renameParameter,
} from "../logic/model";

const ParameterActionContext = createContext();

const initialState = {
  structure: {},

  isFolded: false,
};


const reducer = (state, action) => {
  switch (action.type) {
    case "structure:update":
      return { ...state, structure: action.payload };
    case "folded:toggle":
      return { ...state, isFolded: !state.isFolded };
    case "folded:on":
      return { ...state, isFolded: true };
    case "folded:off":
      return { ...state, isFolded: false };
    default:
      throw new Error("Unknown action");
  }
};

export function ParameterActionProvider({
  activeParameter,
  setActiveParameter,
  setRoot,
  isLocked,
  setIsLocked,
  children,
  parameter,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isFolded } = state;

  const activeChoice = useRef();

  const { id, name, parameters = [], choices = [] } = parameter;
  const isStructure = parameters.length > 0;

  //-------------------------------------------------------------------------------------------

  const handleSetFolded = (value) => {
    if (isLocked) {
      return;
    }

    if (isTop(id)) {
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
    setIsLocked(false);
  };

  const handleAddParameter = () => {
    setIsLocked(true);
  };

  const handleAddParameterLogic = (input, index) => {
    if (!input) {
      return;
    }

    const candidate = addParameter(id, createParameter(input), index);

    setRoot(candidate);

    handleAddParameterCancel();
  };

  //-------------------------------------------------------------------------------------------

  const handleAddParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = addParameter(getParentId(id), createParameter(""), id);

    setActiveParameter(null);

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
    <ParameterActionContext.Provider
      value={{
        activeParameter,
        setActiveParameter,
        setRoot,

        id,
        name,
        choices,
        parameters,

        handleSetFolded,

        isLocked,
        isFolded,
        isStructure,
        setIsLocked,

        handleAddChoice,
        handleAddChoiceLogic,
        handleAddChoiceCancel,

        handleRenameChoice,
        handleRenameChoiceLogic,
        handleRenameChoiceCancel,
        handleRenameChoicePlaceholder,

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
    </ParameterActionContext.Provider>
  );
}

export function useParameterAction() {
  const context = useContext(ParameterActionContext);

  if (context === undefined) {
    throw new Error("ParameterActionContext was used outside of the ParameterActionProvider.");
  }

  return context;
}
