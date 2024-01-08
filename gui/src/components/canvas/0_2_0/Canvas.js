import styles from "./Canvas.module.scss";
import { ParameterStructure } from "./ParameterStructure";
import { Console } from "./Console";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  addParameter,
  createParameter,
  moveParameter,
  removeParameter,
  setRoot,
  update,
} from "./logic/model";
import { ButtonDefault } from "./ButtonDefault";
import { useEffect, useState } from "react";
import { ItemTypes } from "./abstract/ItemTypes";

const data = {
  name: "root",
  parameters: [],
};

export function Canvas() {
  const [structure, setStructure] = useState(update(data));
  const [text, setText] = useState();
  const [isLocked, setIsLocked] = useState(false);
  const [activeParameter, setActiveParameter] = useState(null);

  useEffect(() => {
    setRoot(structure);
  }, [structure]);

  //---------------------------------------------------------------------

  const handleAddMainParameterLogic = (input, id) => {
    const candidate = addParameter("root", createParameter(""), null);

    setIsLocked(true);
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
    setText(JSON.stringify(structure, null, 4));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.canvas}>
        {/* <header className={styles.header}>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleLoad}>Load</button>
          <button onClick={handleReload}>Reload</button>
          <button onClick={handleExport}>Export</button>
        </header> */}
        {/* <ul className={styles.tips}>
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
        </ul> */}
        <div className={styles.main}>
          <div className={styles.elements}>
            {structure.parameters.map((e) => (
              <div className={styles.parameter} key={e.id}>
                <ParameterStructure
                  parameter={e}
                  activeParameter={activeParameter}
                  setActiveParameter={setActiveParameter}
                  root={structure}
                  setRoot={setStructure}
                  isLocked={isLocked}
                  setIsLocked={setIsLocked}
                />
              </div>
            ))}
            <ElementPanel setActiveParameter={setActiveParameter} setStructure={setStructure} />
            <ElementButton handleAddMainParameterLogic={handleAddMainParameterLogic} />
          </div>
          <ElementThrash setActiveParameter={setActiveParameter} setStructure={setStructure} />
        </div>

        {/* <Console text={text} /> */}
      </div>
    </DndProvider>
  );
}

const ElementPanel = ({ setActiveParameter, setStructure }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PARAMETER,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item) {
      const candidate = moveParameter(item.id);
      setActiveParameter(null);
      setStructure(candidate);
    },
  }));

  return <div ref={drop} className={styles["panel"]} />;
};

const ElementButton = ({ handleAddMainParameterLogic }) => {
  return (
    <div className={styles["button"]}>
      <ButtonDefault handler={handleAddMainParameterLogic} text="add\nparameter" />
    </div>
  );
};

const ElementThrash = ({ setActiveParameter, setStructure }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PARAMETER,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item) {
      const candidate = removeParameter(item.id);
      setActiveParameter(null);
      setStructure(candidate);
    },
  }));

  return (
    <div ref={drop} className={styles["thrash"]} enabled={"false"}>
      &#128465;
    </div>
  );
};
