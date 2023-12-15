import styles from "./ButtonDefault.module.scss";

export function ButtonDefault({ handler, text, forceBackground }) {
  const data = text.split('\\n');

  return (
    <button className={forceBackground ? styles['style--forced'] : styles['style--default']} onClick={handler}>
      {data.map((e, index) =><div className={styles['button--text']} key={`${index} ${e}`}>{e}</div>)}
    </button>
  );
}
