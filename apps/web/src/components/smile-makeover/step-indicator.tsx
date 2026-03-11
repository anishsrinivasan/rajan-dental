import type { StepIndicatorProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StepIndicator({
	currentStep,
	totalSteps,
	className,
}: StepIndicatorProps) {
	return (
		<div className={cn("flex items-center justify-center gap-2", className)}>
			{Array.from({ length: totalSteps }).map((_, index) => (
				<div
					className={cn(
						"h-2.5 rounded-full transition-all duration-300",
						index === currentStep
							? "w-2.5 bg-primary"
							: index < currentStep
								? "w-2.5 bg-primary"
								: "w-2.5 bg-primary/30"
					)}
					key={index}
				/>
			))}
		</div>
	);
}
