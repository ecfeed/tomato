import PromptDriverV0V1V0 from "./0_1_0/PromptDriver";

const versionAll = ["0_1_0"];
const versionLatest = versionAll[0];

export default function PromptDriver({ version = versionLatest }) {

  switch (version) {
    case "0_1_0":
      return <PromptDriverV0V1V0 />;
    default:
      return <p>`Unknown prompt version - ${version}`</p>;
  }
}

export const getAllVersions = () => {
  return versionAll;
};

export const getLatestVersion = () => {
  return versionLatest;
};
