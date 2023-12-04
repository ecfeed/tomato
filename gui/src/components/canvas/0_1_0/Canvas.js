import { useState } from "react";
import { faker } from "@faker-js/faker";
import styles from "./Canvas.module.scss";
import { MockParameter } from "./MockParameter";
import {
  getParameter,
  parameterAddAtPosition,
  parameterRemove,
  parameterRename,
  parameterUpdate,
} from "./logic/driver";
import { PromptAddMainParameters } from "./PromptAddMainParameters";
import { Console } from "./Console";

const data = {
  name: "canvas",
  parameters: [
    {
      name: "parameter 1",
      parameters: [
        {
          name: "parameter 11",
          choices: [
            {
              name: "choice 1a",
              value: "value 1a",
            },
            {
              name: "choice 1b",
              value: "value 1b",
            },
          ],
        },
        {
          name: "parameter 12",
        },
      ],
    },
    {
      name: "parameter 2",
      choices: [
        {
          name: "choice 2a",
          value: "value 2a",
        },
        {
          name: "choice 2b",
          value: "value 2b",
        },
      ],
    },
  ],
  choices: [
    {
      name: "choice A",
      value: "value A",
    },
    {
      name: "choice B",
      value: "value B",
    },
  ],
};

export function Canvas() {
  const [structure, setStructure] = useState(data);
  const [text, setText] = useState();
  const [isLocked, setIsLocked] = useState(false);
  const [showAddMainParameter, setShowAddMainParameter] = useState(false);

  const handleParameterUpdate = (parameter) => {
    const candidate = parameterUpdate(structure, parameter);
    setStructure(candidate);
  };

  const handleAddParameter = (input, index) => {
    const candidate = parameterAddAtPosition(structure, getParameter(input), index);
    setStructure(candidate);

    setShowAddMainParameter(false);
    setIsLocked(false);
  };

  const handleRemoveParameter = (input) => {
    const candidate = parameterRemove(structure, input);
    setStructure(candidate);
  };

  const handleRenameParameter = (name, input) => {
    const candidate = parameterRename(structure, name, input);
    setStructure(candidate);
  };

  const handleSave = () => {
    localStorage.setItem("canvas", JSON.stringify(structure));
  };

  const handleLoad = () => {
    const data = localStorage.getItem("canvas");

    if (!data) {
      return;
    }

    setStructure(JSON.parse(data));
  };

  const handleReload = () => {
    setStructure(data);
  };

  const handleExport = () => {
    console.log(JSON.stringify(structure, null, 4))
    setText(JSON.stringify(structure, null, 4));
  };

  const handleAddMainParameter = (e) => {
    e.preventDefault();

    setShowAddMainParameter(true);
    setIsLocked(true);
  };

  const handleAddMainParameterPlaceholder = () => {
    return faker.internet.userName();
  };

  const handleAddMainParameterCancel = () => {
    setShowAddMainParameter(false);
    setIsLocked(false);
  };

  return (
    <div className={styles.canvas}>
      <header className={styles.header}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
        <button onClick={handleReload}>Reload</button>
        <button onClick={handleExport}>Export</button>
      </header>
      <ul className={styles.tips}>
        <li>To fold the top-level parameter click on the header.</li>
        <li>
          To see additional parameter/choice options hover the mouse pointer over it and click on
          the menu.
        </li>
        <li>You can store your model between sessions, to do it use the 'save'/'load' buttons.</li>
      </ul>
      <div className={styles.main}>
        {structure.parameters.map((e, index) => (
          <div className={styles.parameter} key={`${index} ${e.name}`}>
            <MockParameter
              parameter={e}
              parentUpdate={handleParameterUpdate}
              parentAdd={handleAddParameter}
              parentRemove={handleRemoveParameter}
              parentRename={handleRenameParameter}
              isLocked={isLocked}
              setIsLocked={setIsLocked}
              top={true}
            />
          </div>
        ))}
        <button className={styles["button--next"]} onClick={handleAddMainParameter}>
          add
        </button>
        <PromptAddMainParameters
          showAddMainParameter={showAddMainParameter}
          handleAddParameterPlaceholder={handleAddMainParameterPlaceholder}
          handleAddParameterCancel={handleAddMainParameterCancel}
          handleAddParameterLogic={handleAddParameter}
        />
      </div>
      
      <Console text={text} />
    </div>
  );
}
