import { Intervals } from "@config/constants";
import { syncDataThunk } from "@store/thunks/sync-data.thunk";
import { useAppDispatch } from "@store/store";
import { useEffect } from "react";

export function useDataSync(pathId: string | null | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncData = () => {
      if (pathId !== undefined) dispatch(syncDataThunk({ pathId }));
    };

    // Initial sync
    syncData();

    const interval = setInterval(syncData, Intervals.DATA_SYNC);

    // Sync when tab becomes visible again (user switches back to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathId, dispatch]);
}
