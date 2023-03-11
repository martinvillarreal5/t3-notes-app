import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        folder: { userId: ctx.session.user.id },
      },
    });
  }),
  getAllTopLevel: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        folder: { userId: ctx.session.user.id },
        folderId: null,
      },
    });
  }),
  getByFolderId: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findMany({
        where: {
          folder: { userId: ctx.session.user.id },
          folderId: input.folderId,
        },
      });
    }),
  getById: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findFirst({
        where: {
          folder: { userId: ctx.session.user.id },
          id: input.noteId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        folderId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          content: input.title,
          folderId: input.folderId,
        },
      });
    }),
});
