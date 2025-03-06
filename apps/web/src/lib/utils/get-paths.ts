import { useParams } from "react-router";

export default function getPaths() {
  const params = useParams();
  console.log(params["*"]);
  let paths = params["*"]?.split("/");
  if (!paths || paths.length === 0) {
    paths = ["Home"];
  } else {
    paths = ["Home", ...paths];
    paths = paths.filter((path) => path.length > 0);
    console.log(paths);
  }
  return paths;
}

export function getPath(label: string) {
  const paths = getPaths();
  const index = paths.indexOf(label);
  return paths.slice(1, index + 1).join("/");
}
