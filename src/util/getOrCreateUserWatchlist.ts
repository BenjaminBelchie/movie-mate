import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

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
