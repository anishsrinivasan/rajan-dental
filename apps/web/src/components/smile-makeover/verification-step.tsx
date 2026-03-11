"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { VerificationStepProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import googleLogo from "../../assets/google-logo.png";
import verifyLogo from "../../assets/verify.png";

export function VerificationStep({
	onGoogleVerify,
	className,
}: VerificationStepProps) {
	return (
		<div
			className={cn("mt-16 flex flex-col items-center gap-8 py-2", className)}
		>
			<div className="flex items-center justify-center rounded-full">
				<Image alt="" src={verifyLogo} />
			</div>

			<div className="text-center">
				<h3 className="font-semibold text-foreground text-lg">
					Let’s Verify You
				</h3>
				<p className="mt-2 text-muted-foreground text-sm">
					We verify accounts to protect your <br /> photos and prevent misuse.
				</p>
			</div>

			<Button
				className="w-72 gap-3 rounded-2xl border border-[#C1C1C1]"
				size="lg"
				variant="outline"
			>
				<Image alt="" src={googleLogo} />
				Continue with Google
			</Button>
		</div>
	);
}
