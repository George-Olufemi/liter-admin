"use client";

import Image from "next/image";
import { SquarePen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { viewProfile } from "@/services/auth/authentication";

const Profile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: viewProfile,
    staleTime: 5 * 60 * 1000,
  });

  const user = data?.user;

  const initials = `${user?.firstName?.[0] ?? ""}${
    user?.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div>
      <div className="bg-white rounded-md border border-[#E5E7EB] py-6 px-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-12.5 w-12.5 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-full px-2.5 py-1">
              <Avatar className="h-12.5 w-12.5">
                <AvatarImage src="/avatar.jpg" alt={user?.firstName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="hidden md:block text-base">
                <p className="font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {!isLoading && user?.isVerified && (
          <div className="bg-[#EBFFEB] rounded-md py-1 px-3">
            <p className="text-[#06BD00] text-xs font-medium">Verified</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-md border border-[#E5E7EB] py-4.5 px-4.5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image src="/info.svg" alt="" width={16} height={16} />
            <p>Personal Information</p>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <p>Edit</p>
            <SquarePen size={18} />
          </div>
        </div>

        <div className="max-w-194 grid grid-cols-3 gap-4.5 mb-5">
          {isLoading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))
          ) : (
            <>
              <div>
                <p className="text-[#333333]/70 capitalize text-xs">
                  First Name
                </p>
                <h2 className="text-[#333] text-lg capitalize font-semibold">
                  {user?.firstName}
                </h2>
              </div>

              <div>
                <p className="text-[#333333]/70 capitalize text-xs">
                  Last Name
                </p>
                <h2 className="text-[#333] text-lg capitalize font-semibold">
                  {user?.lastName}
                </h2>
              </div>

              <div>
                <p className="text-[#333333]/70 capitalize text-xs">
                  Email Address
                </p>
                <h2 className="text-[#333] text-lg font-semibold">
                  {user?.email}
                </h2>
              </div>

              <div>
                <p className="text-[#333333]/70 capitalize text-xs">
                  Phone Number
                </p>
                <h2 className="text-[#333] text-lg font-semibold">
                  {user?.phoneNumber}
                </h2>
              </div>

              <div>
                <p className="text-[#333333]/70 capitalize text-xs">Address</p>
                <h2 className="text-[#333] text-lg font-semibold">
                  {user?.address}
                </h2>
              </div>

              <div>
                <p className="text-[#333333]/70 capitalize text-xs">City</p>
                <h2 className="text-[#333] text-lg capitalize font-semibold">
                  {user?.city}
                </h2>
              </div>

              <div>
                <p className="text-[#333333]/70 capitalize text-xs">State</p>
                <h2 className="text-[#333] text-lg capitalize font-semibold">
                  {user?.state}
                </h2>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
