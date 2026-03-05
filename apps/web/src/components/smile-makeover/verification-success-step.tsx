"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationSuccessStepProps {
	className?: string;
}

export function VerificationSuccessStep({
	className,
}: VerificationSuccessStepProps) {
	return (
		<div className={cn("flex flex-col items-center gap-6", className)}>
			<div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
				<CheckCircle2 className="size-10 text-green-500" />
			</div>

			<div className="text-center">
				<h3 className="font-semibold text-foreground text-lg">
					Verification Successful!
				</h3>
				<p className="mt-2 text-muted-foreground text-sm">
					Your identity has been verified. Proceeding to smile style selection...
				</p>
			</div>
		</div>
	);
}
