import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCollections } from "@features/collections/get-collections";
import { getLinks } from "@features/links/get-links";
import { Collection, Link } from "@onelink/entities/models";

interface SyncDataParams {
  pathId: string | null;
}

interface SyncDataResult {
  collections: Collection[] | undefined;
  links: Link[] | undefined;
}

export const syncDataThunk = createAsyncThunk<SyncDataResult, SyncDataParams>(
  "data/sync",
  async ({ pathId }, { rejectWithValue }) => {
    try {
      // Fetch both collections and links in parallel
      const [collectionsResponse, linksResponse] = await Promise.all([
        getCollections(pathId),
        getLinks(pathId),
      ]);

      return {
        collections:
          collectionsResponse.success ? collectionsResponse.data : undefined,
        links: linksResponse.success ? linksResponse.data : undefined,
      };
    } catch (error) {
      console.error("Error syncing data:", error);
      return rejectWithValue(error);
    }
  },
);
