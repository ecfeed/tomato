import { NavLink } from 'react-router-dom'
import styles from './PageNav.module.css'


export function PageNav() {
    
    return (
        <nav className={styles.nav}>
            <ul>
                <NavLink to="tooltip">Tooltip</NavLink>
            </ul>
            <ul>
                <NavLink to="prompt">Prompt</NavLink>
            </ul>
            <ul>
                <NavLink to="choice">Choice</NavLink>
            </ul>
            <ul>
                <NavLink to="canvas">Canvas</NavLink>
            </ul>
            {/* <ul>
                <NavLink to="art">Art</NavLink>
            </ul> */}
        </nav>
    )
}

