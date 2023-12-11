import { faker } from "@faker-js/faker";
import styles from "./Canvas.module.scss";
import { MockParameter } from "./MockParameter";
// import { Console } from "./Console";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { addParameter, createParameter, getIndex, update } from "./logic/model";
import { ButtonAdd } from "./ButtonAdd";
import { useState } from "react";

const data = {
  name: "root",
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
};

export function Canvas() {
  const [structure, setStructure] = useState(update(data));
  // const [text, setText] = useState();
  const [isLocked, setIsLocked] = useState(false);
  const [activeParameter, setActiveParameter] = useState(null);

  //---------------------------------------------------------------------

  const handleAddMainParameterLogic = (input, id) => {
    const index = getIndex(structure, id);
    const [candidate, parameter] = addParameter(structure, "root", createParameter(""), index);

    setStructure(candidate);
    setActiveParameter(parameter.id);
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

  // const handleExport = () => {
  //   setText(JSON.stringify(structure, null, 4));
  // };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.canvas}>
        <header className={styles.header}>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleLoad}>Load</button>
          <button onClick={handleReload}>Reload</button>
          {/* <button onClick={handleExport}>Export</button> */}
        </header>
        <ul className={styles.tips}>
          <li>To add a new parameter, hover the mouse pointer between two active parameters.</li>
          <li>To add a new parameter at the last position, click on the 'add' button.</li>
          <li>
            To add a new parameter at the first position, hover the mouse pointer before the first
            active parameter.
          </li>
          <li>To delete a parameter, remove its name and press 'enter'.</li>
          <li>To rename a parameter, click on its name.</li>
          <li>To cancel, press 'escape'.</li>
          <li>It is not possible to add a parameter if its name already exists.</li>
          <li>To store your model between sessions, use the 'save'/'load' buttons.</li>
        </ul>
        <div className={styles.main}>
          <div className={styles.parameters}>
            {structure.parameters.map((e, index) => (
              <div className={styles.parameter} key={`${index} ${e.name}`}>
                <MockParameter
                  activeParameter={activeParameter}
                  setActiveParameter={setActiveParameter}
                  root={structure}
                  setRoot={setStructure}
                  parameter={e}
                  isLocked={isLocked}
                  setIsLocked={setIsLocked}
                  top={true}
                />
              </div>
            ))}
          </div>
          <ButtonAdd handleAddMainParameter={handleAddMainParameterLogic} />
        </div>

        {/* <Console text={text} /> */}
      </div>
    </DndProvider>
  );
}
