"use client";
import { useState } from "react";
import { Avatar, Button, Card, CardHeader } from "@nextui-org/react";

export const PopoverCard = () => {
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <Card shadow="none" className="w-[250px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-500">
              @zoeylang
            </h5>
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? "border-default-200 bg-transparent text-foreground"
              : ""
          }
          color="primary"
          radius="full"
          isDisabled={isFollowed}
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Sent" : "Send"}
        </Button>
      </CardHeader>
    </Card>
  );
};
