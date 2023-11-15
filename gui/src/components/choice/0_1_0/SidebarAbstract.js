import Tooltip from "../../tooltip/0_1_0/Tooltip";
import { useChoices } from "./context/ChoiceContext";

export function SidebarAbstract({ className }) {
  const { isAbstract } = useChoices();

  if (!isAbstract) {
    return null;
  }

  return (
    <Tooltip info="The choice is abstract.">
      <div className={className}>*</div>
    </Tooltip>
  );
}
