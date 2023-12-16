"use client";

import { Select, SelectItem, type Selection } from "@nextui-org/react";
import { SelectorIcon } from "../Icons/SelectorIcon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortItemsBy() {
  const router = useRouter();
  const currentPath = usePathname();
  const params = useSearchParams();
  const addedBy = params.get("addedBy");

  const onSelectionChange = (id: Selection) => {
    const keysArray = Array.from(id);
    const orderBy = keysArray.at(0);

    if (addedBy && orderBy) {
      router.push(`${currentPath}?addedBy=${addedBy}&sort=${orderBy}`);
    } else if (!addedBy && orderBy) {
      router.push(`${currentPath}?sort=${orderBy}`);
    } else if (addedBy && !orderBy) {
      router.push(`${currentPath}?addedBy=${addedBy}`);
    } else {
      router.push(currentPath);
    }
  };
  return (
    <Select
      placeholder="Sort By"
      variant="bordered"
      className="max-w-xs"
      disableSelectorIconRotation
      onSelectionChange={onSelectionChange}
      aria-label="Sort By"
      size="sm"
      selectorIcon={<SelectorIcon />}
    >
      <SelectItem key="latest" value="Latest">
        Latest
      </SelectItem>
      <SelectItem key="oldest" value="Oldest">
        Oldest
      </SelectItem>
    </Select>
  );
}
