import { useState } from "react";
import styles from "./Canvas.module.css";
import { MockParameter } from "./MockParameter";
import { parameterUpdate } from "./logic/driver";

const data = {
  name: 'canvas',
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
  
  const handleParameterUpdate = (parameter) => {
    const candidate = parameterUpdate(structure, parameter);
    setStructure(candidate);
  };

  const handleAddParameter = () => {
    
  };

  const handleSave = () => {
    localStorage.setItem("canvas", JSON.stringify(structure));
  }

  const handleLoad = () => {
    const data = localStorage.getItem("canvas");

    if (!data) {
      return;
    }

    setStructure(JSON.parse(data));
  }

  return (
    <div className={styles.canvas}>
      <header className={styles.header}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
      </header>
      <div className={styles.main}>
        {structure.parameters.map((e, index) => (
          <div className={styles.parameter} key={`${index} ${e.name}`}>
            <MockParameter parameter={e} parentUpdate={handleParameterUpdate}/>
          </div>
        ))}
      </div>
    </div>
  );
}
