import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import FindFriendsAutocomplete from "../_components/Friends/find-friends-autocomplete";
import NoFriendsAnimation from "../_components/Animations/no-friends";
import FriendList from "../_components/Friends/friend-list";
import NoFriendRequestsAnimation from "../_components/Animations/no-friend-requests";
import FriendRequests from "../_components/Friends/friend-requests";
import { UserGroup } from "../_components/Icons/UserGroup";

export default async function FriendsPage() {
  const session = await getServerAuthSession();
  if (!session) return redirect("/api/auth/signin");

  const friends = await db.friend.findMany({
    where: {
      userId: session.user.id,
    },
    include: { friend: true },
  });

  const friendRequests = await db.friend.findMany({
    where: {
      AND: [{ friendId: session.user.id }, { status: "REQUESTED" }],
    },
    include: { user: true },
  });

  const friendIds = friends.map((friend) => friend.friend.id);
  const users = await db.user.findMany({
    where: {
      AND: [{ id: { not: session.user.id } }, { id: { notIn: friendIds } }],
    },
  });

  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-4 my-5 flex flex-col gap-4 md:mx-0 md:w-[1200px]">
        {/* Desktop Layout */}
        <div className="hidden w-full flex-col justify-between gap-2 md:flex md:flex-row md:gap-0">
          <p className="text-4xl font-bold">Your Friends</p>
          <div className="  flex flex-row items-center gap-2">
            <Badge
              content={friendRequests.length}
              color="danger"
              isInvisible={friendRequests.length === 0}
            >
              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <Button variant="bordered">Friend Requests</Button>
                </PopoverTrigger>
                <PopoverContent>
                  {friendRequests.length > 0 ? (
                    <FriendRequests friendRequests={friendRequests} />
                  ) : (
                    <div className="mx-2 mb-6 flex max-w-[210px] flex-col items-center">
                      <NoFriendRequestsAnimation />
                      <p className="font-semibold">
                        You have no friend requests
                      </p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </Badge>
            <FindFriendsAutocomplete users={users} />
          </div>
        </div>
        {/* Mobile layout */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex justify-between">
            <p className="text-4xl font-bold">Your Friends</p>
            <Badge
              content={friendRequests.length}
              color="danger"
              isInvisible={friendRequests.length === 0}
            >
              <Popover placement="bottom-end" showArrow={true}>
                <PopoverTrigger>
                  <Button isIconOnly variant="bordered">
                    <UserGroup />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {friendRequests.length > 0 ? (
                    <FriendRequests friendRequests={friendRequests} />
                  ) : (
                    <div className="mx-2 mb-6 flex max-w-[210px] flex-col items-center">
                      <NoFriendRequestsAnimation />
                      <p className="font-semibold">
                        You have no friend requests
                      </p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </Badge>
          </div>
          <FindFriendsAutocomplete users={users} />
        </div>
        {friends.length > 0 ? (
          <FriendList friends={friends} />
        ) : (
          <div className="flex justify-center">
            <div className="my-5 flex w-full flex-col items-center md:w-1/3">
              <NoFriendsAnimation />
              <p className="text-large">Looks like you have no friends.</p>
              <p>Lets change that</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
