import { useState } from "react";
import styles from "./MockParameter.module.css";
import { useEffect } from "react";

export function MockParameter({ parameter = { name: "prototype" } }) {
  const [structure, setStructure] = useState({});

  useEffect(() => {
    setStructure(parameter);
  }, [parameter]);

  const { name, parameters = [], choices = [] } = structure;

  return (
    <div className={styles.parameter}>
      <Header name={name} />
      <BodyParameters parameters={parameters} />
      <BodyChoices choices={choices} />
      <OptionsBottom />
    </div>
  );
}

function Header({ name = "prototype" }) {
  return <div className={styles.header}>{name}</div>;
}

function BodyParameters({ parameters }) {
  return (
    <div className={styles.elements}>
      {parameters.map((e, index) => (
        <MockParameter key={`${index} ${e.name}`} parameter={e}>
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

function OptionsBottom() {
  return (
    <div className={styles.bottom}>
      <div>choice</div>
      <div>parameter</div>
    </div>
  )
}
