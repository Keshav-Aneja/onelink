import { DefaultOptions } from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    retry: false,
  },
} satisfies DefaultOptions;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryFn" | "queryKey"
>;
