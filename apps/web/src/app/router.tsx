import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import { paths } from "../config/paths";
import { useMemo } from "react";
import ProtectedRoute from "./protected";

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(clientAction),
    Component,
  };
};

const protectedLoader = (queryClient: QueryClient) => async (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = await m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(clientAction),
    Component: () => (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    ),
  };
};

export const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      path: paths.auth.root.path,
      lazy: () => import("./routes/authentication").then(convert(queryClient)),
    },
    {
      path: paths.auth.callback.path,
      lazy: () =>
        import("./routes/authentication-callback").then(convert(queryClient)),
    },
    {
      path: paths.landing.path,
      lazy: () => import("./routes/landing").then(convert(queryClient)),
    },
    {
      path: paths.collections.root.path,
      lazy: () =>
        import("./routes/collections-root").then(protectedLoader(queryClient)),
      children: [
        {
          path: paths.sharedCollection.path,
          lazy: () =>
            import("./routes/shared-collection").then(protectedLoader(queryClient)),
        },
        {
          index: true,
          path: paths.collections.collection.path,
          lazy: () =>
            import("./routes/collections").then(protectedLoader(queryClient)),
        },
      ],
    },
    {
      path: paths.favourite.path,
      lazy: () =>
        import("./routes/favourite").then(protectedLoader(queryClient)),
    },
    {
      path: paths.feeds.path,
      lazy: () =>
        import("./routes/feeds").then(protectedLoader(queryClient)),
    },
    {
      path: paths.tags.path,
      lazy: () =>
        import("./routes/tags").then(protectedLoader(queryClient)),
    },
    {
      path: paths.settings.path,
      lazy: () =>
        import("./routes/settings").then(protectedLoader(queryClient)),
    },
    {
      path: paths.publicShare.path,
      lazy: () => import("./routes/public-collection").then(convert(queryClient)),
    },
    {
      path: "*",
      lazy: () => import("./routes/not-found").then(convert(queryClient)),
    },
  ]);
};

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
