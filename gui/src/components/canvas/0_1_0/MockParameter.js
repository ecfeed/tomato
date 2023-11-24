import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import styles from "./MockParameter.module.css";
import { choiceAdd, getChoice, getParameter, parameterAdd, parameterUpdate } from "./logic/driver";
import { Prompt } from "../../prompt/0_1_0/Prompt";

export function MockParameter({
  parameter = { name: "prototype" },
  parentMouseEvent,
  parentUpdate,
}) {
  const [structure, setStructure] = useState({});
  const [isOnParameter, setIsOnParameter] = useState(false);
  const [isOnParameterChild, setIsOnParameterChild] = useState(false);
  const [isOnOptionsRight, setIsOnOptionsRight] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [showAddParameter, setShowAddParameter] = useState(false);

  const { name, parameters = [], choices = [] } = structure;
  const isStructure = parameters.length > 0;

  useEffect(() => {
    setStructure(parameter);
  }, [parameter]);

  const handleMouseParameterEnter = (e) => {
    e.preventDefault();
    setIsOnParameter(true);

    if (parentMouseEvent) {
      parentMouseEvent(true);
    }
  };

  const handleMouseParameterLeave = (e) => {
    e.preventDefault();
    setIsOnParameter(false);

    if (parentMouseEvent) {
      parentMouseEvent(false);
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

  const handleAddParameter = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setShowAddParameter(true);
  };

  const handleAddParameterLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = parameterAdd(structure, getParameter(input));

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddParameterCancel = () => {
    setShowAddParameter(false);
    setIsOnParameter(false);
    setIsOnParameterChild(false);
  };

  const handleAddParameterPlaceholder = () => {
    return faker.internet.domainWord();
  };

  const handleAddChoice = () => {
    setShowAddParameter(false);
    setIsOnParameter(false);
    setShowAddChoice(true);
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
  };

  const handleAddChoicePlaceholder = () => {
    return faker.internet.userName();
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseParameterEnter}
      onMouseLeave={handleMouseParameterLeave}>
      <div className={styles.parameter}>
        <div className={styles.main}>
          <Header name={name} />
          <BodyParameters
            parameters={parameters}
            parentMouseEvent={handleMouseParameterChild}
            parentUpdate={handleParameterUpdate}
          />
          {!isStructure && <BodyChoices choices={choices} />}
        </div>
        {isOnParameter && !isOnParameterChild && !showAddChoice && !showAddParameter && (
          <AddOptionsBottom
            handleAddParameter={handleAddParameter}
            handleAddChoice={handleAddChoice}
            parameters={parameters}
            choices={choices}
          />
        )}
        {showAddChoice && (
          <div className={styles.prompt}>
            <Prompt
              header="Add choices"
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
              header="Add parameters"
              text="To exit, press 'cancel' or 'escape'."
              placeholder={handleAddParameterPlaceholder}
              handleCancel={handleAddParameterCancel}
              handleConfirm={handleAddParameterLogic}
            />
          </div>
        )}
      </div>
      {isOnParameter && <AddOptionsRight />}
    </div>
  );
}

function Header({ name = "prototype" }) {
  return <div className={styles.header}>{name}</div>;
}

function BodyParameters({ parameters, parentMouseEvent, parentUpdate }) {
  return (
    <div className={styles.elements}>
      {parameters.map((e, index) => (
        <MockParameter
          key={`${index} ${e.name}`}
          parameter={e}
          parentMouseEvent={parentMouseEvent}
          parentUpdate={parentUpdate}>
          {e}
        </MockParameter>
      ))}
    </div>
  );
}

function BodyChoices({ choices }) {
  return (
    <div className={styles.choices}>
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
          + parameter
        </div>
        <div className={styles.option_right} role="button" onClick={handleAddChoice}>
          + choice
        </div>
      </div>
    );
  }

  return null;
}

function AddOptionsRight() {
  return <div className={styles.options_right}>!</div>;
}
