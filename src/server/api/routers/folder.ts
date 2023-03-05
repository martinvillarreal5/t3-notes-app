import { z } from "zod";

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
      return ctx.prisma.folder.findFirst({
        where: {
          id: input.folderId,
          userId: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({ title: z.string(), parentFolderId: z.string().optional() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.folder.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
          parentFolderId: input.parentFolderId,
        },
      });
    }),
});

/*
Prisma doesnt have suport for a includeRecursive-like query for one to many self relating tables
Dynamically fetch the 'depth' number of levels for subfolders property. 
TODO Check type safety 
TODO Adap method below to fetch the Top-Level Folders 
TODO and only return titles and ids for tree visualisation
? A
getWithSubfolders: protectedProcedure
    .input(z.object({ treeNodeId: z.string(), depth: z.number() }))
    .query(({ ctx, input }) => {

      let includeObject: any = {
          include: {subfolders: true}
      }

      let pointer = includeObject.include;

      for (let i = 0; i < depth - 1; i++) {
          pointer.children = {include: {subfolders: true}};
          pointer = pointer.children.include;
      }

      return ctx.prisma.folder.findUnique({
          where: {
              id: treeNodeId
              // ! userId: ctx.session.user.id, 
              // ! findUnique doesnt support non unique fields, like userId, in 'where' query
              // ? Use firstFirst instead?
          },
          include: includeObject.include
    });

*/
