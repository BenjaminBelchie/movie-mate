import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Session } from "next-auth";

export const getOrCreateUserWatchlist = async (
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  user_id: string,
) => {
  const userWatchlist = await db.userWatchlist.findFirst({
    where: { userId: user_id },
  });

  if (!userWatchlist) {
    const watchlist = await db.userWatchlist.create({
      data: { userId: user_id },
    });
    return watchlist;
  } else {
    return userWatchlist;
  }
};
