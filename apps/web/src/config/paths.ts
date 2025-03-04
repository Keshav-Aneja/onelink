export const paths = {
  landing: {
    path: "/",
    getHref: () => "/",
  },
  auth: {
    path: "/auth",
    getHref: () => "/auth",
  },
  collections: {
    root: {
      path: "/collections",
      getHref: () => "/collection",
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
} as const;

//Learning: here exporting it as const preserves the contents of the object making it immutable.
