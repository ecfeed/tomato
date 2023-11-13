import Tooltip from "../../tooltip/0_1_0/Tooltip";

export function SidebarDescriptions({ descriptions, className }) {
  if (!descriptions || descriptions?.length === 0) {
    return null;
  }

  return (
    <Tooltip info={descriptions}>
      <div className={className}>!</div>
    </Tooltip>
  );
}
