import { FriendStatus } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const friendRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  findUserFriends: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.friend.findMany({
      where: { AND: [{ userId: ctx.session.user.id }, { status: "ACCEPTED" }] },
      include: { friend: true },
    });
  }),

  create: protectedProcedure
    .input(z.object({ friendId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.friend.create({
        data: {
          friendId: input.friendId,
          userId: ctx.session.user.id,
          status: FriendStatus.REQUESTED,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ friendId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.friend
        .delete({
          where: { id: input.friendId },
        })
        .then(async (dbResponse) => {
          const otherUserFriend = await ctx.db.friend.findFirst({
            where: {
              AND: [
                { friendId: dbResponse.userId },
                { userId: dbResponse.friendId },
              ],
            },
          });
          if (otherUserFriend) {
            await ctx.db.friend.delete({ where: { id: otherUserFriend.id } });
          }
        });
    }),

  cancelRequest: protectedProcedure
    .input(z.object({ requestId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.friend.delete({
        where: { id: input.requestId },
      });
    }),

  acceptRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.string().min(1),
        friendRequestingId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.friend
        .update({
          where: { id: input.requestId },
          data: { status: "ACCEPTED" },
        })
        .then(async (dbResponse) => {
          const outstandingFriendRequest = await ctx.db.friend.findFirst({
            where: {
              AND: [
                { friendId: dbResponse.userId },
                { userId: dbResponse.friendId },
              ],
            },
          });
          if (outstandingFriendRequest) {
            await ctx.db.friend.update({
              where: { id: outstandingFriendRequest.id },
              data: { status: "ACCEPTED" },
            });
          } else {
            await ctx.db.friend.create({
              data: {
                userId: ctx.session.user.id,
                friendId: input.friendRequestingId,
                status: "ACCEPTED",
              },
            });
          }
        });
    }),
});
