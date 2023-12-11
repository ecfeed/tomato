import { OptionsBottom } from "./OptionsBottom";
import { PromptAddNestedChoices } from "./PromptAddNestedChoices";
import { PromptAddNestedParameters } from "./PromptAddNestedParameters";
import { BodyChoices } from "./BodyChoices";
import { BodyParameters } from "./BodyParameters";
import { Header } from "./Header";
import { Main } from "./Main";
import { Container } from "./Container";
import { Parameter } from "./Parameter";
import { ParameterProvider } from "./context/ParameterContext";
import { PromptRenameChoice } from "./PromptRenameChoice";
import { PanelParameterLeft } from "./PanelParameterLeft";

export function MockParameter({
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
      <Container>
        <PanelParameterLeft />
        <Parameter>
          <Main>
            <Header />
            {/* <BodyParameters /> */}
            {/* <BodyChoices /> */}
          </Main>
          {/* <OptionsBottom /> */}
        </Parameter>
      </Container>
      <PromptAddNestedChoices />
      <PromptAddNestedParameters />
      <PromptRenameChoice />
    </ParameterProvider>
  );
}
