import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "@server/libs/trpc/src/trpc.router";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc", // you should update this to use env variables
    }),
  ],
});
