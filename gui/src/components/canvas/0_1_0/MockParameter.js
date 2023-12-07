import { OptionsParameterLeft } from "./OptionsParameterLeft";
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
import { ParameterProvider } from "./context/ParameterContext";
import { PromptRenameParameter } from "./PromptRenameParameter";
import { PromptRenameChoice } from "./PromptRenameChoice";

export function MockParameter({
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
      root={root}
      setRoot={setRoot}
      isLocked={isLocked}
      setIsLocked={setIsLocked}
      parameter={parameter}
      parentMouseEvent={parentMouseEvent}
      top={top}>
      <Container>
        <OptionsParameterLeft />
        <Parameter>
          <Main>
            <Header />
            <BodyParameters />
            <BodyChoices />
          </Main>
          <OptionsBottom />
        </Parameter>
      </Container>
      <PromptAddNestedChoices />
      <PromptAddNestedParameters />
      <PromptAddParentParameter />
      <PromptRenameParameter />
      <PromptRenameChoice />
    </ParameterProvider>
  );
}
