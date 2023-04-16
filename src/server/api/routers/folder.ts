import { z } from "zod";
import { arrayToTree } from "performant-array-to-tree";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
//import type { Folder, Note } from "@prisma/client";

export const folderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.folder.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getRootFolders: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.folder.findMany({
      where: {
        parentFolderId: null,
        userId: ctx.session.user.id,
      },
    });
  }),
  getById: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ ctx, input }) => {
      //TODO make a single $rawQuery using a recursive query

      const folder = await ctx.prisma.folder.findFirstOrThrow({
        where: {
          id: input.folderId,
          userId: ctx.session.user.id,
        },
        include: {
          subFolders: { select: { id: true, title: true } },
          parentFolder: {
            select: { id: true, title: true },
          },
          notes: true,
        },
      });
      type FolderWithAncestors = typeof folder & {
        ancestors: {
          title: string;
          id: string;
        }[];
      };
      const folderWithAncestors: FolderWithAncestors = {
        ...folder,
        ancestors: [],
      };
      const findAncestorAndPushToAncestorsArray = async (id: string) => {
        const folder = await ctx.prisma.folder.findFirstOrThrow({
          where: {
            id: id,
            userId: ctx.session.user.id,
          },
          select: {
            id: true,
            title: true,
            parentFolderId: true,
          },
        });
        folderWithAncestors.ancestors.unshift({
          id: folder.id,
          title: folder.title,
        });
        if (folder.parentFolderId) {
          await findAncestorAndPushToAncestorsArray(folder.parentFolderId);
        }
      };

      if (folder.parentFolderId) {
        await findAncestorAndPushToAncestorsArray(folder.parentFolderId);
      }
      return folderWithAncestors;
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
