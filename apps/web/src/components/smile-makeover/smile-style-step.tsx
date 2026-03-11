"use client";

import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
	SmileStyle,
	SmileStyleStepProps,
	SmileStyleStepRef,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { ImageComparisonSlider } from "./image-comparison-slider";

const smileStyles: SmileStyle[] = [
	{
		id: "natural-warmth",
		name: "Natural Warmth",
		description: "A subtle enhancement",
	},
	{
		id: "hollywood-bright",
		name: "Hollywood Bright",
		description: "Camera-ready Perfection",
	},
	{
		id: "confident-professional",
		name: "Confident Professional",
		description: "Assured and trustworthy",
	},
	{
		id: "radiant-joy",
		name: "Radiant Joy",
		description: "Full of life and happiness",
	},
];

const SmileStyleStepComponent = forwardRef<
	SmileStyleStepRef,
	SmileStyleStepProps
>(function SmileStyleStep(
	{ imageUrl, onLoadingChange, onStyleSelect, className },
	ref
) {
	const [selectedStyle, setSelectedStyle] = useState<string | null>(
		"natural-warmth"
	);
	const [generatedImages, setGeneratedImages] = useState<
		Record<string, string>
	>({});
	const [isGenerating, setIsGenerating] = useState(true);
	const [generationProgress, setGenerationProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [showConfetti, setShowConfetti] = useState(false);

	useEffect(() => {
		generateAllImages();
	}, [imageUrl]);

	useEffect(() => {
		onLoadingChange?.(isGenerating);
	}, [isGenerating, onLoadingChange]);

	useEffect(() => {
		if (!isGenerating && generatedImages["natural-warmth"]) {
			onStyleSelect("natural-warmth");
		}
	}, [isGenerating, generatedImages, onStyleSelect]);

	useEffect(() => {
		if (!showConfetti) {
			return;
		}
		confetti({
			particleCount: 400,
			spread: 90,
			origin: { x: 0.5, y: 0.5 },
			angle: 90,
			startVelocity: 30,
			gravity: 0.5,
			drift: 0,
			ticks: 300,
		});
		const t = setTimeout(() => setShowConfetti(false), 400);
		return () => clearTimeout(t);
	}, [showConfetti]);

	const generateAllImages = async () => {
		setIsGenerating(true);
		setError(null);
		setGenerationProgress(0);

		try {
			const progressInterval = setInterval(() => {
				setGenerationProgress((prev) => {
					if (prev >= 85) {
						clearInterval(progressInterval);
						return 85;
					}
					const increment = Math.floor(Math.random() * 4) + 2;
					return Math.min(prev + increment, 85);
				});
			}, 300);

			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const base64 = await new Promise<string>((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			});

			const apiResponse = await fetch("/api/generate-smile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageBase64: base64,
					generateAll: true,
				}),
			});

			clearInterval(progressInterval);

			if (!apiResponse.ok) {
				throw new Error("Failed to generate enhanced smiles");
			}

			const data = await apiResponse.json();

			if (data.images) {
				setGenerationProgress(95);
				setTimeout(() => setGenerationProgress(100), 200);
				setGeneratedImages(data.images);
				setShowConfetti(true);

				if (data.errors && data.errors.length > 0) {
					console.warn("Some images failed to generate:", data.errors);
				}
			} else {
				throw new Error("No images returned from API");
			}
		} catch (err) {
			console.error("Error generating images:", err);
			setError("Failed to generate enhanced smiles. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleStyleSelect = (styleId: string) => {
		setSelectedStyle(styleId);
		onStyleSelect(styleId);
	};

	const handleDownload = async () => {
		if (!(selectedStyle && generatedImages[selectedStyle])) {
			return;
		}
		try {
			const imageToDownload = generatedImages[selectedStyle];
			const response = await fetch(imageToDownload);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `smile-makeover-${selectedStyle}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Error downloading image:", err);
		}
	};

	useImperativeHandle(ref, () => ({ download: handleDownload }), [
		handleDownload,
	]);

	// Show loading screen while generating
	if (isGenerating) {
		return (
			<div className={cn("flex flex-col gap-6", className)}>
				<div className="flex aspect-square min-h-100 flex-col items-center justify-center rounded-2xl bg-muted p-6 shadow-inner">
					<div className="flex flex-col items-center gap-4">
						<Loader2 className="size-12 animate-spin text-primary" />
						<div className="text-center">
							<h3 className="font-semibold text-foreground text-lg">
								Creating Your Smile Transformations
							</h3>
							<p className="mt-2 text-muted-foreground text-sm">
								Generating 4 unique smile styles for you...
							</p>
						</div>
						{/* Progress Bar */}
						<div className="mt-4 w-full max-w-xs">
							<div className="h-2 w-full overflow-hidden rounded-full bg-muted-foreground/20">
								<div
									className="h-full bg-primary transition-all duration-500"
									style={{ width: `${generationProgress}%` }}
								/>
							</div>
							<p className="mt-2 text-center text-muted-foreground text-xs">
								{Math.round(generationProgress)}% complete
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const currentImage = selectedStyle ? generatedImages[selectedStyle] : null;

	return (
		<div
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-1 overflow-hidden",
				className
			)}
		>
			{/* Image Comparison - max height on mobile to reduce overall screen height */}
			{currentImage ? (
				<div className="relative shrink-0 overflow-hidden rounded-2xl">
					<ImageComparisonSlider
						afterImage={currentImage}
						beforeImage={imageUrl}
						className="aspect-square max-h-[38vh] w-full"
					/>
				</div>
			) : (
				<div className="flex aspect-square w-full shrink-0 items-center justify-center rounded-2xl bg-muted/30 shadow-inner">
					<p className="text-center text-muted-foreground text-sm">
						Loading your enhanced smile...
					</p>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="shrink-0 space-y-2 rounded-lg bg-destructive/10 p-3 text-center text-destructive text-xs">
					<p>{error}</p>
					<Button
						className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground text-xs hover:opacity-90"
						onClick={() => generateAllImages()}
						type="button"
					>
						Try again
					</Button>
				</div>
			)}

			{/* Style Selection - Scrollable (radio-style options) */}
			<div className="min-h-0 flex-1">
				<div className="space-y-2 p-0.5">
					{smileStyles.map((style) => (
						<Button
							className={cn(
								"h-auto w-full justify-start rounded-xl p-3 text-left transition-all",
								selectedStyle === style.id
									? "border border-primary bg-primary/10"
									: "bg-background",
								!generatedImages[style.id] && "cursor-not-allowed opacity-50"
							)}
							disabled={!generatedImages[style.id]}
							haptic="success"
							key={style.id}
							onClick={() => handleStyleSelect(style.id)}
							variant="ghost"
						>
							<div className="flex w-full items-center justify-between">
								<div className="min-w-0 flex-1">
									<h4 className="font-semibold text-base text-foreground">
										{style.name}
									</h4>
									<p className="mt-1 text-muted-foreground text-sm">
										{style.description}
									</p>
								</div>
								<div
									className={cn(
										"ml-3 flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all",
										selectedStyle === style.id
											? "border-primary bg-primary"
											: "border-primary bg-transparent"
									)}
								>
									{selectedStyle === style.id && (
										<svg
											className="size-4 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												d="M5 13l4 4L19 7"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={3}
											/>
										</svg>
									)}
								</div>
							</div>
						</Button>
					))}
				</div>
			</div>
		</div>
	);
});
SmileStyleStepComponent.displayName = "SmileStyleStep";

export const SmileStyleStep = SmileStyleStepComponent;
