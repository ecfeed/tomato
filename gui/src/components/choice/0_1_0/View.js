import { ViewExtended } from "./ViewExpanded";
import { ViewSimple } from "./ViewSimple";

export function View({ isFolded, isAbstract, name, value }) {
  if (isFolded || isAbstract) {
    return <ViewSimple name={name} />;
  }

  return <ViewExtended name={name} value={value} />;
}
