export function SidebarLabels({ labels, handleMouseEnter, handleMouseLeave, className }) {
  if (!labels || labels?.length === 0) {
    return null;
  }

  return (
    <div className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      L
    </div>
  );
}
