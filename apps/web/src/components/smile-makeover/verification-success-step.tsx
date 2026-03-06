"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import successLogo from "../../assets/success.png";

interface VerificationSuccessStepProps {
  className?: string;
}

export function VerificationSuccessStep({
  className,
}: VerificationSuccessStepProps) {
  return (
    <div className={cn("flex flex-col items-center py-24 gap-2", className)}>
      <div className="flex size-20 items-center justify-center ">
        <Image src={successLogo} alt="Success" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground text-lg">
          Verification Successful!
        </h3>
      </div>
    </div>
  );
}
