export const paths = {
  landing: {
    path: "/",
    getHref: () => "/",
  },
  auth: {
    path: "/auth",
    getHref: (redirectTo?: string | null | undefined) => {
      return `/auth${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`;
    },
  },
  collections: {
    root: {
      path: "/collections",
      getHref: () => "/collections",
    },
    collection: {
      path: "*",
      getHref: (collections: unknown) => {
        if (
          Array.isArray(collections) &&
          collections.every((item) => typeof item === "string")
        ) {
          return `/collection/${collections.join("/")}`;
        } else if (typeof collections === "string") {
          return `/collections/${collections}`;
        }
        return "/collections";
      },
    },
  },
  notifications: {
    path: "/notifications",
    getHref: () => "/notifications",
  },
  favourite: {
    path: "/favourite",
    getHref: () => "/favourite",
  },
} as const;

//Learning: here exporting it as const preserves the contents of the object making it immutable.
