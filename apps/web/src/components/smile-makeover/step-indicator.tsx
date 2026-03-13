import type { StepIndicatorProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StepIndicator({
	currentStep,
	totalSteps,
	className,
}: StepIndicatorProps) {
	const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

	return (
		<div className={cn("flex items-center justify-center gap-2", className)}>
			{steps.map((step) => {
				let stepClass = "w-2.5 bg-primary/30";

				if (step === currentStep) {
					stepClass = "w-2.5 bg-primary";
				} else if (step < currentStep) {
					stepClass = "w-2.5 bg-primary";
				}

				return (
					<div
						className={cn(
							"h-2.5 rounded-full transition-all duration-300",
							stepClass
						)}
						key={step}
					/>
				);
			})}
		</div>
	);
}
