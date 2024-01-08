import { ParameterOptions } from "./ParameterOptions";
import { ChildrenChoices } from "./ChildrenChoices";
import { ChildrenParameters } from "./ChildrenParameters";
import { ParameterHeader } from "./ParameterHeader";
import { ParameterMain } from "./ParameterMain";
import { ParameterContainer } from "./ParameterContainer";
import { Parameter } from "./Parameter";
import { ParameterProvider } from "./context/ParameterContext";
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
      parentMouseEvent={parentMouseEvent}>
      <ParameterContainer>
        <ParameterPanel />
        <Parameter>
          <ParameterMain>
            <ParameterHeader />
            {/* <ChildrenParameters /> */}
            {/* <ChildrenChoices /> */}
          </ParameterMain>
          {/* <ParameterOptions /> */}
        </Parameter>
      </ParameterContainer>
    </ParameterProvider>
  );
}
