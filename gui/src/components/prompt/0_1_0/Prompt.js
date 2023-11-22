import styles from './Prompt.module.css'

export function Prompt({ header='input', text, handler }) {
    return (
        <div className={styles.prompt}>
            <div className={styles.header}>{header} </div>
            <div className={styles.text}>{text}</div>
            <input className={styles.input} />
            <footer className={styles.footer}>
                <div type='button' className={styles.ok}>Ok</div>
                <div type='button' className={styles.cancel}>Cancel</div>
            </footer>
        </div>
    )
}