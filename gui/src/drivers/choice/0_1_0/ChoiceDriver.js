import { faker } from "@faker-js/faker";
import Choice from "../../../components/choice/0_1_0/Choice";
import styles from "./ChoiceDriver.module.css";

const choiceSimple = {
  name: "name",
  value: faker.internet.userName(),
};

const choiceLongValue = {
  name: "long phrase",
  value: faker.hacker.phrase(),
};

const choiceLabels = {
  name: "labelled",
  value: faker.internet.userName(),
  meta: {
    labels: [faker.hacker.adjective(), faker.hacker.adjective()],
  },
};

const choiceRandom = {
  name: "randomized",
  value: faker.internet.userName(),
  meta: {
    randomized: true,
  },
};

const choiceDescription = {
  name: "described",
  value: faker.internet.userName(),
  meta: {
    descriptions: faker.hacker.phrase(),
  },
};

const choiceDisabled = {
  name: "disabled",
  value: faker.internet.userName(),
  meta: {
    disabled: true,
  },
};

const choiceMultiple = {
  name: "meta",
  value: faker.internet.userName(),
  meta: {
    randomized: true,
    descriptions: faker.hacker.phrase(),
    labels: [faker.hacker.adjective(), faker.hacker.adjective()],
  },
};

const choiceAbstract = {
  name: "parent",
  value: faker.string.uuid(),
  nested: [
    {
      name: "email A",
      value: faker.internet.email(),
    },
    {
      name: "email B",
      value: faker.internet.email(),
    },
    {
      name: "email C",
      value: faker.internet.email(),
    },
    {
      name: "child",
      value: faker.string.uuid(),
      nested: [
        {
          name: "address A",
          value: faker.location.streetAddress(),
          meta: {
            randomized: true,
          },
        },
      ],
    },
  ],
};

export default function ChoiceDriver() {
  return (
    <div className={styles.driver}>
      <h1>Choices</h1>
      <h2>Default</h2>
      <p>
        Click on the choice to expand/collapse it. Hover your mouse over the choice too see options:
        Add, Remove, Disable. They are fully functional so feel free to use them.
      </p>
      <p>
        Note, that you cannot remove the top component. At the moment it is not possible to change
        the data (it is only a GUI component). New choices are generated at random.
      </p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceSimple} />
      </div>
      <h2>Long</h2>
      <p>Hover your mouse over the name/value to see the full text.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceLongValue} />
      </div>
      <h2>Nested</h2>
      <p>You can add as many nesting levels as you want.</p>
      <p>
        Abstract choices have a specific icon on the left sidebar. Hover your mouse over it to see
        the description.
      </p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceAbstract} />
      </div>

      <h2>Meta: Labels</h2>
      <p>Hover your mouse over the right sidebar to see labels.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceLabels} />
      </div>
      <h2>Meta: Random</h2>
      <p>
        Random choices have a specific icon in the left sidebar. Hover your mouse over it to see the
        description.
      </p>
      <p>
        Note, that abstract parameters cannot be random (by definition they are just containers
        without a value).
      </p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceRandom} />
      </div>
      <h2>Meta: Description</h2>
      <p>
        Described choices have a specific icon in the left sidebar. Hover your mouse over it to see
        the description.
      </p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceDescription} />
      </div>
      <h2>Meta: Disabled</h2>
      <p>Disabled choices will not be used in the generation process.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceDisabled} />
      </div>
      <h2>Meta: Multiple</h2>
      <p>
        Left sidebar can work in two configurations, horizontal and vertical. Expand/Collapse the
        choice to see it.
      </p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceMultiple} />
      </div>
    </div>
  );
}
