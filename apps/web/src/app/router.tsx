import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import { paths } from "../config/paths";
import { useMemo } from "react";
import CollectionsRoot from "./routes/collections-root";
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

export const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      path: paths.auth.path,
      lazy: () => import("./routes/authentication").then(convert(queryClient)),
    },
    {
      path: paths.landing.path,
      lazy: () => import("./routes/landing").then(convert(queryClient)),
    },
    {
      path: paths.collections.root.path,
      element: (
        <ProtectedRoute>
          <CollectionsRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          path: paths.collections.collection.path,
          lazy: () => import("./routes/collections").then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.notifications.path,
      lazy: () => import("./routes/notifications").then(convert(queryClient)),
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
