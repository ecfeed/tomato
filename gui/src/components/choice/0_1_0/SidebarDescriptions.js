import Tooltip from "../../tooltip/0_1_0/Tooltip";
import { useChoices } from "./context/ChoiceContext";

export function SidebarDescriptions({ className }) {
  const { descriptions } = useChoices();

  if (!descriptions || descriptions?.length === 0) {
    return null;
  }

  return (
    <Tooltip info={descriptions}>
      <div className={className}>!</div>
    </Tooltip>
  );
}
