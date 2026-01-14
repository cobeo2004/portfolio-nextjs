import {
  QueryClient,
  defaultShouldDehydrateMutation,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldDehydrateMutation: (mutation) =>
          defaultShouldDehydrateMutation(mutation) ||
          mutation.state.status === "pending",
        shouldRedactErrors: () => false,
      },
    },
  });

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
};

export { getQueryClient };
