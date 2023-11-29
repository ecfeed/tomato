import { useState } from "react";
import styles from "./Canvas.module.scss";
import { MockParameter } from "./MockParameter";
import { getParameter, parameterAddAtPosition, parameterUpdate } from "./logic/driver";

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
  const [isLocked, setIsLocked] = useState(false);

  const handleParameterUpdate = (parameter) => {
    const candidate = parameterUpdate(structure, parameter);
    setStructure(candidate);
  };

  const handleAddParameter = (input, index) => {
    const candidate = parameterAddAtPosition(structure, getParameter(input), index);
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

  return (
    <div className={styles.canvas}>
      <header className={styles.header}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
      </header>
      <p className={styles.text}>To fold the top-level parameter click on the header.</p>
      <p className={styles.text}>To add a parameter hover the mouse pointer over one of the parameters.</p>
      <div className={styles.main}>
        {structure.parameters.map((e, index) => (
          <div className={styles.parameter} key={`${index} ${e.name}`}>
            <MockParameter
              parameter={e}
              parentUpdate={handleParameterUpdate}
              parentAdd={handleAddParameter}
              isLocked={isLocked}
              setIsLocked={setIsLocked}
              top={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
