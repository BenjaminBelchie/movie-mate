"use client";
import { Pagination as NextUIPagination } from "@nextui-org/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const params = useSearchParams();
  const currentPage = params.get("page");
  console.log("Page: " + currentPage);
  const currentPath = usePathname();
  const router = useRouter();

  return (
    <NextUIPagination
      total={totalPages}
      showControls
      color="secondary"
      page={currentPage ? parseInt(currentPage) : 1}
      onChange={(e) => {
        router.push(`${currentPath}?page=${e.toString()}`);
      }}
    />
  );
}
