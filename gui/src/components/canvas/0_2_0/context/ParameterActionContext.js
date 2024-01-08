import { createContext, useContext, useReducer, useRef } from "react";
import {
  addChoice,
  addParameter,
  createChoice,
  createParameter,
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

  const handleAddParameterLogic = (input, index) => {
    if (!input) {
      return;
    }

    const candidate = addParameter(id, createParameter(input), index);

    setActiveParameter(null);

    setRoot(candidate);
  };

  const handleAddParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = addParameter(getParentId(id), createParameter(""), id);

    setActiveParameter(null);

    setRoot(candidate);
  };

  const handleRenameParameterLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = renameParameter(id, input);

    setActiveParameter(null);

    setRoot(candidate);
  };

  const handleRemoveParameterParentLogic = () => {
    const candidate = removeParameter(id);

    setActiveParameter(null); 

    setRoot(candidate);
  };

  //-------------------------------------------------------------------------------------------

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


  const handleRemoveChoiceLogic = () => {
    if (!activeChoice.current) {
      return;
    }

    setRoot(removeChoice(activeChoice.current));
  };

  const handleRenameChoiceLogic = (input) => {
    const candidate = renameChoice(activeChoice.current, input);

    setRoot(candidate);
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

        handleAddChoiceLogic,

        handleRenameChoiceLogic,
        handleAddParameterLogic,
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
