"use client";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { forgotPassword } from "@/services/auth/authentication";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordInputs, ForgotPasswordSchema } from "@/lib/schemas/auth";

export default function ForgotPassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Password reset instructions sent to your email!");
      setTimeout(() => {
        router.push("/verifyotp");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send reset instructions");
    },
  });

  const onSubmit = (data: ForgotPasswordInputs) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
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
            <h2 className="text-lg font-semibold">Enter Email Address</h2>
            <p>Enter the email address associated with your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="text"
                placeholder="Enter your email address"
                className="h-12.5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full py-6">
              {isPending ? <Spinner /> : "Continue"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
