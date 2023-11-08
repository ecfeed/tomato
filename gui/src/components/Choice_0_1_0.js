import { useEffect, useReducer } from "react";
import "./Choice_0_1_0.css";
import Tooltip from "./Tooltip_0_1_0";

function getSampleChoice() {
  return {
    name: crypto.randomUUID(4),
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

function reducer(state, action) {
  switch (action.type) {
    case "reload":
      return { ...state, structure: action.payload };
    case "toggleIsFolded":
      return { ...state, ui: { ...state.ui, isFolded: !state.ui.isFolded } };
    case "setIsControlled":
      return { ...state, ui: { ...state.ui, isControlled: action.payload } };
    case "mutateChoice":
      const name = action.payload.name;

      if (!name) {
        throw new Error("The name of the choice is undefined!");
      }

      const structure = state.structure;

      if (!structure.nested) {
        structure.nested = [action.payload];
      } else {
        if (structure.nested.filter(e => e.name === name).length > 0) {
          structure.nested = structure.nested.map(e => e.name === name ? action.payload : e);
        } else {
          structure.nested.push(action.payload);
        }
      }

      return { ...state, structure: structure };
    default:
      throw new Error("not working");
  }
}

export default function Choice({ structure, handleParentClean, handleParentUpdate }) {
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

  const handleOnClickAdd = () => {
    if (handleParentUpdate) {
    } else {
      dispatch({ type: "mutateChoice", payload: getSampleChoice() });
    }
  };

  const handleOnClickRemove = () => {
    alert("Removing the choice.");
  };

  const handleOnClickDisable = () => {
    alert("Disabling the choice");
  };

  const handleMouseEnter = () => {
    if (handleParentClean) {
      handleParentClean();
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
          isFolded={isFolded}
          show={isControlled}
          handleAdd={handleOnClickAdd}
          handleRemove={handleOnClickRemove}
          handleDisable={handleOnClickDisable}
        />
        <NestedChoices isFolded={isFolded} nested={nested} clean={handleCancelView} />
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
  return <div className={`folded ${isDisabled ? "disabled" : ""}`}>{name}</div>;
}

function ViewExtended({ isDisabled, name, value, labels }) {
  return (
    <table className="expanded">
      <ViewExtendedRow isDisabled={isDisabled} name="name">
        <Tooltip info={name}>{name}</Tooltip>
      </ViewExtendedRow>

      <ViewExtendedRow isDisabled={isDisabled} name="value">
        <Tooltip info={value}>{value}</Tooltip>
      </ViewExtendedRow>

      {labels && (
        <ViewExtendedRow isDisabled={isDisabled} name="name">
          {labels.map((e) => (
            <Tooltip info={e}>
              <div>- {e}</div>
            </Tooltip>
          ))}
        </ViewExtendedRow>
      )}
    </table>
  );
}

function ViewExtendedRow({ isDisabled, name, children }) {
  return (
    <tr>
      <td className="choice_key">{name}</td>
      <td className={`choice_value ${isDisabled ? "disabled" : ""}`}>{children}</td>
    </tr>
  );
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

function NestedChoices({ isFolded, nested, clean }) {
  if (isFolded || !nested || nested?.length === 0) {
    return null;
  }

  return (
    <div className="nested">
      {nested.map((e) => (
        <Choice structure={e} handleParentClean={clean} key={e.name} />
      ))}
    </div>
  );
}

function Options({ isFolded, show, handleAdd, handleRemove, handleDisable }) {
  if (!show || isFolded) {
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
