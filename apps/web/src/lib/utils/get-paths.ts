import { ROOT_PATH } from "@config/constants";
import { useParams } from "react-router";

export default function getPaths() {
  const params = useParams();
  let paths = params["*"]?.split("/");
  if (!paths || paths.length === 0) {
    paths = ["Home"];
  } else {
    paths = ["Home", ...paths];
    paths = paths.filter((path) => path.length > 0);
  }
  return paths;
}

export function getPath(label: string) {
  const paths = getPaths();
  const index = paths.indexOf(label);
  return paths.slice(1, index + 1).join("/");
}

export function getParentPath(): string | null {
  const paths = getPaths();
  const lastPath = paths[paths.length - 1];
  if (lastPath === ROOT_PATH) {
    return null;
  }
  return lastPath;
}
