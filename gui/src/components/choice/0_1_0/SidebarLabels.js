import { useChoices } from "./context/ChoiceContext";

export function SidebarLabels({ className }) {
  const { labels, handleRightSidebarMouseEnter, handleRightSidebarMouseLeave } = useChoices();

  if (!labels || labels?.length === 0) {
    return null;
  }

  return (
    <div
      className={className}
      onMouseEnter={handleRightSidebarMouseEnter}
      onMouseLeave={handleRightSidebarMouseLeave}>
      L
    </div>
  );
}
