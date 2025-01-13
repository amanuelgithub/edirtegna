// import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
// import type { AppRouter } from "@server/src/app";

// export const trpc = createTRPCProxyClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: "http://localhost:4000/api/trpc", // you should update this to use env variables
//     }),
//   ],
// });


import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@server/src/app';
 
export const trpc = createTRPCReact<AppRouter>();
