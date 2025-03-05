import { GlobalAppProvider } from "./provider";
import { AppRouter } from "./router";

export const App = () => {
  return (
    <GlobalAppProvider>
      <AppRouter />
    </GlobalAppProvider>
  );
};
