"use client";

import { useState } from "react";
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

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

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

  const handleVerify = () => {
    mutate(otp);
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

            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
              onClick={handleVerify}
              className="w-full py-6 text-base"
              disabled={isPending || otp.length !== 6}
            >
              {isPending ? <Spinner /> : "Verify"}
            </Button>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
