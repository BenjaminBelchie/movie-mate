"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./Icons/SearchIcon";
import { Send } from "./Icons/Send";

export default function Nav({ isBlurred }: { isBlurred: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const searchForMovie = () => {
    router.push(`/search/${searchTerm.replace(/\s/g, "-")}`);
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      isBlurred={isBlurred}
      classNames={{ base: "bg-transparent z-20" }}
    >
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link href="/" aria-current="page" color="foreground">
            <div className="m-2">
              <Image src="/icon.png" height={52} width={52} alt="logo" />
            </div>
            <p className="font-bold text-inherit">Movie Mate</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <div className="hidden md:flex">
          <Input
            classNames={{
              base: "max-w-full md:max-w-[15rem] sm:max-w-[10rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search Movies"
            value={searchTerm}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchForMovie();
              }
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            startContent={<SearchIcon size={18} />}
            endContent={
              searchTerm && (
                <Button
                  isIconOnly
                  size="sm"
                  className=" bg-transparent"
                  onClick={searchForMovie}
                >
                  <Send size={18} />
                </Button>
              )
            }
          />
        </div>
        <div className="flex md:hidden">
          <Popover placement="bottom-end" showArrow>
            <PopoverTrigger>
              <Button isIconOnly>
                <SearchIcon size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px]">
              <div className=" flex w-full flex-col gap-2">
                <Input
                  classNames={{
                    base: "max-w-full md:max-w-[15rem] sm:max-w-[10rem] h-10",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-transparent hover:bg-transparent",
                  }}
                  placeholder="Search movies"
                  value={searchTerm}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchForMovie();
                    }
                  }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="sm"
                  startContent={<SearchIcon size={18} />}
                  endContent={
                    searchTerm && (
                      <Button
                        isIconOnly
                        size="sm"
                        className=" bg-transparent"
                        onClick={searchForMovie}
                      >
                        <Send size={18} />
                      </Button>
                    )
                  }
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={
                  session.user.image ??
                  "https://www.online-tech-tips.com/wp-content/uploads/2019/09/discord.jpg"
                }
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.user.email}</p>
              </DropdownItem>
              <DropdownItem key="friends">
                <Link className="text-small text-white" href="/friends">
                  Friends
                </Link>
              </DropdownItem>
              <DropdownItem key="watchlist">
                <Link className="text-small text-white" href="/watchlist">
                  My Watchlist
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                <Link
                  className="text-small text-white"
                  href="/api/auth/signout"
                >
                  Log out
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/api/auth/signin">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/api/auth/signin"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
