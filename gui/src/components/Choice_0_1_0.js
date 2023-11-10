import { useEffect, useReducer } from "react";
import Tooltip from "./Tooltip_0_1_0";
import "./Choice_0_1_0.css";

function getSampleChoice() {
  return {
    name: crypto.randomUUID(),
    value: crypto.randomUUID(),
  };
}

const initialState = {
  structure: {},
  ui: {
    isFolded: true,
    isOnRightSidebar: false,
    isControlled: false,
  },
};

const abstractChoiceAdd = (reference, choice) => {
  if (!choice.name) {
    throw new Error("The name of the choice is undefined!");
  }

  const structure = reference;

  if (!structure.nested) {
    structure.nested = [choice];
  } else {
    if (structure.nested.filter((e) => e.name === choice.name).length > 0) {
      throw new Error("A choice with the specified name already exists!");
    } else {
      structure.nested.push(choice);
    }
  }

  return structure;
};

const abstractChoiceDelete = (reference, choice) => {
  if (!choice.name) {
    throw new Error("The name of the choice is undefined!");
  }

  const structure = reference;

  if (!structure.nested) {
    throw new Error("The choice is not abstract!");
  } else {
    structure.nested = structure.nested.filter((e) => e.name !== choice.name);
  }

  return structure;
};

const abstractChoiceUpdate = (reference, choice) => {
  if (!choice.name) {
    throw new Error("The name of the choice is undefined!");
  }

  const structure = reference;

  if (!structure.nested) {
    throw new Error("The choice is not abstract!");
  } else {
    if (structure.nested.filter((e) => e.name === choice.name).length > 0) {
      structure.nested = structure.nested.map((e) => (e.name === choice.name ? choice : e));
    } else {
      throw new Error("A choice with the specified name already exists!");
    }
  }

  return structure;
};

const toggleDisabled = (choice) => {
  return { ...choice, meta: { ...choice.meta, disabled: !choice.meta?.disabled } };
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

export default function Choice({
  structure,
  parentUpdate,
  parentCancelView,
  parentAbstractChoiceRemove,
}) {
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

  const handleOnClickFold = () => {
    dispatch({ type: "toggleIsFolded" });
  };

  const handleOnClickDisable = () => {
    let candidate = toggleDisabled(state.structure);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "reload", payload: candidate });
    }
  };

  const handleAbstractChoiceAdd = () => {
    let candidate = abstractChoiceAdd(state.structure, getSampleChoice());

    dispatch({ type: "reload", payload: candidate });
    dispatch({ type: "setIsFolded", payload: false });
  };

  const handleAbstractChoiceRemoveInitial = () => {
    if (parentUpdate) {
      parentAbstractChoiceRemove(state.structure);
    } else {
      alert("Cannot remove the top-level element!");
    }
  };

  const handleAbstractChoiceRemove = (choice) => {
    let candidate = abstractChoiceDelete(state.structure, choice);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      dispatch({ type: "reload", payload: candidate });
    }
  };

  const handleAbstractChoiceUpdate = (choice) => {
    let candidate = abstractChoiceUpdate(state.structure, choice);

    if (parentUpdate) {
      parentUpdate(state.structure);
    } else {
      dispatch({ type: "reload", payload: candidate });
    }
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
    console.log("in");
    dispatch({ type: "setIsOnLeftSidebar", payload: true });
  };

  const handleLeftSidebarMouseLeave = () => {
    console.log("out");
    dispatch({ type: "setIsOnLeftSidebar", payload: false });
  };

  const handleCancelView = () => {
    dispatch({ type: "setIsControlled", payload: false });
  };

  return (
    <div
      className={`choice ${isDisabled ? "disabled" : "enabled"}`}
      onMouseLeave={handleOptionsMouseLeave}>
      <div className="main" onMouseOver={handleOptionsMouseEnter} onClick={handleOnClickFold}>
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
          show={isControlled}
          handleAdd={handleAbstractChoiceAdd}
          handleDisable={handleOnClickDisable}
          handleRemove={handleAbstractChoiceRemoveInitial}
          isOnRightSidebar={isOnRightSidebar}
          isOnLeftSidebar={isOnLeftSidebar}
        />
        <Labels
          labels={labels}
          isOnRightSidebar={isOnRightSidebar}
          isOnLeftSidebar={isOnLeftSidebar}
        />
        <NestedChoices
          nested={nested}
          isFolded={isFolded}
          clean={handleCancelView}
          parentUpdate={handleAbstractChoiceUpdate}
          parentAbstractChoiceRemove={handleAbstractChoiceRemove}
        />
      </div>
    </div>
  );
}

