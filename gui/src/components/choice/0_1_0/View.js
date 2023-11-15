import { ViewExtended } from "./ViewExpanded";
import { ViewSimple } from "./ViewSimple";
import { useChoices } from "./context/ChoiceContext";

export function View() {
  const { isFolded, isAbstract, name, value } = useChoices();

  if (isFolded || isAbstract) {
    return <ViewSimple />;
  }

  return <ViewExtended />;
}
