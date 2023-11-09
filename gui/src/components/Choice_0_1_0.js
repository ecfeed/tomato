import { useEffect, useReducer } from "react";
import "./Choice_0_1_0.css";
import Tooltip from "./Tooltip_0_1_0";

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

function reducer(state, action) {
  switch (action.type) {
    case "reload":
      return { ...state, structure: action.payload };
    case "toggleIsFolded":
      return { ...state, ui: { ...state.ui, isFolded: !state.ui.isFolded } };
    case "setIsFolded":
      return { ...state, ui: { ...state.ui, isFolded: action.payload } };
    case "setIsControlled":
      return { ...state, ui: { ...state.ui, isControlled: action.payload } };
    case "mutateChoice":
      const mutateName = action.payload.name;console.log('tera')

      if (!mutateName) {
        throw new Error("The name of the choice is undefined!");
      }

      const mutateStructure = state.structure;

      if (!mutateStructure.nested) {
        mutateStructure.nested = [action.payload];
      } else {
        if (mutateStructure.nested.filter((e) => e.name === mutateName).length > 0) {
          console.log('indeed')
          mutateStructure.nested = mutateStructure.nested.map((e) =>
            e.name === mutateName ? action.payload : e
          );
        } else {
          mutateStructure.nested.push(action.payload);
        }
      }

      return { ...state, ui: { ...state.ui, isFolded: false }, structure: mutateStructure };
    case "deleteChoice":
      const deleteName = action.payload.name;

      if (!deleteName) {
        throw new Error("The name of the choice is undefined!");
      }

      const deleteStructure = state.structure;

      if (!deleteStructure.nested) {
        throw new Error("The choice is not abstract!");
      } else {
        deleteStructure.nested = deleteStructure.nested.filter((e) => e.name !== deleteName);
      }

      return { ...state, structure: deleteStructure };
    case "toggleIsDisabled":
      const disabled = state.structure?.meta?.disabled;

      return {
        ...state,
        structure: { ...state.structure, meta: { ...state.structure.meta, disabled: !disabled } },
      };

    default:
      throw new Error("not working");
  }
}

export default function Choice({
  structure,
  handleParentClean,
  handleParentUpdate,
  dispatchParent,
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
  }, [structure])

  // useEffect(() => {
  //   if (dispatchParent && Object.keys(state.structure).length > 0) {
  //     dispatchParent({ type: "mutateChoice", payload: state.structure });
  //   }
  // }, [dispatchParent, state.structure, state.nested]);

  const handleOnClickFold = () => {
    dispatch({ type: "toggleIsFolded" });
  };

  const handleOnClickAdd = () => {
      dispatch({ type: "mutateChoice", payload: getSampleChoice() });
  };

  const handleOnClickRemove = () => {
    if (dispatchParent) {
      dispatchParent({ type: "deleteChoice", payload: state.structure });
    } else {
      alert("The top-level component cannot be removed!");
    }
  };

  const handleOnClickDisable = () => {console.log('A')
    dispatch({ type: "toggleIsDisabled" });
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
          show={isControlled}
          handleAdd={handleOnClickAdd}
          handleRemove={handleOnClickRemove}
          handleDisable={handleOnClickDisable}
        />
        <NestedChoices
          dispatch={dispatch}
          isFolded={isFolded}
          nested={nested}
          clean={handleCancelView}
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

function NestedChoices({ dispatch, isFolded, nested, clean }) {
  if (isFolded || !nested || nested?.length === 0) {
    return null;
  }

  return (
    <div className="nested">
      {nested.map((e) => (
        <Choice structure={e} handleParentClean={clean} dispatchParent={dispatch} key={e.name} />
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
