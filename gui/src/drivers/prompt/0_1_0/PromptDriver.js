import { Prompt } from "../../../components/prompt/0_1_0/Prompt";
import styles from "./PromptDriver.module.css";

export default function PromptDriver() {
  return (
    <div className={styles.driver}>
      <h1>Prompt</h1>
      <Prompt
        header={"lorem ipsum"}
        text={"Lorem ipsum."}
        placeholder={() => 'placeholder'}
        handleConfirm={(input) => console.log(input)}
        handleCancel={() => console.log("cancel")}
      />
    </div>
  );
}
