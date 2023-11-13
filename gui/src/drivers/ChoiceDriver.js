import Choice from "../components/choice/0_1_0/Choice";

const choiceSimple = {
  name: "default",
  value: "John",
};

const choiceLongValue = {
  name: "long value",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat. ",
};

const choiceLabels = {
  name: "labelled",
  value: "John",
  meta: {
    labels: ["label A", "label B"],
  },
};

const choiceRandom = {
  name: "randomized",
  value: "John",
  meta: {
    randomized: true,
  },
};

const choiceDescription = {
  name: "described",
  value: "John",
  meta: {
    descriptions: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat.",
    ],
  },
};

const choiceDisabled = {
  name: "disabled",
  value: "John",
  meta: {
    disabled: true,
  },
};

const choiceMultiple = {
  name: "meta",
  value: "John",
  meta: {
    randomized: true,
    descriptions: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat. ",
    ],
    labels: ["label A", "label B"],
  },
};

const choiceAbstract = {
  name: "abstract",
  value: "John",
  nested: [
    {
      name: "choice A",
      value: "Marek",
    },
    {
      name: "choice B",
      value: "Patryk",
    },
    {
      name: "choice C",
      value: "Krzysztof",
    },
    {
      name: "other",
      value: "abstract",
      nested: [
        {
          name: "other A",
          value: "Hager",
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
    <>
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
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}
