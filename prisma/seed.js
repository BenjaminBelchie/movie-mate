/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from "@prisma/client";
import { FriendStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function seedDatabase() {
  await prisma.friend.deleteMany({});
  await prisma.filmWatchProviders.deleteMany({});
  await prisma.filmOnWatchlist.deleteMany({});
  await prisma.film.deleteMany({});
  await prisma.userWatchlist.deleteMany({});
  await prisma.watchProvider.deleteMany({});
  await prisma.user.deleteMany({});
  // Create test users
  const usersData = [
    {
      name: "User 1",
      email: "user1@example.com",
      image:
        "https://images.unsplash.com/profile-1592328433409-d9ce8a5333eaimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
    },
    {
      name: "User 2",
      email: "user2@example.com",
      image:
        "https://images.unsplash.com/profile-1611475141936-383e23c6cc6dimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
    },
    {
      name: "User 3",
      email: "user3@example.com",
      image:
        "https://images.unsplash.com/profile-1699902734720-eccbea4a118c?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
    },
  ];

  const users = await Promise.all(
    usersData.map((userData) => prisma.user.create({ data: userData })),
  );

  // Create friendships
  const friendshipsData = [
    {
      // @ts-ignore
      userId: users[0].id,
      // @ts-ignore
      friendId: users[1].id,
      status: FriendStatus.ACCEPTED,
    },
    {
      // @ts-ignore
      userId: users[0].id,
      // @ts-ignore
      friendId: users[2].id,
      status: FriendStatus.ACCEPTED,
    },
    // Add more friendships as needed
  ];

  await Promise.all(
    friendshipsData.map((friendshipData) =>
      prisma.friend.create({ data: friendshipData }),
    ),
  );

  console.log("Database seeded successfully.");
}

seedDatabase()
  .catch((error) => {
    throw error;
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
