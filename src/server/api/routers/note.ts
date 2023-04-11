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
  getByFolderId: protectedProcedure
    .input(z.object({ folderId: z.string().nullable() }))
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
        folderId: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      const createFields = {
        content: input.content,
        title: input.title,
        user: { connect: { id: ctx.session.user.id } },
      };
      if (input.folderId) {
        return ctx.prisma.note.create({
          data: {
            ...createFields,
            folder: { connect: { id: input.folderId } },
          },
        });
      }
      return ctx.prisma.note.create({
        data: {
          ...createFields,
        },
      });
    }),
});
