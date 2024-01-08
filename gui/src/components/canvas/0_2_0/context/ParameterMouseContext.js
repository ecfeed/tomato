import { createContext, useCallback, useContext, useReducer, useState } from "react";

const ParameterMouseContext = createContext();

const initialState = {
  isOnParameter: false,
  isOnHeader: false,
  isOnParameterChild: false,
  isOnOptionsBottom: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "mouse:body:enter":
      return { ...state, isOnParameter: true };
    case "mouse:body:leave":
      return initialState;
    case "mouse:options-bottom:enter":
      return { ...state, ...initialState, isOnParameter: true, isOnOptionsBottom: true };
    case "mouse:options-bottom:leave":
      return { ...state, isOnOptionsBottom: false };
    case "mouse:child:enter":
      return { ...state, ...initialState, isOnParameter: true, isOnParameterChild: true };
    case "mouse:child:leave":
      return { ...state, isOnParameterChild: false };
    case "mouse:header:enter":
      return { ...state, ...initialState, isOnParameter: true, isOnHeader: true };
    case "mouse:header:leave":
      return { ...state, isOnHeader: false };
    default:
      throw new Error("Unknown action");
  }
};

export function ParameterMouseProvider({
  children,
  id,
  isLocked,
  parentMouseEvent,
  setActiveParameter,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isOnParameter, isOnHeader, isOnParameterChild, isOnOptionsBottom } = state;

  const [isDragged, setIsDragged] = useState(false);

  //-------------------------------------------------------------------------------------------

  const handleMouseParameterEnter = useCallback(
    (e) => {
      e.preventDefault();

      if (isLocked) {
        return;
      }

      setActiveParameter(id);
      dispatch({ type: "mouse:body:enter" });

      if (parentMouseEvent) {
        parentMouseEvent(true);
      }
    },
    [id, isLocked, parentMouseEvent, setActiveParameter]
  );

  const handleMouseParameterLeave = useCallback(
    (e) => {
      e.preventDefault();

      if (isLocked) {
        return;
      }

      setActiveParameter(null);
      dispatch({ type: "mouse:body:leave" });

      if (parentMouseEvent) {
        parentMouseEvent(false);
      }
    },
    [isLocked, parentMouseEvent, setActiveParameter]
  );

  const handleMouseHeaderEnter = useCallback((e) => {
    e.preventDefault();

    dispatch({ type: "mouse:header:enter" });
  }, []);

  const handleMouseHeaderLeave = useCallback((e) => {
    e.preventDefault();

    dispatch({ type: "mouse:header:leave" });
  }, []);

  const handleMouseOptionsBottomEnter = useCallback((e) => {
    e.preventDefault();

    dispatch({ type: "mouse:options-bottom:enter" });
  }, []);

  const handleMouseOptionsBottomLeave = useCallback(
    (e) => {
      e.preventDefault();

      if (isLocked) {
        return;
      }

      dispatch({ type: "mouse:options-bottom:leave" });
    },
    [isLocked]
  );

  const handleMouseParameterChild = useCallback(
    (value) => {
      if (isLocked) {
        return;
      }

      if (value) {
        dispatch({ type: "mouse:child:enter" });
      } else {
        dispatch({ type: "mouse:child:leave" });
      }
    },
    [isLocked]
  );

  //-------------------------------------------------------------------------------------------

  return (
    <ParameterMouseContext.Provider
      value={{
        handleMouseParameterEnter,
        handleMouseParameterLeave,
        handleMouseHeaderEnter,
        handleMouseHeaderLeave,
        handleMouseOptionsBottomEnter,
        handleMouseOptionsBottomLeave,
        handleMouseParameterChild,

        isOnParameter,
        isOnHeader,
        isOnParameterChild,
        isOnOptionsBottom,

        isDragged,
        setIsDragged,
      }}>
      {children}
    </ParameterMouseContext.Provider>
  );
}

export function useParameterMouse() {
  const context = useContext(ParameterMouseContext);

  if (context === undefined) {
    throw new Error("ParameterMouseContext was used outside of the ParameterMouseProvider.");
  }

  return context;
}
