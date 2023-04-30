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
  getRootNotes: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
        folderId: null,
      },
    });
  }),
  getById: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findFirstOrThrow({
        where: {
          userId: ctx.session.user.id,
          id: input.noteId,
        },
        include: {
          folder: { select: { id: true, title: true } },
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.note.deleteMany({
        where: {
          id: input.noteId,
          userId: ctx.session.user.id,
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
  update: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        title: z
          .string()
          .max(50, {
            message: "Note title must be 50 characters long or less.",
          })
          .optional(),
        content: z
          .string()
          .min(1, { message: "Note content is required." })
          .max(65535, {
            message: "Note content must be 65,535 characters long or less.",
          })
          .optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      // ? We use updateMany because update dont accept non unique parameters in the 'where' object
      return ctx.prisma.note.updateMany({
        where: {
          userId: ctx.session.user.id,
          id: input.noteId,
        },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),
});
