"use client";

import { Avatar, Button } from "@nextui-org/react";
import { type Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function FriendRequests({
  friendRequests,
}: {
  friendRequests: Prisma.FriendGetPayload<{ include: { user: true } }>[];
}) {
  const router = useRouter();
  const acceptFriendRequestMutation = api.friend.acceptRequest.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const acceptFriendRequest = (
    requestId: string,
    friendRequestingId: string,
  ) => {
    acceptFriendRequestMutation.mutate({ requestId, friendRequestingId });
  };

  return (
    <div className="flex w-72 flex-col gap-4 p-4">
      {friendRequests.map((request, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              alt={request.user.name}
              className="flex-shrink-0"
              size="sm"
              src={request.user.image ? request.user.image : "/no-image.jpg"}
            />
            <div className="flex flex-col">
              <span className="text-small">{request.user.name}</span>
              <span className="text-tiny text-default-400">
                {request.user.email}
              </span>
            </div>
          </div>
          <Button
            className="mr-0.5 font-medium shadow-small"
            radius="full"
            color="primary"
            size="sm"
            onClick={() => {
              acceptFriendRequest(request.id, request.userId);
            }}
          >
            Accept
          </Button>
        </div>
      ))}
    </div>
  );
}
