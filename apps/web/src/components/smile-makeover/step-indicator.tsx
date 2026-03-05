import { cn } from "@/lib/utils";

interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
	className?: string;
}

export function StepIndicator({
	currentStep,
	totalSteps,
	className,
}: StepIndicatorProps) {
	return (
		<div className={cn("flex items-center justify-center gap-1.5", className)}>
			{Array.from({ length: totalSteps }).map((_, index) => (
				<div
					key={index}
					className={cn(
						"h-1.5 rounded-full transition-all duration-300 ",
						index === currentStep
							? "w-2.5 h-2.5 bg-primary"
							: "w-2.5 h-2.5 bg-muted-foreground/30"
					)}
				/>
			))}
		</div>
	);
}
