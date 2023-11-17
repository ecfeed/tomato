import styles from "./Canvas.module.css";
import { MockParameter } from "./MockParameter";

const data = {
  parameters: [
    {
      name: "parameter 1",
      parameters: [
        {
          name: "parameter 11",
          choices: [
            {
              name: "choice 11",
              value: "value 11",
            },
          ],
        },
      ],
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
  return (
    <div className={styles.canvas}>
      {data.parameters.map((e, index) => (
        <div style={{ width: "300px" }}>
          <MockParameter key={`${index} ${e.name}`} parameter={e} />
        </div>
      ))}
    </div>
  );
}
