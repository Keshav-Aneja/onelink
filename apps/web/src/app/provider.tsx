import { ReactNode, Suspense, useState } from "react";
import GlobalAppLoader from "../components/loaders/global-fallback-loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryConfig } from "../lib/react-query";

type GlobalAppProviderProps = {
  children: ReactNode;
};
export const GlobalAppProvider = ({ children }: GlobalAppProviderProps) => {
  const [queryClient] = useState(() => {
    return new QueryClient({ defaultOptions: queryConfig });
  });

  return (
    <Suspense fallback={<GlobalAppLoader />}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Suspense>
  );
};
