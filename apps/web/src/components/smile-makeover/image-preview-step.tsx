"use client";

import { Button } from "@base-ui/react/button";
import { PencilLine, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { ImagePreviewStepProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ImagePreviewStep({
	imageUrl,
	onRemove,
	onImageChange,
	onConsentChange,
	className,
}: ImagePreviewStepProps) {
	const [zoom, setZoom] = useState(100);
	const [isChecked, setIsChecked] = useState(true);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onImageChange(file);
		}
	};

	return (
		<div className={cn("flex flex-col items-center gap-4", className)}>
			{/* Image Preview with Grid Overlay */}
			<div className="relative w-full overflow-hidden rounded-2xl border-2 border-primary p-4">
				<div className="relative aspect-square w-full overflow-hidden">
					<Image
						alt="Preview"
						className="rounded-lg border border-primary object-cover transition-transform duration-200"
						fill
						src={imageUrl}
						style={{ transform: `scale(${zoom / 100})` }}
					/>
					{/* Grid Overlay */}
					<div className="pointer-events-none absolute inset-0">
						<svg
							aria-hidden="true"
							className="size-full"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<pattern
									height="20%"
									id="grid"
									patternUnits="userSpaceOnUse"
									width="20%"
								>
									<path
										d="M 100 0 L 0 0 0 100"
										fill="none"
										opacity="0.9"
										stroke="white"
										strokeDasharray="4,4"
										strokeWidth="1"
									/>
								</pattern>
							</defs>
							<rect fill="url(#grid)" height="100%" width="100%" />
						</svg>
					</div>
				</div>

				{/* Remove Button */}
				<Button
					aria-label="Remove image"
					className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background shadow-lg transition-colors hover:bg-muted"
					onClick={onRemove}
				>
					<X className="size-4" />
				</Button>
			</div>

			{/* Zoom Controls */}
			<div className="flex w-full items-center gap-x-3">
				<Button
					aria-label="Zoom out"
					className="flex size-10 shrink-0 items-center justify-center border-primary text-primary transition-colors"
					onClick={() => setZoom(Math.max(50, zoom - 10))}
				>
					<ZoomOut className="size-9 text-primary" />
				</Button>

				<Slider
					className="flex-1 bg-[#E6E6E6]"
					max={200}
					min={50}
					onValueChange={setZoom}
					step={5}
					value={zoom}
				/>

				<Button
					aria-label="Zoom in"
					className="flex size-10 shrink-0 items-center justify-center border-primary text-primary transition-colors"
					onClick={() => setZoom(Math.min(200, zoom + 10))}
				>
					<ZoomIn className="size-9 text-primary" />
				</Button>
			</div>

			<Button
				className="flex w-62.5 items-center justify-center gap-2 rounded-full border border-primary py-3 transition-colors"
				onClick={() => fileInputRef.current?.click()}
			>
				<PencilLine className="size-5 text-primary" />
				<span className="font-semibold text-[#000000] text-sm">
					Change image
				</span>
			</Button>

			<input
				accept="image/*"
				className="hidden"
				onChange={handleFileSelect}
				ref={fileInputRef}
				type="file"
			/>

			<div className="w-full rounded-lg px-4">
				<div className="flex items-start gap-3">
					<Checkbox
						checked={isChecked}
						className="mt-0.5 size-5 rounded-md border border-primary p-3 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
						id="consent"
						onCheckedChange={(checked) => {
							const value = checked === true;
							setIsChecked(value);
							onConsentChange?.(value);
						}}
					/>
					<label
						className="cursor-pointer text-[10px] text-muted-foreground italic leading-relaxed"
						htmlFor="consent"
					>
						I confirm that I have the necessary rights and permissions to upload
						this image and that it does not contain unauthorized personal or
						copyrighted content. I accept responsibility for all uploaded
						content.
					</label>
				</div>
			</div>
		</div>
	);
}
