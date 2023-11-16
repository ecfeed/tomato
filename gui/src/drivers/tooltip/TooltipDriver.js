import TooltipDriverV0V1V0 from "./0_1_0/TooltipDriver";

const versionAll = ["0_1_0"];
const versionLatest = versionAll[0];

export default function TooltipDriver({ version = versionLatest }) {
  switch (version) {
    case "0_1_0":
      return <TooltipDriverV0V1V0 />;
    default:
      return <p>`Unknown tooltip version - ${version}`</p>;
  }
}

export const getAllVersions = () => {
  return versionAll;
};

export const getLatestVersion = () => {
  return versionLatest;
};
