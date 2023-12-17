"use client";
import { Button, Input } from "@nextui-org/react";
import { SearchIcon } from "../Icons/SearchIcon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Send } from "../Icons/Send";
import { XIcon } from "../Icons/X";

export default function SearchWatchlistItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const currentPath = usePathname();
  const params = useSearchParams();
  const q = params.get("q");

  useEffect(() => {
    if (q) {
      setSearchTerm(q.replace(/%20/g, " "));
    }
  }, []);

  const searchForMovie = () => {
    if (searchTerm) {
      router.push(`${currentPath}?q=${searchTerm.replace(/\s/g, "%20")}`);
    } else {
      router.push(`${currentPath}`);
    }
  };

  const clearSearch = () => {
    router.push(currentPath);
    setSearchTerm("");
  };

  return (
    <Input
      variant="bordered"
      className="md:max-w-xs"
      placeholder="Search movies"
      isClearable
      onClear={() => {
        router.push(currentPath);
      }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          searchForMovie();
        }
      }}
      size="sm"
      startContent={<SearchIcon size={18} />}
      endContent={
        searchTerm && (
          <div className="gal-2 flex items-center">
            <Button className="bg-transparent" isIconOnly onClick={clearSearch}>
              <XIcon />
            </Button>
            <Button
              isIconOnly
              size="sm"
              className=" bg-transparent"
              onClick={searchForMovie}
            >
              <Send size={18} />
            </Button>
          </div>
        )
      }
    />
  );
}
