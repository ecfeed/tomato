import { Labels } from "./Labels";
import { Options } from "./Options";
import { NestedChoices } from "./NestedChoices";
import { SidebarRight } from "./SidebarRight";
import { SidebarLeft } from "./SidebarLeft";
import { View } from "./View";
import { Outline } from "./Outline";
import { Header } from "./Header";
import { ChoiceProvider } from "./context/ChoiceContext";

export default function Choice({ structure, parentUpdate, parentCancelView, parentChoiceRemove }) {
  return (
    <ChoiceProvider
      structure={structure}
      parentUpdate={parentUpdate}
      parentCancelView={parentCancelView}
      parentChoiceRemove={parentChoiceRemove}>
      <Outline>
        <Header>
          <SidebarLeft />
          <View />
          <SidebarRight />
        </Header>
        <Options />
        <Labels />
        <NestedChoices />
      </Outline>
    </ChoiceProvider>
  );
}
