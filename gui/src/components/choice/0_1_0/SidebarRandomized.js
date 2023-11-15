import Tooltip from "../../tooltip/0_1_0/Tooltip";
import { useChoices } from "./context/ChoiceContext";

export function SidebarRandomized({ className }) {
  const {isRandomized, isAbstract} = useChoices();

  if (!isRandomized || isAbstract) {
    return null;
  }

  return (
    <Tooltip info="The choice is randomized.">
      <div className={className}>?</div>
    </Tooltip>
  );
}
