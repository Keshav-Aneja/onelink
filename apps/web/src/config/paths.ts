export const paths = {
  landing: {
    path: "/",
    getHref: () => "/",
  },
  auth: {
    root: {
      path: "/auth",
      getHref: (redirectTo?: string | null | undefined) => {
        return `/auth${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`;
      },
    },
    callback: {
      path: "/auth/callback",
      getHref: () => "/auth/callback",
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
  publicShare: {
    path: "/s/:token",
    getHref: (token: string) => `/s/${token}`,
  },
  sharedCollection: {
    path: "/collections/shared/:collection_id",
    getHref: (id: string) => `/collections/shared/${id}`,
  },
} as const;

//Learning: here exporting it as const preserves the contents of the object making it immutable.
