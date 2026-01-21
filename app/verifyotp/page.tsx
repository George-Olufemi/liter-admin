"use client";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { otpVerification } from "@/services/auth/authentication";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpInputs, OtpSchema } from "@/lib/schemas/auth";

export default function VerifyOtp() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpInputs>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: otpVerification,
    onSuccess: () => {
      toast.success("OTP verified successfully");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error || "Invalid or expired OTP");
    },
  });

  const onSubmit = (data: OtpInputs) => {
    mutate(data.otp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#191C1E] px-4">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <Image
            src="/liteR.svg"
            alt="LiteR Logo"
            width={120}
            height={50}
            priority
          />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0f1113] rounded-xl shadow-sm">
          <CardContent className="p-5 sm:p-8 space-y-6">
            {/* Title */}
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Verify OTP
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the 6-digit code sent to your email or phone number
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP Input */}
              <div className="flex flex-col items-center space-y-2">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2 sm:gap-3">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 sm:w-12 sm:h-14 text-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}
              </div>

              {/* Resend + Timer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Didn’t get the code?{" "}
                  <span className="font-semibold text-[#213B66] dark:text-[#72D389] cursor-pointer hover:underline">
                    Resend
                  </span>
                </p>
                <p className="font-semibold text-[#213B66] dark:text-[#72D389]">
                  30s
                </p>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full py-6 text-base"
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "Verify"}
              </Button>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
