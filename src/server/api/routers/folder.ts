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
  getAllTopLevel: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.folder.findMany({
      where: {
        parentFolderId: null,
        userId: ctx.session.user.id,
      },
    });
  }),
  getByParentFolderId: protectedProcedure
    .input(z.object({ parentFolderId: z.string() }))
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
      });
    }),
  getByIdWithSubfolders: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.folder.findFirstOrThrow({
        where: {
          id: input.folderId,
          userId: ctx.session.user.id,
        },
        include: {
          subFolders: true,
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
        parentFolderId: true,
      },
    });
    return arrayToTree(flatArray, { parentId: "parentFolderId" });
  }),
  create: protectedProcedure
    .input(
      z.object({ title: z.string(), parentFolderId: z.string().optional() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.folder.create({
        data: {
          title: input.title,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  createSubFolder: protectedProcedure
    .input(z.object({ title: z.string(), parentFolderId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.folder.create({
        data: {
          title: input.title,
          user: { connect: { id: ctx.session.user.id } },
          parentFolder: { connect: { id: input.parentFolderId } },
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
