import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { folderRouter } from "~/server/api//routers/folder";
import { noteRouter } from "./routers/note";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  folder: folderRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
