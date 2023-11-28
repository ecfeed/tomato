import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import styles from "./MockParameter.module.scss";
import {
  choiceAdd,
  getChoice,
  getParameter,
  parameterAddAtPosition,
  parameterUpdate,
} from "./logic/driver";
import { Prompt } from "../../prompt/0_1_0/Prompt";

export function MockParameter({
  parameter = { name: "prototype" },
  parentMouseEvent,
  parentUpdate,
  parentAdd,
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
    <>
      <div
        className={`${styles.container} ${
          isFolded ? styles.container_folded : top ? styles.container_top : styles.container_nested
        }`}
        onMouseEnter={handleMouseParameterEnter}
        onMouseLeave={handleMouseParameterLeave}>
        {isOnParameter && !isOnParameterChild && !isSelected && !isLocked && !isFolded && (
          <AddOptionsLeft
            handleAppParameterParent={handleAddParameterParent}
            handleMouseOptionsLeftEnter={handleMouseOptionsLeftEnter}
            handleMouseOptionsLeftLeave={handleMouseOptionsLeftLeave}
            isOnOptionsRight={isOnOptionsLeft}
          />
        )}
        <div className={`${styles.parameter} ${isFolded ? styles.parameter_folded : ""}`}>
          <div
            className={`${styles.parameter_main} ${
              isSelected ? styles.parameter_negative : styles.parameter_default
            } ${top ? styles.parameter_top : styles.parameter_nested}`}>
            <div
              className={`${styles.parameter_header} ${
                isSelected ? styles.parameter_negative : styles.parameter_default
              } ${choices?.length > 0 || parameters?.length > 0 ? styles.underline : ""}`}
              onClick={handleMouseHeaderClick}>
              <Header name={name} />
            </div>
            {!isFolded && (
              <div className={styles.parameter_children}>
                <BodyParameters
                  parameters={parameters}
                  parentMouseEvent={handleMouseParameterChild}
                  parentUpdate={handleParameterUpdate}
                  parentAdd={handleAddParameterParentLogic}
                  isLocked={isLocked}
                  setIsLocked={setIsLocked}
                />
              </div>
            )}
            {!isFolded && !isStructure && (
              <div className={styles.parameter_choices}>
                <BodyChoices choices={choices} />
              </div>
            )}
          </div>
          {isOnParameter && !isOnParameterChild && !isSelected && !isLocked && !isFolded && (
            <AddOptionsBottom
              handleAddParameter={handleAddParameter}
              handleAddChoice={handleAddChoice}
              parameters={parameters}
              choices={choices}
            />
          )}
        </div>
      </div>
      {showAddChoice && (
        <div className={styles.prompt}>
          <Prompt
            header="Add nested choices"
            text="To exit, press 'cancel' or 'escape'."
            placeholder={handleAddChoicePlaceholder}
            handleCancel={handleAddChoiceCancel}
            handleConfirm={handleAddChoiceLogic}
          />
        </div>
      )}
      {showAddParameter && (
        <div className={styles.prompt}>
          <Prompt
            header="Add nested parameters"
            text="To exit, press 'cancel' or 'escape'."
            placeholder={handleAddParameterPlaceholder}
            handleCancel={handleAddParameterCancel}
            handleConfirm={handleAddParameterLogic}
          />
        </div>
      )}
      {showAddParameterParent && (
        <div className={styles.prompt}>
          <Prompt
            header="Add parent parameters"
            text="To exit, press 'cancel' or 'escape'."
            placeholder={handleAddParameterPlaceholder}
            handleCancel={handleAddParameterParentCancel}
            handleConfirm={handleAddParameterParentInitialLogic}
          />
        </div>
      )}
    </>
  );
}

function Header({ name }) {
  return <div>{name}</div>;
}

function BodyParameters({
  parameters,
  parentMouseEvent,
  parentUpdate,
  parentAdd,
  isLocked,
  setIsLocked,
}) {
  return (
    <div>
      {parameters.map((e, index) => (
        <MockParameter
          key={`${index} ${e.name}`}
          parameter={e}
          parentMouseEvent={parentMouseEvent}
          parentUpdate={parentUpdate}
          parentAdd={parentAdd}
          isLocked={isLocked}
          setIsLocked={setIsLocked}>
          {e}
        </MockParameter>
      ))}
    </div>
  );
}

function BodyChoices({ choices }) {
  return (
    <div>
      {choices.map((e, index) => (
        <div key={`${index} ${e.name}`} className={styles.choice}>
          {e.name}
        </div>
      ))}
    </div>
  );
}

function AddOptionsBottom({ parameters, choices, handleAddParameter, handleAddChoice }) {
  if (parameters?.length > 0 && choices?.length === 0) {
    return (
      <div className={styles.options_bottom}>
        <div className={styles.option_center} role="button" onClick={handleAddParameter}>
          + parameter
        </div>
      </div>
    );
  }

  if (parameters?.length === 0 && choices?.length > 0) {
    return (
      <div className={styles.options_bottom}>
        <div className={styles.option_center} role="button" onClick={handleAddChoice}>
          + choice
        </div>
      </div>
    );
  }

  if (parameters?.length === 0 && choices?.length === 0) {
    return (
      <div className={styles.options_bottom}>
        <div className={styles.option_left} role="button" onClick={handleAddParameter}>
          + param
        </div>
        <div className={styles.option_right} role="button" onClick={handleAddChoice}>
          + choice
        </div>
      </div>
    );
  }

  return null;
}

function AddOptionsLeft({
  handleAppParameterParent,
  isOnOptionsRight,
  handleMouseOptionsLeftEnter,
  handleMouseOptionsLeftLeave,
}) {
  if (!isOnOptionsRight) {
    return (
      <div
        className={styles.options_left_short}
        onMouseEnter={handleMouseOptionsLeftEnter}
        onMouseLeave={handleMouseOptionsLeftLeave}>
        !
      </div>
    );
  }

  return (
    <div
      className={styles.options_left_long}
      onClick={handleAppParameterParent}
      onMouseEnter={handleMouseOptionsLeftEnter}
      onMouseLeave={handleMouseOptionsLeftLeave}>
      Add
    </div>
  );
}
