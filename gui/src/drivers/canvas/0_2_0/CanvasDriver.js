import { Canvas } from "../../../components/canvas/0_2_0/Canvas";
import styles from "./CanvasDriver.module.scss";

export default function CanvasDriver() {
  return (
    <div className={styles.driver}>
      {/* <h1>auTOMATOn</h1> */}
      <Canvas />
    </div>
  );
}
