import { z } from "zod";
import { arrayToTree } from "performant-array-to-tree";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const folderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.folder.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getManyByParentFolderId: protectedProcedure
    .input(z.object({ parentFolderId: z.string().nullable() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.folder.findMany({
        where: {
          parentFolderId: input.parentFolderId,
          userId: ctx.session.user.id,
        },
      });
    }),
  getById: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.folder.findFirstOrThrow({
        where: {
          id: input.folderId,
          userId: ctx.session.user.id,
        },
        include: {
          subFolders: { select: { id: true, title: true } },
          parentFolder: { select: { id: true, title: true } },
          notes: true,
        },
      });
    }),
  getFoldersTree: protectedProcedure.query(async ({ ctx }) => {
    const flatArray = await ctx.prisma.folder.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
        parentFolderId: true,
      },
    });
    return arrayToTree(flatArray, {
      parentId: "parentFolderId",
      dataField: null,
    });
  }),
  create: protectedProcedure
    .input(
      z.object({ title: z.string(), parentFolderId: z.string().nullable() })
    )
    .mutation(({ ctx, input }) => {
      const createFields = {
        title: input.title,
        user: { connect: { id: ctx.session.user.id } },
      };
      if (input.parentFolderId) {
        return ctx.prisma.folder.create({
          data: {
            parentFolder: { connect: { id: input.parentFolderId } },
            ...createFields,
          },
        });
      }
      return ctx.prisma.folder.create({
        data: {
          ...createFields,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.folder.deleteMany({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
});
