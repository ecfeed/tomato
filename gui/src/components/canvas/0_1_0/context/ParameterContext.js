import { createContext, useContext, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  choiceAdd,
  choiceRemove,
  getChoice,
  getParameter,
  parameterAddAtPosition,
  parameterRemove,
  parameterRename,
  parameterUpdate,
} from "../logic/driver";

const ParameterContext = createContext();

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
  const [structure, setStructure] = useState({});
  const [isOnParameter, setIsOnParameter] = useState(false);
  const [isOnParameterChild, setIsOnParameterChild] = useState(false);
  const [isOnOptionsLeft, setIsOnOptionsLeft] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [showAddParameter, setShowAddParameter] = useState(false);
  const [showAddParameterParent, setShowAddParameterParent] = useState(false);
  const [showRenameParameter, setShowRenameParameter] = useState(false);
  const [isFolded, setIsFolded] = useState(false);

  const { name, parameters = [], choices = [] } = structure;
  const isStructure = parameters.length > 0;

  const isSelected = showAddChoice || showAddParameter || showAddParameterParent || showRenameParameter;

  useEffect(() => {
    setStructure(parameter);
  }, [parameter]);

  //-------------------------------------------------------------------------------------------

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

  const handleMouseOptionsLeftEnter = (e) => {
    e.preventDefault();
    setIsOnOptionsLeft(true);
  };

  const handleMouseOptionsLeftLeave = (e) => {
    e.preventDefault();
    setIsOnOptionsLeft(false);
  };

  //-------------------------------------------------------------------------------------------

  const handleMouseHeaderClick = (e) => {
    e.preventDefault();

    if (top) {
      setIsFolded((e) => !e);
    }
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

 

  //-------------------------------------------------------------------------------------------

  const handleAddParameter = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setShowAddParameter(true);

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

    setShowAddParameter(false);

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

  const handleAddParameterPlaceholder = () => {
    return faker.internet.domainWord();
  };

    //-------------------------------------------------------------------------------------------

    const handleRenameParameter = () => {
      setIsOnParameter(false);
      setIsOnParameterChild(false);
      setIsOnOptionsLeft(false);
  
      setShowRenameParameter(true);
  
      setIsLocked(true);
    };
  
    const handleRenameParameterLogic = (name, input) => {
      const candidate = parameterRename(structure, name, input);
  
      if (parentUpdate) {
        parentUpdate(candidate);
      } else {
        setStructure(candidate);
      }
    };

    const handleRenameParameterInitialLogic = (input) => {
      if (!input) {
        return;
      }

      if (parentRename) {
        parentRename(name, input);
      }

      setShowRenameParameter(false);
  
      setIsOnParameter(false);
      setIsOnParameterChild(false);
      setIsOnOptionsLeft(false);
  
      setIsLocked(false);
    }
  
    const handleRenameParameterCancel = () => {
      setShowRenameParameter(false);
  
      setIsOnParameter(false);
      setIsOnParameterChild(false);
      setIsOnOptionsLeft(false);
  
      setIsLocked(false);
    };
  
    const handleRenameParameterPlaceholder = () => {
      return name;
    };
  

  //-------------------------------------------------------------------------------------------

  const handleAddParameterParent = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setShowAddParameterParent(true);

    setIsLocked(true);
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

  const handleAddParameterParentCancel = () => {
    setShowAddParameterParent(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

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

  //-------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------

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
