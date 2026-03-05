import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	onValueChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
	({ className, min = 0, max = 100, step = 1, value, onValueChange, ...props }, ref) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			onValueChange?.(Number(e.target.value));
		};

		return (
			<input
				type="range"
				ref={ref}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={handleChange}
				className={cn(
					"h-2 w-full cursor-pointer appearance-none rounded-full bg-muted outline-none transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50",
					"[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110",
					"[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110",
					className
				)}
				{...props}
			/>
		);
	}
);

Slider.displayName = "Slider";

export { Slider };
