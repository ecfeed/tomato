import { useSearchParams } from "react-router-dom";
import CanvasDriverV0V1V0 from "./0_1_0/CanvasDriver";
import CanvasDriverV0V2V0 from "./0_2_0/CanvasDriver";

const versionAll = ["0_2_0", "0_1_0"];
const versionLatest = versionAll[0];

export default function CanvasDriver() {
  const [searchParams] = useSearchParams();
  const version = searchParams.get('version') ? searchParams.get('version') : versionLatest;

  switch (version) {
    case "0_1_0":
      return <CanvasDriverV0V1V0 />;
    case "0_2_0":
      return <CanvasDriverV0V2V0 />;
    default:
      return <p>`Unknown canvas version - ${version}`</p>;
  }
}

export const getAllVersions = () => {
  return versionAll;
};

export const getLatestVersion = () => {
  return versionLatest;
};
