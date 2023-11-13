import Tooltip from "../../tooltip/0_1_0/Tooltip";

export function SidebarRandomized({ isRandom, isAbstract, className }) {
  if (!isRandom || isAbstract) {
    return null;
  }

  return (
    <Tooltip info="The choice is randomized.">
      <div className={className}>?</div>
    </Tooltip>
  );
}
