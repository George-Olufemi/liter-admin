"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "../ui/skeleton";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure hydration/persistence sync if needed,
    // or just immediate check if state is ready.
    // Since zustand persist can be sync, we check immediately but use effect to trigger redirect.
    if (!isAuthenticated) {
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, router]);

  if (isChecking) {
    return (
      <div className="PY-5">
        {/* <Spinner /> */}
        <Skeleton className="w-screen h-screen" />
      </div>
    );
  }

  return <>{children}</>;
}
