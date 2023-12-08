import styles from "./Header.module.scss";
import { FILTER_PATRYK } from "./abstract/Limitations";
import { useParameter } from "./context/ParameterContext";

export function Header() {
  const { name, isSelected, isFolded, choices, parameters, handleMouseHeaderClick } = useParameter();

  return (
    <div
      className={`${styles["parameter-header"]} ${
        isSelected ? styles["parameter-header--negative"] : styles["parameter-header--default"]
      } ${(choices?.length > 0 || parameters?.length > 0) && !isFolded && !FILTER_PATRYK ? styles["underline"] : ""}`}
      onClick={handleMouseHeaderClick}>
      <div>{name}</div>
    </div>
  );
}
