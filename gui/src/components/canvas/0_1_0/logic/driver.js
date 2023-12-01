export const getParameter = (name) => {
  return { name, parameters: [], choices: [] };
};

export const getChoice = (name) => {
  return { name };
};

export const parameterAdd = (reference, parameter) => {
  if (!parameter.name) {
    throw new Error("The name of the parameter is undefined!");
  }

  const structure = JSON.parse(JSON.stringify(reference));

  if (!structure.parameters) {
    structure.parameters = [parameter];
  } else {
    if (structure.parameters.filter((e) => e.name === parameter.name).length > 0) {
      throw new Error("A parameter with the specified name already exists!");
    } else {
      structure.parameters.push(parameter);
    }
  }

  return structure;
};

export const parameterRemove = (reference, name) => {
  if (!name) {
    throw new Error("The name of the parameter is undefined!");
  }

  if (!reference.parameters) {
    throw new Error("The parameter does not exist!");
  }

  const structure = JSON.parse(JSON.stringify(reference));

  structure.parameters = reference.parameters.filter((e) => e.name !== name);

  return structure;
};

export const parameterAddAtPosition = (reference, parameter, index) => {
  if (!parameter.name) {
    throw new Error("The name of the parameter is undefined!");
  }

  const structure = JSON.parse(JSON.stringify(reference));

  if (!structure.parameters) {
    structure.parameters = [parameter];
  } else {
    if (structure.parameters.filter((e) => e.name === parameter.name).length > 0) {
      throw new Error("A parameter with the specified name already exists!");
    } else {
      if (index) {
        const position = structure.parameters.map((e) => e.name).indexOf(index);
        structure.parameters.splice(position, 0, parameter);
      } else {
        structure.parameters.push(parameter);
      }
    }
  }

  return structure;
};

export const parameterUpdate = (reference, parameter) => {
  if (!parameter.name) {
    throw new Error("The name of the parameter is undefined!");
  }

  const structure = JSON.parse(JSON.stringify(reference));

  if (!structure.parameters) {
    throw new Error("The parameter does contain any structures!");
  } else {
    if (structure.parameters.filter((e) => e.name === parameter.name).length > 0) {
      structure.parameters = structure.parameters.map((e) =>
        e.name === parameter.name ? parameter : e
      );
    } else {
      throw new Error("A parameter with the specified name does not exist!");
    }
  }

  return structure;
};

export const choiceAdd = (reference, choice) => {
  if (!choice.name) {
    throw new Error("The name of the choice is undefined!");
  }

  const structure = JSON.parse(JSON.stringify(reference));

  if (!structure.choices) {
    structure.choices = [choice];
  } else {
    if (structure.choices.filter((e) => e.name === choice.name).length > 0) {
      throw new Error("A choice with the specified name already exists!");
    } else {
      structure.choices.push(choice);
    }
  }

  return structure;
};

export const choiceRemove = (reference, name) => {
  if (!name) {
    throw new Error("The name of the choice is undefined!");
  }

  if (!reference.choices) {
    throw new Error("The choice does not exist!");
  }

  const structure = JSON.parse(JSON.stringify(reference));

  structure.choices = reference.choices.filter((e) => e.name !== name);

  return structure;
}
