"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { viewProfile } from "@/services/auth/authentication";

const pageTitles: Record<string, string> = {
  "/dashboard/overview": "Dashboard Overview",
  "/dashboard/leaderboard": "Leaderboard",
  "/dashboard/users": "Users",
  "/dashboard/transactions": "Transactions",
  "/dashboard/profile": "Profile",
};

export default function Appbar() {
  const pathname = usePathname();

  const { data, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: viewProfile,
  });

  const title = useMemo(() => {
    return pageTitles[pathname] ?? "Dashboard";
  }, [pathname]);

  const fullName = `${data?.user?.firstName} ${data?.user?.lastName}`;
  const email = data?.user?.email;

  return (
    <header className="flex items-center justify-between px-6 py-3.75 border-b bg-white sticky top-0 z-40">
      <h2 className="font-semibold text-[24px] text-gray-800 ml-8 md:ml-0">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full px-2.5 py-1">
          {/* Avatar */}
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <Avatar>
              <AvatarImage src="/avatar.jpg" alt={fullName || "User"} />
              <AvatarFallback>
                {fullName
                  ? fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Name & Email */}
          <div className="hidden md:block text-sm space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </>
            ) : (
              <>
                <p className="font-semibold text-gray-800">
                  {fullName || "Invalid User"}
                </p>
                <p className="text-gray-500 text-xs">
                  {email || "No Email Found"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
