"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const navItems = [
  {
    name: "Overview",
    icon: "/home.svg",
    activeIcon: "/home-active.svg",
    href: "/dashboard/overview",
  },
  {
    name: "Leaderboard",
    icon: "/leaderboard.svg",
    activeIcon: "/leaderboard-active.svg",
    href: "/dashboard/leaderboard",
  },
  {
    name: "Transactions",
    icon: "/transactions.svg",
    activeIcon: "/transaction-active.svg",
    href: "/dashboard/transactions",
  },
  {
    name: "Users",
    icon: "/users.svg",
    activeIcon: "/users-active.svg",
    href: "/dashboard/users",
  },
  {
    name: "Profile",
    icon: "/profile.svg",
    activeIcon: "/profile-active.svg",
    href: "/dashboard/profile",
  },
];


export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const SidebarContent = () => (
    <nav className="flex flex-col h-full w-full">
      <div className="flex items-center gap-2 mb-6 px-6 py-3.5 border-b border-gray-100">
        <Image
          src="/liteR.svg"
          alt="LiteR Logo"
          width={117}
          height={40}
          priority
        />
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} className="px-4">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 py-6 text-[16px] transition-colors ${
                  active
                    ? "bg-[#213B66]/10 text-[#213B66] font-semibold"
                    : "text-[#333333]"
                }`}
              >
                <Image
                  src={active ? item.activeIcon : item.icon}
                  alt={item.name}
                  width={20}
                  height={20}
                />
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="mt-auto px-4 pb-6">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-center gap-2 py-6 bg-[#E53E3E]/10 text-[#E53E3E] hover:text-[#E53E3E] hover:bg-[#E53E3E]/20"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex md:w-60 h-screen border-r bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4.5 left-4 z-50 p-2 bg-[#72D389] rounded-md shadow"
          >
            <Menu className="h-6 w-6 text-[#213B66]" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-64 bg-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
