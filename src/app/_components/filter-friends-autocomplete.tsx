"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react";
import { type User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { type Key } from "react";

export default function FilterFriendsAutocomplete({
  friends,
}: {
  friends: User[];
}) {
  const router = useRouter();
  const currentPath = usePathname();

  const onSelectionChange = (id: Key) => {
    if (id) {
      router.push(`${currentPath}?addedBy=${id}`);
    } else {
      router.push(currentPath);
    }
  };
  return (
    <Autocomplete
      variant="bordered"
      defaultItems={friends}
      label="Added by"
      size="sm"
      onSelectionChange={onSelectionChange}
      className="max-w-xs"
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={item.name}>
          <div className="flex items-center gap-2">
            <Avatar
              alt={item.name}
              className="flex-shrink-0"
              size="sm"
              src={item.image ? item.image : "/no-image.jpg"}
            />
            <div className="flex flex-col">
              <span className="text-small">{item.name}</span>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
