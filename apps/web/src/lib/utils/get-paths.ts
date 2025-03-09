import { ROOT_PATH } from "@config/constants";
import { getAllCollections } from "@store/slices/collections-slice";
import { useAppSelector } from "@store/store";
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

// /collections/test/app/hello

//TODO: memoize this function later
export const getParentIdFromPath = (): string | null | undefined => {
  const paths = getPaths();
  const collections = useAppSelector(getAllCollections);
  if (paths.length === 1 && paths[0] === ROOT_PATH) {
    return null;
  }
  const n = paths.length;
  const lastPath = paths[n - 1];
  const lastPathParent = paths[n - 2] === ROOT_PATH ? null : paths[n - 2];

  if (!lastPath || collections.length === 0) {
    return undefined;
  }
  //Finding all the collections with the name "TEST" {id:collection_id, parent_id:string}
  const matchingPaths = collections
    .filter((collection) => collection.name === lastPath)
    .map((collection) => ({
      id: collection.id,
      parentId: collection.parent_id,
    }));

  if (!matchingPaths || matchingPaths.length === 0) {
    return undefined;
  }
  if (lastPathParent === null) {
    for (let i = 0; i < matchingPaths.length; i++) {
      if (matchingPaths[i].parentId === null) {
        return matchingPaths[i].id;
      }
    }
  }
  const matchingPathParent = collections.map((collection) => {
    if (collection.name === lastPathParent) {
      return collection.id;
    }
  });
  //Now we have to check if any paths and parent are matching:
  let finalPathId = undefined;
  for (let i = 0; i < matchingPaths.length; i++) {
    for (let j = 0; j < matchingPathParent.length; j++) {
      if (matchingPathParent[j] === matchingPaths[i]?.parentId) {
        finalPathId = matchingPaths[i]?.id;
        break;
      }
    }
  }
  return finalPathId;
};
