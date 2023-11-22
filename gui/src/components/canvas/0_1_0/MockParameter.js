import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import styles from "./MockParameter.module.css";
import { choiceAdd, getChoice, getParameter, parameterAdd, parameterUpdate } from "./logic/driver";

export function MockParameter({
  parameter = { name: "prototype" },
  parentMouseEvent,
  parentUpdate,
}) {
  const [structure, setStructure] = useState({});
  const [isOnParameter, setIsOnParameter] = useState(false);
  const [isOnParameterChild, setIsOnParameterChild] = useState(false);

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
    console.log('dupa')
    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddParameter = () => {
    let candidate = structure;
    let name = "";

    name = prompt(
      "Enter the parameter name.\nTo exit, click on 'cancel' or press 'esc'.",
      faker.person.firstName()
    );

    if (!name) {
      return;
    }

    candidate = parameterAdd(candidate, getParameter(name));

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddChoice = () => {
    let candidate = structure;
    let name = "";

    name = prompt(
      "Enter the choice name.\nTo exit, click on 'cancel' or press 'esc'.",
      faker.person.firstName()
    );

    if (!name) {
      return;
    }

    candidate = choiceAdd(candidate, getChoice(name));

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  return (
    <div
      className={styles.parameter}
      onMouseEnter={handleMouseParameterEnter}
      onMouseLeave={handleMouseParameterLeave}>
      <div className={styles.main}>
        <Header name={name} />
        <BodyParameters
          parameters={parameters}
          parentMouseEvent={handleMouseParameterChild}
          parentUpdate={handleParameterUpdate}
        />
        {!isStructure && <BodyChoices choices={choices} />}
      </div>
      {isOnParameter && !isOnParameterChild && (
        <AddOptionsBottom
          handleAddParameter={handleAddParameter}
          handleAddChoice={handleAddChoice}
          parameters={parameters}
          choices={choices}
        />
      )}
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
