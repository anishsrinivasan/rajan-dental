"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import googleLogo from "../../assets/Google Logo.png";
import { ArrowRightToLine } from 'lucide-react';

interface VerificationStepProps {
	onGoogleVerify: () => void;
	className?: string;
}

export function VerificationStep({
	onGoogleVerify,
	className,
}: VerificationStepProps) {
	return (
		<div className={cn("flex flex-col items-center gap-6", className)}>
			<div className="flex size-20 items-center justify-center rounded-full">
				<ArrowRightToLine className="size-6 text-primary" />
			</div>

			<div className="text-center">
				<h3 className="font-semibold text-foreground text-lg">Let’s Verify You</h3>
				<p className="mt-2 text-muted-foreground text-sm">
				We verify accounts to protect your <br/> photos and prevent misuse.
				</p> 
			</div>

			<Button
				// onClick={onGoogleVerify}
				variant="outline"
				size="lg"
				className="w-72 rounded-2xl gap-3"
			>
				<Image src={googleLogo} alt=""/>
				Continue with Google
			</Button>
		</div>
	);
}