function View({ isFolded, isAbstract, name, value }) {
  if (isFolded || isAbstract) {
    return <ViewSimple name={name} />;
  }

  return <ViewExtended name={name} value={value} />;
}

function ViewSimple({ name }) {
  return (
    <div className="folded">
      <Tooltip info={name}>{name}</Tooltip>
    </div>
  );
}

function ViewExtended({ name, value }) {
  return (
    <div className="expanded">
      <ViewExtendedName>
        <Tooltip info={name}>{name}</Tooltip>
      </ViewExtendedName>

      <ViewExtendedValue>
        <Tooltip info={value}>{value}</Tooltip>
      </ViewExtendedValue>
    </div>
  );
}

function ViewExtendedName({ children }) {
  return <div className="choice_name">{children}</div>;
}

function ViewExtendedValue({ children }) {
  return <div className="choice_value">{children}</div>;
}

function SidebarLeft({
  isFolded,
  isRandom,
  isAbstract,
  descriptions,
  handleMouseEnter,
  handleMouseLeave,
}) {
  if (!(isAbstract || isRandom || descriptions || descriptions?.length === 0)) {
    return null;
  }

  return (
    <div
      className={`markers markers_left markers_${isFolded ? "horizontal" : "vertical"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <SidebarRandomized isRandom={isRandom} isAbstract={isAbstract} />
      <SidebarAbstract isAbstract={isAbstract} />
      <SidebarDescriptions descriptions={descriptions} />
    </div>
  );
}

function SidebarRight({ isFolded, labels, handleMouseEnter, handleMouseLeave }) {
  if (!labels || labels?.length === 0) {
    return null;
  }

  return (
    <div className={`markers markers_right markers_${isFolded ? "horizontal" : "vertical"}`}>
      <SidebarLabels
        labels={labels}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </div>
  );
}

function SidebarRandomized({ isRandom, isAbstract }) {
  if (!isRandom || isAbstract) {
    return null;
  }

  return (
    <Tooltip info="The choice is randomized.">
      <div className="marker">?</div>
    </Tooltip>
  );
}

function SidebarAbstract({ isAbstract }) {
  if (!isAbstract) {
    return null;
  }

  return (
    <Tooltip info="The choice is abstract.">
      <div className="marker">*</div>
    </Tooltip>
  );
}

function SidebarDescriptions({ descriptions }) {
  if (!descriptions || descriptions?.length === 0) {
    return null;
  }

  return (
    <Tooltip info={descriptions}>
      <div className="marker">!</div>
    </Tooltip>
  );
}

function SidebarLabels({ labels, handleMouseEnter, handleMouseLeave }) {
  if (!labels || labels?.length === 0) {
    return null;
  }

  return (
    <div className="marker" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      L
    </div>
  );
}

function NestedChoices({ parentAbstractChoiceRemove, parentUpdate, isFolded, nested, clean }) {
  if (isFolded || !nested || nested?.length === 0) {
    return null;
  }

  return (
    <div className="nested">
      {nested.map((e) => (
        <Choice
          structure={e}
          parentCancelView={clean}
          parentAbstractChoiceRemove={parentAbstractChoiceRemove}
          parentUpdate={parentUpdate}
          key={e.name}
        />
      ))}
    </div>
  );
}

function Options({
  show,
  handleAdd,
  handleRemove,
  handleDisable,
  isOnRightSidebar,
  isOnLeftSidebar,
}) {
  if (!show || isOnLeftSidebar || isOnRightSidebar) {
    return null;
  }

  return (
    <div className="options">
      <ViewOptions handler={handleAdd} className="left">
        A
      </ViewOptions>
      <ViewOptions handler={handleRemove} className="">
        R
      </ViewOptions>
      <ViewOptions handler={handleDisable} className="right">
        D
      </ViewOptions>
    </div>
  );
}

function ViewOptions({ children, handler, className }) {
  return (
    <div role="button" onClick={handler} className={`option ${className}`}>
      {children}
    </div>
  );
}

function Labels({ labels, isOnRightSidebar }) {
  return (
    <>
      {labels && isOnRightSidebar && (
        <ViewLabels>
          {labels.map((e) => (
            <Tooltip info={e}>
              <div>- {e}</div>
            </Tooltip>
          ))}
        </ViewLabels>
      )}
    </>
  );
}

function ViewLabels({ children }) {
  return <div className="labels">{children}</div>;
}
