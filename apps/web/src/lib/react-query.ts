import { DefaultOptions } from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    retry: false,
  },
} satisfies DefaultOptions;
