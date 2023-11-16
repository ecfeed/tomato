import ChoiceDriverV0V1V0 from "./0_1_0/ChoiceDriver";

const versionAll = ["0_1_0"];
const versionLatest = versionAll[0];

export default function ChoiceDriver({ version = versionLatest }) {

  switch (version) {
    case "0_1_0":
      return <ChoiceDriverV0V1V0 />;
    default:
      return <p>`Unknown choice version - ${version}`</p>;
  }
}

export const getAllVersions = () => {
  return versionAll;
};

export const getLatestVersion = () => {
  return versionLatest;
};
