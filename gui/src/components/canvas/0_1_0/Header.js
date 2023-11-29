import styles from "./Header.module.scss";

export function Header({ name, isSelected, choices, parameters, handleMouseHeaderClick }) {
  return (
    <div
      className={`${styles["parameter-header"]} ${
        isSelected ? styles["parameter-header--negative"] : styles["parameter-header--default"]
      } ${choices?.length > 0 || parameters?.length > 0 ? styles["underline"] : ""}`}
      onClick={handleMouseHeaderClick}>
      <div>{name}</div>
    </div>
  );
}
