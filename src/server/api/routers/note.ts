import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getAllTopLevel: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
        folderId: null,
      },
    });
  }),
  getByFolderId: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findMany({
        where: {
          userId: ctx.session.user.id,
          folderId: input.folderId,
        },
      });
    }),
  getById: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.noteId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string().optional(),
        folderId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          userId: ctx.session.user.id,
          content: input.content,
          title: input.title,
          folderId: input.folderId,
        },
      });
    }),
});
