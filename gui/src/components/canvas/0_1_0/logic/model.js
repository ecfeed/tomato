const separator = "\u2192";

export const createParameter = (name) => {
  return { name };
};

export const createChoice = (name) => {
  return { name };
};

//----------------------------------------------------------------------------------

export const update = (element, parentId) => {
  if (!parentId) {
    if (element.id) {
      parentId = getParentId(element.id);
    }
  }

  if (parentId) {
    element.id = `${parentId}${separator}${element.name}`;
  }

  if (element.parameters) {
    if (element.parameters.length > 0) {
      for (let i = 0; i < element.parameters.length; i++) {
        update(element.parameters[i], element.id ? element.id : "root");
      }
    }
  }

  if (element.choices) {
    if (element.choices.length > 0) {
      for (let i = 0; i < element.choices.length; i++) {
        update(element.choices[i], element.id ? element.id : "root");
      }
    }
  }

  return element;
};

//----------------------------------------------------------------------------------

const createDeepCopy = (reference) => {
  return JSON.parse(JSON.stringify(reference));
};

export const getParentId = (id) => {
  if (id === null || id === "root") {
    return "root";
  }

  const path = id.split(separator);

  if (path?.length > 1) {
    path.pop();
  }

  return path.join(separator);
};

export const getNameFromId = (id) => {
  if (id === null || id === "root") {
    return "root";
  }

  const path = id.split(separator);

  return path.pop();
};

export const getIndex = (model, id) => {
  const parentId = id ? getParentId(id) : "root";
  const parent = getElement(model, parentId);

  if (parent.parameters && parent?.parameters?.length > 0) {
    for (let i = 0; i < parent.parameters.length; i++) {
      if (id === parent.parameters[i].id) {
        return i;
      }
    }
  }

  if (parent.choices && parent?.choices?.length > 0) {
    for (let i = 0; i < parent.choices.length; i++) {
      if (id === parent.choices[i].id) {
        return i;
      }
    }
  }

  return null;
};

const getElement = (model, id) => {
  const path = id.split(separator);

  if (path?.length === 1) {
    return model;
  }

  let element = model;

  main: for (let i = 1; i < path.length; i++) {
    if (element.parameters) {
      for (let j = 0; j < element.parameters.length; j++) {
        if (element.parameters[j].name === path[i]) {
          element = element.parameters[j];
          continue main;
        }
      }
    }
    if (element.choices) {
      for (let j = 0; j < element.choices.length; j++) {
        if (element.choices && element.choices[path[i]]) {
          if (element.choices[j].name === path[i]) {
            element = element.choices[j];
            continue main;
          }
        }
      }
    }
  }

  if (element.id !== id) {
    throw new Error(`The element could not be found: ${id}!`);
  }
  
  return element;
};

//----------------------------------------------------------------------------------

export const addParameter = (root, id, parameter, index) => {
  if (!id) {
    throw new Error("The 'id' of the parent is undefined!");
  }

  if (!parameter.name) {
    throw new Error("The 'name' of the parameter is undefined!");
  }

  let results = createDeepCopy(root);
  let parent = getElement(results, id);

  if (!parent.parameters) {
    parent.parameters = [parameter];
  } else {
    if (index === null) {
      parent.parameters.push(parameter);
    } else if (Number(index) >= 0) {
      parent.parameters.splice(Number(index), 0, parameter);
    } else {
      parent.parameters.push(parameter);
    }
  }

  update(parameter, parent.id ? parent.id : "root");

  return results;
};

export const removeParameter = (root, id) => {
  if (!id) {
    throw new Error("The 'id' of the parameter is undefined!");
  }

  let results = createDeepCopy(root);
  const parentId = getParentId(id);
  let parent = getElement(results, parentId);

  if (!parent.parameters) {
    throw new Error("The selected parameter does not exist!");
  } else {
    for (let i = 0; i < parent.parameters.length; i++) {
      if (parent.parameters[i].id === id) {
        parent.parameters.splice(i, 1);
        return results;
      }
    }
  }

  throw new Error("The selected parameter could not be removed!");
};

export const renameParameter = (root, id, name) => {
  if (!id) {
    throw new Error("The 'id' of the parameter is undefined!");
  }

  if (!name) {
    throw new Error("The 'name' of the parameter is undefined!");
  }

  let results = createDeepCopy(root);
  let element = getElement(results, id);

  element.name = name;

  update(element);

  return results;
};

//----------------------------------------------------------------------------------

export const addChoice = (root, id, choice, index) => {
  console.log(index);
  if (!id) {
    throw new Error("The 'id' of the parent is undefined!");
  }

  if (!choice.name) {
    throw new Error("The 'name' of the choice is undefined!");
  }

  let results = createDeepCopy(root);
  let parent = getElement(results, id);

  if (!parent.choices) {
    parent.choices = [choice];
  } else {
    if (index === null) {
      parent.choices.push(choice);
    } else if (Number(index) >= 0) {
      parent.choices.splice(Number(index), 0, choice);
    } else {
      parent.choices.push(choice);
    }
  }

  update(choice, parent.id ? parent.id : "root");

  return results;
};

export const removeChoice = (root, id) => {
  if (!id) {
    throw new Error("The 'id' of the choice is undefined!");
  }

  let results = createDeepCopy(root);
  const parentId = getParentId(id);
  console.log(root, parentId);
  let parent = getElement(results, parentId);

  if (!parent.choices) {
    throw new Error("The selected choice does not exist!");
  } else {
    for (let i = 0; i < parent.choices.length; i++) {
      if (parent.choices[i].id === id) {
        parent.choices.splice(i, 1);
        return results;
      }
    }
  }

  throw new Error("The selected choice could not be removed!");
};

export const renameChoice = (root, id, name) => {
  if (!id) {
    throw new Error("The 'id' of the choice is undefined!");
  }

  if (!name) {
    throw new Error("The 'name' of the choice is undefined!");
  }

  let results = createDeepCopy(root);
  let element = getElement(results, id);

  element.name = name;

  update(element);

  return results;
};
