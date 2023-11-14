import { v4 } from "uuid";

export const getSampleChoice = () => {
  return {
    name: v4(),
    value: v4(),
  };
};

export const abstractChoiceAdd = (reference, choice) => {
  if (!choice.name) {
    throw new Error("The name of the choice is undefined!");
  }

  const structure = { ...reference };

  if (!structure.nested) {
    structure.nested = [choice];
  } else {
    if (structure.nested.filter((e) => e.name === choice.name).length > 0) {
      throw new Error("A choice with the specified name already exists!");
    } else {
      structure.nested.push(choice);
    }
  }

  return structure;
};

export const abstractChoiceDelete = (reference, choice) => {
  if (!choice.name) {
    throw new Error("The name of the choice is undefined!");
  }

  const structure = { ...reference };

  if (!structure.nested) {
    throw new Error("The choice is not abstract!");
  } else {
    structure.nested = structure.nested.filter((e) => e.name !== choice.name);
  }

  return structure;
};

export const abstractChoiceUpdate = (reference, choice) => {
  if (!choice.name) {
    throw new Error("The name of the choice is undefined!");
  }

  const structure = { ...reference };

  if (!structure.nested) {
    throw new Error("The choice is not abstract!");
  } else {
    if (structure.nested.filter((e) => e.name === choice.name).length > 0) {
      structure.nested = structure.nested.map((e) => (e.name === choice.name ? choice : e));
    } else {
      throw new Error("A choice with the specified name does not exist!");
    }
  }

  return structure;
};

export const toggleDisabled = (choice) => {
  return { ...choice, meta: { ...choice.meta, disabled: !choice.meta?.disabled } };
};
