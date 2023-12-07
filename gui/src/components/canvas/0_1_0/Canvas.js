import { useState } from "react";
import { faker } from "@faker-js/faker";
import styles from "./Canvas.module.scss";
import { MockParameter } from "./MockParameter";
import { PromptAddMainParameters } from "./PromptAddMainParameters";
import { Console } from "./Console";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { addParameter, createParameter, getIndex, update } from "./logic/model";

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
  const [text, setText] = useState();
  const [isLocked, setIsLocked] = useState(false);
  const [showAddMainParameter, setShowAddMainParameter] = useState(false);

  //---------------------------------------------------------------------

  const handleAddMainParameter = (e) => {
    e.preventDefault();

    setShowAddMainParameter(true);
    setIsLocked(true);
  };

  const handleAddParameter = (input, id) => {
    const index = getIndex(structure, id);
    const candidate = addParameter(structure, "root", createParameter(input), index);

    setStructure(candidate);

    setShowAddMainParameter(false);
    setIsLocked(false);
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
    setText(JSON.stringify(structure, null, 4));
  };

  const handleAddMainParameterPlaceholder = () => {
    return faker.internet.userName();
  };

  const handleAddMainParameterCancel = () => {
    setShowAddMainParameter(false);
    setIsLocked(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
          <li>
            You can store your model between sessions, to do it use the 'save'/'load' buttons.
          </li>
        </ul>
        <div className={styles.main}>
          {structure.parameters.map((e, index) => (
            <div className={styles.parameter} key={`${index} ${e.name}`}>
              <MockParameter
                root={structure}
                setRoot={setStructure}
                parameter={e}
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
    </DndProvider>
  );
}
