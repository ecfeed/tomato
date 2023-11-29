import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {
  choiceAdd,
  getChoice,
  getParameter,
  parameterAddAtPosition,
  parameterUpdate,
} from "./logic/driver";
import { OptionsLeft } from "./OptionsLeft";
import { OptionsBottom } from "./OptionsBottom";
import { PromptAddParentParameter } from "./PromptAddParentParameter";
import { PromptAddNestedChoices } from "./PromptAddNestedChoices";
import { PromptAddNestedParameters } from "./PromptAddNestedParameters";
import { BodyChoices } from "./BodyChoices";
import { BodyParameters } from "./BodyParameters";
import { Header } from "./Header";
import { Main } from "./Main";
import { Container } from "./Container";
import { Parameter } from "./Parameter";

export function MockParameter({
  parameter = { name: "prototype" },
  parentMouseEvent,
  parentUpdate,
  parentAdd,
  isLocked,
  setIsLocked,
  top,
}) {
  const [structure, setStructure] = useState({});
  const [isOnParameter, setIsOnParameter] = useState(false);
  const [isOnParameterChild, setIsOnParameterChild] = useState(false);
  const [isOnOptionsLeft, setIsOnOptionsLeft] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [showAddParameter, setShowAddParameter] = useState(false);
  const [showAddParameterParent, setShowAddParameterParent] = useState(false);
  const [isFolded, setIsFolded] = useState(false);

  const { name, parameters = [], choices = [] } = structure;
  const isStructure = parameters.length > 0;

  const isSelected = showAddChoice || showAddParameter || showAddParameterParent;

  useEffect(() => {
    setStructure(parameter);
  }, [parameter]);

  const handleMouseParameterEnter = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    setIsOnParameter(true);

    if (parentMouseEvent) {
      parentMouseEvent(true);
    }
  };

  const handleMouseParameterLeave = (e) => {
    e.preventDefault();

    if (isLocked) {
      return;
    }

    setIsOnParameter(false);
    setIsOnParameterChild(false);

    if (parentMouseEvent) {
      parentMouseEvent(false);
    }
  };

  const handleMouseHeaderClick = (e) => {
    e.preventDefault();

    if (top) {
      setIsFolded((e) => !e);
    }
  };

  const handleMouseOptionsLeftEnter = (e) => {
    e.preventDefault();
    setIsOnOptionsLeft(true);
  };

  const handleMouseOptionsLeftLeave = (e) => {
    e.preventDefault();
    setIsOnOptionsLeft(false);
  };

  const handleMouseParameterChild = (value) => {
    setIsOnParameterChild(value);
  };

  const handleParameterUpdate = (parameter) => {
    const candidate = parameterUpdate(structure, parameter);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddParameter = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setShowAddParameter(true);

    setIsLocked(true);
  };

  const handleAddParameterParent = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setShowAddParameterParent(true);

    setIsLocked(true);
  };

  const handleAddParameterLogic = (input, index) => {
    if (!input) {
      return;
    }

    const candidate = parameterAddAtPosition(structure, getParameter(input), index);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddParameterParentLogic = (input, index) => {
    const candidate = parameterAddAtPosition(structure, getParameter(input), index);

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddParameterParentInitialLogic = (input) => {
    if (!input) {
      return;
    }

    if (parentAdd) {
      parentAdd(input, name);
    }

    setShowAddParameterParent(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddParameterCancel = () => {
    setShowAddParameter(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddParameterParentCancel = () => {
    setShowAddParameterParent(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddParameterPlaceholder = () => {
    return faker.internet.domainWord();
  };

  const handleAddChoice = () => {
    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);
    setShowAddParameter(false);

    setShowAddChoice(true);

    setIsLocked(true);
  };

  const handleAddChoiceLogic = (input) => {
    if (!input) {
      return;
    }

    const candidate = choiceAdd(structure, getChoice(input));

    if (parentUpdate) {
      parentUpdate(candidate);
    } else {
      setStructure(candidate);
    }
  };

  const handleAddChoiceCancel = () => {
    setShowAddChoice(false);

    setIsOnParameter(false);
    setIsOnParameterChild(false);
    setIsOnOptionsLeft(false);

    setIsLocked(false);
  };

  const handleAddChoicePlaceholder = () => {
    return faker.internet.userName();
  };

  return (
    <>
      <Container
        isFolded={isFolded}
        top={top}
        handleMouseParameterEnter={handleMouseParameterEnter}
        handleMouseParameterLeave={handleMouseParameterLeave}>
        <OptionsLeft
          handleAppParameterParent={handleAddParameterParent}
          handleMouseOptionsLeftEnter={handleMouseOptionsLeftEnter}
          handleMouseOptionsLeftLeave={handleMouseOptionsLeftLeave}
          isOnOptionsRight={isOnOptionsLeft}
          isOnParameter={isOnParameter}
          isOnParameterChild={isOnParameterChild}
          isSelected={isSelected}
          isLocked={isLocked}
          isFolded={isFolded}
        />
        <Parameter isFolded={isFolded}>
          <Main isSelected={isSelected} top={top}>
            <Header
              name={name}
              isSelected={isSelected}
              choices={choices}
              parameters={parameters}
              handleMouseHeaderClick={handleMouseHeaderClick}
            />
            <BodyParameters
              isFolded={isFolded}
              parameters={parameters}
              parentMouseEvent={handleMouseParameterChild}
              parentUpdate={handleParameterUpdate}
              parentAdd={handleAddParameterParentLogic}
              isLocked={isLocked}
              setIsLocked={setIsLocked}
            />
            <BodyChoices choices={choices} isFolded={isFolded} isStructure={isStructure} />
          </Main>
          <OptionsBottom
            isOnParameter={isOnParameter}
            isOnParameterChild={isOnParameterChild}
            isSelected={isSelected}
            isLocked={isLocked}
            isFolded={isFolded}
            handleAddParameter={handleAddParameter}
            handleAddChoice={handleAddChoice}
            parameters={parameters}
            choices={choices}
          />
        </Parameter>
      </Container>
      <PromptAddNestedChoices
        showAddChoice={showAddChoice}
        handleAddChoicePlaceholder={handleAddChoicePlaceholder}
        handleAddChoiceCancel={handleAddChoiceCancel}
        handleAddChoiceLogic={handleAddChoiceLogic}
      />
      <PromptAddNestedParameters
        showAddParameter={showAddParameter}
        handleAddParameterPlaceholder={handleAddParameterPlaceholder}
        handleAddParameterCancel={handleAddParameterCancel}
        handleAddParameterLogic={handleAddParameterLogic}
      />
      <PromptAddParentParameter
        showAddParameterParent={showAddParameterParent}
        handleAddParameterPlaceholder={handleAddParameterPlaceholder}
        handleAddParameterParentCancel={handleAddParameterParentCancel}
        handleAddParameterParentInitialLogic={handleAddParameterParentInitialLogic}
      />
    </>
  );
}
