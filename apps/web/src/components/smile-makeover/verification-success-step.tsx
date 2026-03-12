"use client";

import Image from "next/image";
import type { VerificationSuccessStepProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import successLogo from "../../assets/success.png";

export function VerificationSuccessStep({
  className,
}: VerificationSuccessStepProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 py-26", className)}>
      <div className="flex size-20 items-center justify-center">
        <Image alt="Success" src={successLogo} />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground text-lg">
          Verification Successful!
        </h3>
      </div>
    </div>
  );
}
