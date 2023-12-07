import { createContext, useContext, useReducer, useRef } from "react";
import { faker } from "@faker-js/faker";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../drag/ItemTypes";
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

  const { id, name, parameters = [], choices = [] } = parameter;
  const isStructure = parameters.length > 0;

  const isSelected =
    showAddChoice || showAddParameter || showAddParameterParent || showRenameParameter;

  // eslint-disable-next-line no-unused-vars
  const [{ _isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PARAMETER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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

    if (isLocked) {
      return;
    }

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

    if (isLocked) {
      return;
    }

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

  const handleMouseHeaderClick = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    if (top) {
      dispatch({ type: "folded:toggle" });
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

    setRoot(addParameter(root, id, createParameter(input), index));

    handleAddParameterCancel();
  };

  const handleAddParameterPlaceholder = () => {
    return faker.internet.domainWord();
  };

  //-------------------------------------------------------------------------------------------

  const handleAddParameterParentCancel = () => {
    dispatch({ type: "prompt:parameter-parent-add:off" });

    setIsLocked(false);
  };

  const handleAddParameterParent = () => {
    dispatch({ type: "prompt:parameter-parent-add:on" });

    setIsLocked(true);
  };

  const handleAddParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

    const parentId = getParentId(id);
    const index = getIndex(root, id, parentId);
    const candidate = addParameter(root, parentId, createParameter(input), index);

    setRoot(candidate);

    handleAddParameterParentCancel();
  };

  const handleAddParameterParentPlaceholder = () => {
    return faker.internet.domainWord();
  };

  //-------------------------------------------------------------------------------------------

  const handleRenameParameterCancel = () => {
    dispatch({ type: "prompt:parameter-rename:off" });

    setIsLocked(false);
  };

  const handleRenameParameter = () => {
    dispatch({ type: "prompt:parameter-rename:on" });

    setIsLocked(true);
  };

  const handleRenameParameterLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = renameParameter(root, id, input);

    setRoot(candidate);

    handleRenameParameterCancel();
  };

  const handleRenameParameterPlaceholder = () => {
    return name;
  };

  //-------------------------------------------------------------------------------------------

  const handleRemoveParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

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
        root,
        setRoot,

        drag,

        top,

        id,
        name,
        choices,
        parameters,

        handleMouseParameterEnter,
        handleMouseParameterLeave,
        handleMouseOptionsLeftEnter,
        handleMouseOptionsLeftLeave,
        handleMouseOptionsBottomEnter,
        handleMouseOptionsBottomLeave,

        handleMouseParameterChild,
        handleMouseHeaderClick,

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
        handleRenameParameterCancel,
        handleRenameParameterPlaceholder,

        showAddParameterParent,
        handleAddParameterParent,
        handleAddParameterParentLogic,
        handleAddParameterParentCancel,
        handleAddParameterParentPlaceholder,

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
