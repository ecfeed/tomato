import { createContext, useContext, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  choiceAdd,
  choiceRemove,
  getChoice,
  getParameter,
  parameterAddAtPosition,
  parameterRemove,
  parameterUpdate,
} from "../logic/driver";

const ParameterContext = createContext();

export function ParameterProvider({
  children,
  parameter,
  parentMouseEvent,
  parentUpdate,
  parentAdd,
  parentRemove,
  isLocked,
  setIsLocked,
  top,
}) {
  const [structure, setStructure] = useState({});
  const [isOnParameter, setIsOnParameter] = useState(false);
  const [isOnParameterChild, setIsOnParameterChild] = useState(false);
  const [isOnOptionsLeft, setIsOnOptionsLeft] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [showAddParameter, setShowAddParameter] = useState(false);
  const [showAddParameterParent, setShowAddParameterParent] = useState(false);
  const [isFolded, setIsFolded] = useState(false);

  const { name, parameters = [], choices = [] } = structure;
  const isStructure = parameters.length > 0;

  const isSelected = showAddChoice || showAddParameter || showAddParameterParent;

  useEffect(() => {
    setStructure(parameter);
  }, [parameter]);

  const handleMouseParameterEnter = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    setIsOnParameter(true);

    if (parentMouseEvent) {
      parentMouseEvent(true);
    }
  };

  const handleMouseParameterLeave = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    setIsOnParameter(false);
    setIsOnParameterChild(false);

    if (parentMouseEvent) {
      parentMouseEvent(false);
    }
  };

  const handleMouseHeaderClick = (e) => {
    e.preventDefault();

    if (top) {
      setIsFolded((e) => !e);
    }
  };

  const handleMouseOptionsLeftEnter = (e) => {
    e.preventDefault();
    setIsOnOptionsLeft(true);
  };

  const handleMouseOptionsLeftLeave = (e) => {
    e.preventDefault();
    setIsOnOptionsLeft(false);
  };

  const handleMouseParameterChild = (value) => {
    setIsOnParameterChild(value);
  };

  const handleParameterUpdate = (parameter) => {
    const candidate = parameterUpdate(structure, parameter);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleRemoveParameterParentLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = parameterRemove(structure, input);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleRemoveParameterParentInitialLogic = () => {

    if (parentRemove) {
      parentRemove(name);
    }

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);
  };

  const handleRemoveChoiceLogic = (input) => {

    if (!input) {
      return;
    }

    const candidate = choiceRemove(structure, input);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  }

  const handleAddParameter = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setShowAddParameter(true);

    setIsLocked(true);
  };

  const handleAddParameterParent = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setShowAddParameterParent(true);

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
      setStructure(candidate);
    }
  };

  const handleAddParameterParentLogic = (input, index) => {
    const candidate = parameterAddAtPosition(structure, getParameter(input), index);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddParameterParentInitialLogic = (input) => {
    if (!input) {
      return;
    }

    if (parentAdd) {
      parentAdd(input, name);
    }

    setShowAddParameterParent(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddParameterCancel = () => {
    setShowAddParameter(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddParameterParentCancel = () => {
    setShowAddParameterParent(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddParameterPlaceholder = () => {
    return faker.internet.domainWord();
  };

  const handleAddChoice = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);
    setShowAddParameter(false);

    setShowAddChoice(true);

    setIsLocked(true);
  };

  const handleAddChoiceLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = choiceAdd(structure, getChoice(input));

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddChoiceCancel = () => {
    setShowAddChoice(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddChoicePlaceholder = () => {
    return faker.internet.userName();
  };

  return (
    <ParameterContext.Provider
      value={{
        top,
        name,
        parameters,
        choices,
        handleMouseParameterEnter,
        handleMouseParameterLeave,
        handleAddParameterParent,
        handleMouseOptionsLeftEnter,
        handleMouseOptionsLeftLeave,
        handleAddParameter,
        handleAddChoice,
        isOnOptionsLeft,
        isOnParameter,
        isOnParameterChild,
        isSelected,
        isLocked,
        isFolded,
        isStructure,
        setIsLocked,
        showAddChoice,
        handleAddChoicePlaceholder,
        handleAddChoiceCancel,
        handleAddChoiceLogic,
        showAddParameter,
        handleAddParameterPlaceholder,
        handleAddParameterCancel,
        handleAddParameterLogic,
        showAddParameterParent,
        handleAddParameterParentCancel,
        handleAddParameterParentLogic,
        handleAddParameterParentInitialLogic,
        handleRemoveParameterParentLogic,
        handleRemoveParameterParentInitialLogic,
        handleRemoveChoiceLogic,
        handleMouseHeaderClick,
        handleMouseParameterChild,
        handleParameterUpdate,
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
