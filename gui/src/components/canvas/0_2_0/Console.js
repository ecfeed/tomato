import styles from "./Console.module.scss";

export function Console({ text = "" }) {
  const textParsed = text.split("\n");
  return (
    <div className={styles.console}>
      <div className={styles.header}>Export</div>
      {textParsed.map((e, index) => (
        <div key={index}>{e.replaceAll(" ", "\xa0")}</div>
      ))}
    </div>
  );
}
