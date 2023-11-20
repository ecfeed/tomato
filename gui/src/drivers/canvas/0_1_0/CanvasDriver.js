import { Canvas } from "../../../components/canvas/0_1_0/Canvas";
import styles from "./CanvasDriver.module.css";

export default function CanvasDriver() {
  return (
    <div className={styles.driver}>
      <Canvas />
    </div>
  );
}
