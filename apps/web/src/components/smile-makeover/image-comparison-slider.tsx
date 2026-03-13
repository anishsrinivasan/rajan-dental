"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageComparisonSliderProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ImageComparisonSlider({
	beforeImage,
	afterImage,
	className,
}: ImageComparisonSliderProps) {
	const [sliderPosition, setSliderPosition] = useState(50);
	const [isDragging, setIsDragging] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleMove = useCallback((clientX: number) => {
		if (!containerRef.current) {
			return;
		}

		const rect = containerRef.current.getBoundingClientRect();
		const x = clientX - rect.left;
		const percentage = (x / rect.width) * 100;
		setSliderPosition(Math.max(0, Math.min(100, percentage)));
	}, []);

	const handleMouseDown = useCallback(() => {
		setIsDragging(true);
	}, []);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) {
				return;
			}
			handleMove(e.clientX);
		},
		[handleMove, isDragging]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!isDragging) {
				return;
			}
			e.preventDefault();
			handleMove(e.touches[0].clientX);
		},
		[handleMove, isDragging]
	);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.addEventListener("touchmove", handleTouchMove, {
				passive: false,
			});
			document.addEventListener("touchend", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

	return (
		<section
			className={cn(
				"relative aspect-square w-full select-none overflow-hidden rounded-2xl",
				className
			)}
			ref={containerRef}
		>
			{/* Before Image (Left) */}
			<div className="absolute inset-0">
				<Image
					alt="Before"
					className="object-cover"
					fill
					priority
					src={beforeImage}
				/>
				<div className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1.5 font-medium text-foreground text-xs backdrop-blur-sm">
					BEFORE
				</div>
			</div>

			{/* After Image (Right) with clip */}
			<div
				className="absolute inset-0"
				style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
			>
				<Image
					alt="After"
					className="object-cover"
					fill
					priority
					src={afterImage}
				/>
				<div className="absolute top-4 right-4 rounded-full bg-primary/90 px-3 py-1.5 font-medium text-primary-foreground text-xs backdrop-blur-sm">
					AFTER
				</div>
			</div>

			{/* Slider Handle */}
			<button
				className="absolute inset-y-0 flex w-1 cursor-ew-resize items-center"
				onMouseDown={handleMouseDown}
				onTouchStart={handleMouseDown}
				style={{ left: `${sliderPosition}%` }}
				type="button"
			>
				{/* Vertical Line */}
				<div className="h-full w-full bg-white shadow-lg" />

				{/* Handle Button */}
				<div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-lg">
					<ChevronLeft className="absolute left-1 size-4 text-primary-foreground" />
					<ChevronRight className="absolute right-1 size-4 text-primary-foreground" />
				</div>
			</button>
		</section>
	);
}
