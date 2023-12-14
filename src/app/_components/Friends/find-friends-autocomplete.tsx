"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
} from "@nextui-org/react";
import { type User } from "@prisma/client";
import { SearchIcon } from "../Icons/SearchIcon";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function FindFriendsAutocomplete({ users }: { users: User[] }) {
  const router = useRouter();

  const createFriendRequest = api.friend.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const sendFriendRequest = (friendId: string) => {
    createFriendRequest.mutate({ friendId });
  };

  return (
    <Autocomplete
      classNames={{
        base: "max-w-xs",
        listboxWrapper: "max-h-[320px]",
        selectorButton: "text-default-500",
      }}
      defaultItems={users}
      inputProps={{
        classNames: {
          input: "ml-1",
          inputWrapper: "h-[48px]",
        },
      }}
      listboxProps={{
        hideSelectedIcon: true,
        onAction: () => {
          null;
        },
        itemClasses: {
          base: [
            "rounded-medium",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-default-500",
          ],
        },
      }}
      aria-label="Find Friends"
      placeholder="Find new friends"
      popoverProps={{
        offset: 10,
        classNames: {
          base: "rounded-large",
          content: "p-1 border-small border-default-100 bg-background",
        },
      }}
      startContent={
        <SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />
      }
      radius="full"
      variant="bordered"
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={item.name}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                alt={item.name}
                className="flex-shrink-0"
                size="sm"
                src={item.image ? item.image : "/no-image.jpg"}
              />
              <div className="flex flex-col">
                <span className="text-small">{item.name}</span>
                <span className="text-tiny text-default-400">{item.email}</span>
              </div>
            </div>
            <Button
              className="mr-0.5 font-medium shadow-small"
              radius="full"
              color="primary"
              size="sm"
              onClick={() => {
                sendFriendRequest(item.id);
              }}
            >
              Add Friend
            </Button>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
