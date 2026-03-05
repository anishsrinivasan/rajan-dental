"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageComparisonSlider } from "./image-comparison-slider";
import { Button } from "@/components/ui/button";

interface SmileStyle {
	id: string;
	name: string;
	description: string;
}

interface SmileStyleStepProps {
	imageUrl: string;
	onStyleSelect: (styleId: string) => void;
	className?: string;
}

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

export function SmileStyleStep({
	imageUrl,
	onStyleSelect,
	className,
}: SmileStyleStepProps) {
	const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
	const [generatedImage, setGeneratedImage] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleStyleSelect = async (styleId: string) => {
		setSelectedStyle(styleId);
		setError(null);
		setIsGenerating(true);
		onStyleSelect(styleId);

		try {
			// Convert image URL to base64
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const base64 = await new Promise<string>((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			});

			// Call API to generate enhanced image
			const apiResponse = await fetch("/api/generate-smile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageBase64: base64,
					style: styleId,
				}),
			});

			if (!apiResponse.ok) {
				throw new Error("Failed to generate enhanced smile");
			}

			const data = await apiResponse.json();
			
			// Set the generated image
			if (data.image) {
				setGeneratedImage(data.image);
			} else {
				throw new Error("No image returned from API");
			}
		} catch (err) {
			console.error("Error generating smile:", err);
			setError("Failed to generate enhanced smile. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleDownload = async () => {
		if (!generatedImage) return;

		try {
			const response = await fetch(generatedImage);
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

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			{/* Image Comparison or Loading State */}
			{isGenerating ? (
				<div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-primary bg-muted">
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="size-10 animate-spin text-primary" />
						<p className="text-muted-foreground text-sm">
							Generating your enhanced smile...
						</p>
					</div>
				</div>
			) : generatedImage ? (
				<ImageComparisonSlider
					beforeImage={imageUrl}
					afterImage={generatedImage}
				/>
			) : (
				<div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/30">
					<p className="text-center text-muted-foreground text-sm">
						Select a style below to see your enhanced smile
					</p>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="rounded-lg bg-destructive/10 p-3 text-center text-destructive text-xs">
					{error}
				</div>
			)}

			{/* Style Selection */}
			<div className="space-y-3">
				{smileStyles.map((style) => (
					<button
						key={style.id}
						onClick={() => handleStyleSelect(style.id)}
						disabled={isGenerating}
						className={cn(
							"w-full rounded-lg border-2 p-4 text-left transition-all disabled:opacity-50",
							selectedStyle === style.id
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/50"
						)}
					>
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<h4 className="font-semibold text-foreground text-sm">
									{style.name}
								</h4>
								<p className="mt-1 text-muted-foreground text-xs">
									{style.description}
								</p>
							</div>
							<div
								className={cn(
									"ml-3 flex size-5 items-center justify-center rounded-full border-2 transition-colors",
									selectedStyle === style.id
										? "border-primary bg-primary"
										: "border-muted-foreground/30"
								)}
							>
								{selectedStyle === style.id && (
									<svg
										className="size-3 text-primary-foreground"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={3}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								)}
							</div>
						</div>
					</button>
				))}
			</div>

			{/* Download Button */}
			{generatedImage && !isGenerating && (
				<Button
					onClick={handleDownload}
					variant="outline"
					size="lg"
					className="w-full gap-2 rounded-full"
				>
					<Download className="size-4" />
					Save Image
				</Button>
			)}
		</div>
	);
}
