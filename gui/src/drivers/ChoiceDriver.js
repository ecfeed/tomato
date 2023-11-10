import Choice from "../components/Choice_0_1_0";

const choiceSimple = {
  name: "short",
  value: "John",
};

const choiceLongValue = {
  name: "long",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat. ",
};

const choiceLabels = {
  name: "labels",
  value: "John",
  meta: {
    labels: ["label A", "label B"],
  },
};

const choiceRandom = {
  name: "labels",
  value: "John",
  meta: {
    randomized: true,
  },
};

const choiceDescription = {
  name: "labels",
  value: "John",
  meta: {
    descriptions: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat.",
    ],
  },
};

const choiceRandomDescription = {
  name: "labels",
  value: "John",
  meta: {
    randomized: true,
    disabled: true,
    descriptions: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat. ",
    ],
  },
};

const choiceAbstract = {
  name: "short",
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
      <h2>Simple</h2>
      <p>Click on the choice to expand/collapse it</p>
      <p>Hover your mouse over the choice too see options: A - Add, R - Remove, D - Disable.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceSimple} />
      </div>
      <h2>Long value</h2>
      <p>Hover your mouse over the name/value to see the full text.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceLongValue} />
      </div>

      <h2>Nested</h2>
      <p>You can add as many nesting levels as you want.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceAbstract} />
      </div>

      <h2>Meta: Labels</h2>
      <p>Hover your mouse over the right sidebar to see labels.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceLabels} />
      </div>
      <h2>Meta: Random</h2>
      <p>Random choices have a specific icon in the left sidebar.</p>
      <p> Hover your mouse over it to see the description.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceRandom} />
      </div>
      <h2>Meta: Description</h2>
      <p>Described choices have a specific icon in the left sidebar.</p>
      <p> Hover your mouse over it to see the description.</p>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceDescription} />
      </div>
      <h2>Meta: Random / Description</h2>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceRandomDescription} />
      </div>
    </>
  );
}
