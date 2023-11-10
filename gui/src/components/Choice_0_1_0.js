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
  const { isFolded, isControlled } = state.ui;

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

  const handleAbstractChoiceRemove = (choice) => {
    let candidate = choice ? abstractChoiceDelete(state.structure, choice) : state.structure;

    if (parentUpdate) {
      if (choice === null) {
        parentAbstractChoiceRemove(candidate);
      } else {
        parentUpdate(candidate);
      }
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

  const handleMouseEnter = () => {
    if (parentCancelView) {
      parentCancelView();
    }

    dispatch({ type: "setIsControlled", payload: true });
  };

  const handleMouseLeave = () => {
    dispatch({ type: "setIsControlled", payload: false });
  };

  const handleCancelView = () => {
    dispatch({ type: "setIsControlled", payload: false });
  };

  return (
    <div className="choice" onMouseLeave={handleMouseLeave}>
      <div className="main" onMouseOver={handleMouseEnter} onClick={handleOnClickFold}>
        <Sidebar
          isFolded={isFolded}
          isRandom={isRandomized}
          isAbstract={isAbstract}
          isDisabled={isDisabled}
          descriptions={descriptions}
        />
        <View
          isFolded={isFolded}
          isAbstract={isAbstract}
          isDisabled={isDisabled}
          name={name}
          value={value}
          labels={labels}
        />
      </div>
      <div className="">
        <Options
          show={isControlled}
          handleAdd={handleAbstractChoiceAdd}
          handleDisable={handleOnClickDisable}
          handleRemove={() => handleAbstractChoiceRemove(null)}
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

function View({ isDisabled, isFolded, isAbstract, name, value, labels }) {
  if (isFolded || isAbstract) {
    return <ViewSimple isDisabled={isDisabled} name={name} />;
  }

  return <ViewExtended isDisabled={isDisabled} name={name} value={value} labels={labels} />;
}

function ViewSimple({ isDisabled, name }) {
  return (
    <div className={`folded ${isDisabled ? "disabled" : ""}`}>
      <Tooltip info={name}>{name}</Tooltip>
    </div>
  );
}

function ViewExtended({ isDisabled, name, value, labels }) {
  return (
    <div className="expanded">
      <ViewExtendedName isDisabled={isDisabled}>
        <Tooltip info={name}>{name}</Tooltip>
      </ViewExtendedName>

      <ViewExtendedValue>
        <Tooltip info={value}>{value}</Tooltip>
      </ViewExtendedValue>

      {labels && (
        <ViewExtendedLabels>
          {labels.map((e) => (
            <Tooltip info={e}>
              <div>- {e}</div>
            </Tooltip>
          ))}
        </ViewExtendedLabels>
      )}
    </div>
  );
}

function ViewExtendedName({ isDisabled, children }) {
  return <div className={`choice_name ${isDisabled ? "disabled" : ""}`}>{children}</div>;
}

function ViewExtendedValue({ children }) {
  return <div className="choice_value">{children}</div>;
}

function ViewExtendedLabels({ children }) {
  return <div className="choice_labels">{children}</div>;
}

function Sidebar({ isFolded, isRandom, isAbstract, descriptions }) {
  if (!(isAbstract || isRandom || descriptions || descriptions?.length === 0)) {
    return null;
  }

  return (
    <div className={`markers markers_${isFolded ? "horizontal" : "vertical"}`}>
      <SidebarRandomized isRandom={isRandom} isAbstract={isAbstract} />
      <SidebarAbstract isAbstract={isAbstract} />
      <SidebarDescriptions descriptions={descriptions} />
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

function NestedChoices({
  parentAbstractChoiceRemove,
  parentUpdate,
  isFolded,
  nested,
  clean,
}) {
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

function Options({ show, handleAdd, handleRemove, handleDisable }) {
  if (!show) {
    return null;
  }

  return (
    <div className="options">
      <div role="button" onClick={handleAdd} className="option left">
        A
      </div>
      <div role="button" onClick={handleRemove} className="option">
        R
      </div>
      <div role="button" onClick={handleDisable} className="option right">
        D
      </div>
    </div>
  );
}
