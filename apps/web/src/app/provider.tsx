import { ReactNode, Suspense, useState } from "react";
import GlobalAppLoader from "../components/loaders/global-fallback-loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryConfig } from "../lib/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@store/store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@components/ui/toast";
type GlobalAppProviderProps = {
  children: ReactNode;
};
export const GlobalAppProvider = ({ children }: GlobalAppProviderProps) => {
  const [queryClient] = useState(() => {
    return new QueryClient({ defaultOptions: queryConfig });
  });

  return (
    <Suspense fallback={<GlobalAppLoader />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              {children}
            </ToastProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
};
