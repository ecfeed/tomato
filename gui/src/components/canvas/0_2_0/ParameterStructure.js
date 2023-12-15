import { ParameterOptions } from "./ParameterOptions";
import { PromptAddNestedChoices } from "./PromptAddNestedChoices";
import { PromptAddNestedParameters } from "./PromptAddNestedParameters";
import { ChildrenChoices } from "./ChildrenChoices";
import { ChildrenParameters } from "./ChildrenParameters";
import { ParameterHeader } from "./ParameterHeader";
import { ParameterMain } from "./ParameterMain";
import { ParameterContainer } from "./ParameterContainer";
import { Parameter } from "./Parameter";
import { ParameterProvider } from "./context/ParameterContext";
import { PromptRenameChoice } from "./PromptRenameChoice";
import { ParameterPanel } from "./ParameterPanel";

export function ParameterStructure({
  activeParameter,
  setActiveParameter,
  root,
  setRoot,
  parameter,
  parentMouseEvent,
  isLocked,
  setIsLocked,
  top,
}) {
  return (
    <ParameterProvider
      activeParameter={activeParameter}
      setActiveParameter={setActiveParameter}
      root={root}
      setRoot={setRoot}
      isLocked={isLocked}
      setIsLocked={setIsLocked}
      parameter={parameter}
      parentMouseEvent={parentMouseEvent}
      top={top}>
      <ParameterContainer>
        <ParameterPanel />
        <Parameter>
          <ParameterMain>
            <ParameterHeader />
            <ChildrenParameters />
            <ChildrenChoices />
          </ParameterMain>
          <ParameterOptions />
        </Parameter>
      </ParameterContainer>
      <PromptAddNestedChoices />
      <PromptAddNestedParameters />
      <PromptRenameChoice />
    </ParameterProvider>
  );
}
