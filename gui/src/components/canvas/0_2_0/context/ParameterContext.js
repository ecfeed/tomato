import { createContext, useContext, useReducer, useRef } from "react";
import { faker } from "@faker-js/faker";
// import { useDrag } from "react-dnd";
// import { ItemTypes } from "../abstract/ItemTypes";
import {
  addChoice,
  addParameter,
  createChoice,
  createParameter,
  getIndex,
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
  activeParameter,
  setActiveParameter,
  root,
  setRoot,
  isLocked,
  setIsLocked,
  children,
  parameter,
  parentMouseEvent,
  top,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isOnParameter, isOnHeader, isOnParameterChild, isOnOptionsLeft } = state;
  const {
    showAddParameter,
    showAddChoice,
    showRenameChoice,
  } = state;
  const { isFolded } = state;

  const activeChoice = useRef();

  const { id, name, parameters = [], choices = [] } = parameter;
  const isStructure = parameters.length > 0;

  const isSelected = showAddChoice || showAddParameter;

  // const [{ _isDragging }, drag] = useDrag(() => ({
  //   type: ItemTypes.PARAMETER,
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  // }));

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

    const [candidate, parameter] = addParameter(root, id, createParameter(input), index);

    setRoot(candidate);
    setActiveParameter(parameter.id);

    handleAddParameterCancel();
  };

  const handleAddParameterPlaceholder = () => {
    return faker.internet.domainWord();
  };

  //-------------------------------------------------------------------------------------------

  const handleAddParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

    const parentId = getParentId(id);
    const index = getIndex(root, id, parentId);
    const candidate = addParameter(root, parentId, createParameter(''), index);

    setActiveParameter(null);
    setIsLocked(true);
    setRoot(candidate);
  };

  //-------------------------------------------------------------------------------------------

  const handleRenameParameterLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = renameParameter(root, id, input);

    setActiveParameter(null);
    setRoot(candidate);
  };

  //-------------------------------------------------------------------------------------------

  const handleRemoveParameterParentLogic = () => {

    const candidate = removeParameter(root, id);

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
      const index = getIndex(root, activeChoice.current);
      setRoot(addChoice(root, id, createChoice(input), index));
    } else {
      setRoot(addChoice(root, id, createChoice(input)));
    }
  };

  const handleAddChoicePlaceholder = () => {
    return faker.internet.userName();
  };

  //-------------------------------------------------------------------------------------------

  const handleRemoveChoiceLogic = () => {
    if (!activeChoice.current) {
      return;
    }

    setRoot(removeChoice(root, activeChoice.current));
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
    const candidate = renameChoice(root, activeChoice.current, input);

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
        root,
        setRoot,

        // drag,

        top,

        id,
        name,
        choices,
        parameters,

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
