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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginExternalInputs, LoginSchema } from "@/lib/schemas/auth";

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginExternalInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const onSubmit = (data: LoginExternalInputs) => {
    mutate(data);
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-12.5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12.5 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Link href="/forgotpassword">
                <p className="text-sm font-medium text-[#333] cursor-pointer">
                  Forgot Password?
                </p>
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-6 mt-6"
            >
              {isPending ? <Spinner /> : "Continue"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
