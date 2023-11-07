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

const choiceNameEqualsValue = {
  name: "Anna",
  value: "Anna",
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
    descriptions:
      ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat."],
  },
};

const choiceRandomDescription = {
  name: "labels",
  value: "John",
  meta: {
    randomized: true,
    disabled: true,
    descriptions:
      ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat. "],
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
      <h2>Nested</h2>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceAbstract} />
      </div>
      <h2>Simple</h2>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceSimple} />
      </div>
      <h2>Long value</h2>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceLongValue} />
      </div>
      <h2>Name equals value</h2>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceNameEqualsValue} />
      </div>
      <h2>Meta: Labels</h2>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceLabels} />
      </div>
      <h2>Meta: Random</h2>
      <div style={{ width: "250px" }}>
        <Choice structure={choiceRandom} />
      </div>
      <h2>Meta: Description</h2>
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
