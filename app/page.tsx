"use client";

import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth/authentication";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);

      toast.success("Login successful!");

      setTimeout(() => {
        router.push("/dashboard/overview");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Login failed");
    },
  });

  const handleLogin = () => {
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#F9FAFB]">
      <div className="mb-18">
        <Image
          src="/liteR.svg"
          alt="LiteR Logo"
          width={117.16}
          height={49.93}
          priority
        />
      </div>

      <div className="w-full max-w-124.75 bg-white rounded-md">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Welcome back!</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-12.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12.5 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Link href="/forgotpassword">
              <p className="text-sm font-medium text-right text-[#333] cursor-pointer">
                Forgot Password?
              </p>
            </Link>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isPending}
            className="w-full py-6"
          >
            {isPending ? <Spinner /> : "Continue"}
          </Button>
        </CardContent>
      </div>
    </div>
  );
}
