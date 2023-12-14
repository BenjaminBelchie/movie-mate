"use client";

import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import { type Prisma } from "@prisma/client";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function FriendList({
  friends,
}: {
  friends: Prisma.FriendGetPayload<{ include: { friend: true } }>[];
}) {
  const router = useRouter();

  const deleteFriendRequest = api.friend.cancelRequest.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const deleteFriend = api.friend.remove.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const cancelFriendRequest = (requestId: string) => {
    deleteFriendRequest.mutate({ requestId });
  };

  const removeFriend = (friendId: string) => {
    deleteFriend.mutate({ friendId });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {friends.map((friend, index) => (
        <Card key={index}>
          <CardBody className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-2">
              <Avatar
                src={
                  friend.friend.image ? friend.friend.image : "/no-image.jpg"
                }
                size="lg"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{friend.friend.name}</p>
                <p className="text-small font-extralight">
                  {friend.friend.email}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                friend.status === "ACCEPTED"
                  ? removeFriend(friend.id)
                  : cancelFriendRequest(friend.id);
              }}
            >
              {friend.status === "ACCEPTED" ? "Remove" : "Cancel Request"}{" "}
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
