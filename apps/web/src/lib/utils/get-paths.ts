import { ROOT_PATH } from "@config/constants";
import { createSelector } from "@reduxjs/toolkit";
import { getAllCollections } from "@store/slices/collections-slice";
import { useAppSelector } from "@store/store";
import { useParams } from "react-router";
import { useMemo } from "react";

export default function getPaths() {
  const params = useParams();

  // Memoize to maintain referential stability across renders as the useParams returns a new reference of array on every render
  return useMemo(() => {
    let paths = params["*"]?.split("/");
    if (!paths || paths.length === 0) {
      return ["Home"];
    }
    paths = ["Home", ...paths];
    return paths.filter((path) => path.length > 0);
  }, [params["*"]]);
}

export function usePath(label: string): string {
  const paths = getPaths();
  return useMemo(() => {
    const index = paths.indexOf(label);
    return paths.slice(1, index + 1).join("/");
  }, [label, paths]);
}

export function useParentPath(): string | null {
  const paths = getPaths();
  return useMemo(() => {
    const lastPath = paths[paths.length - 1];
    if (lastPath === ROOT_PATH) {
      return null;
    }
    return lastPath;
  }, [paths]);
}

// /collections/test/app/hello

const selectParentIdFromPath = createSelector(
  [getAllCollections, (_state, paths: string[]) => paths],
  (collections, paths) => {
    if (paths.length == 1 && paths[0] === ROOT_PATH) return null;

    const n = paths.length;
    const lastPath = paths[n - 1];
    const lastPathParent = paths[n - 2] === ROOT_PATH ? null : paths[n - 2];

    if (!lastPath || collections.length === 0) return undefined;

    const matchingPaths = collections
      .filter((c) => c.name === lastPath)
      .map((c) => ({ id: c.id, parentId: c.parent_id }));

    if (!matchingPaths.length) return undefined;

    if (lastPathParent === null) {
      return matchingPaths.find((m) => m.parentId === null)?.id;
    }

    const parentIds = new Set(
      collections.filter((c) => c.name === lastPathParent).map((c) => c.id),
    );

    return matchingPaths.find((m) => parentIds.has(m.parentId || ""))?.id;
  },
);

export const useParentIdFromPath = () => {
  const paths = getPaths();
  return useAppSelector((state) => selectParentIdFromPath(state, paths));
};
