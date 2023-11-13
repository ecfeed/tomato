import Tooltip from "../../tooltip/0_1_0/Tooltip";

export function SidebarAbstract({ isAbstract, className }) {
  if (!isAbstract) {
    return null;
  }

  return (
    <Tooltip info="The choice is abstract.">
      <div className={className}>*</div>
    </Tooltip>
  );
}
