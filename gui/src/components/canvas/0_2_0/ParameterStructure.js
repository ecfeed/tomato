import { ParameterOptions } from "./ParameterOptions";
import { ChildrenChoices } from "./ChildrenChoices";
import { ChildrenParameters } from "./ChildrenParameters";
import { ParameterHeader } from "./ParameterHeader";
import { ParameterMain } from "./ParameterMain";
import { ParameterContainer } from "./ParameterContainer";
import { Parameter } from "./Parameter";
import { ParameterActionProvider } from "./context/ParameterActionContext";
import { ParameterPanel } from "./ParameterPanel";
import { ParameterMouseProvider } from "./context/ParameterMouseContext";

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
    <ParameterActionProvider
      activeParameter={activeParameter}
      setActiveParameter={setActiveParameter}
      root={root}
      setRoot={setRoot}
      isLocked={isLocked}
      setIsLocked={setIsLocked}
      parameter={parameter}
      parentMouseEvent={parentMouseEvent}>
      <ParameterMouseProvider
        id={parameter.id}
        isLocked={isLocked}
        parentMouseEvent={parentMouseEvent}
        setActiveParameter={setActiveParameter}>
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
      </ParameterMouseProvider>
    </ParameterActionProvider>
  );
}
