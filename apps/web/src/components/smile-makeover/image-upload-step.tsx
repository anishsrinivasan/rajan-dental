"use client";

import { Upload } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadStepProps {
	onImageSelect: (file: File) => void;
	className?: string;
}

export function ImageUploadStep({
	onImageSelect,
	className,
}: ImageUploadStepProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			onImageSelect(file);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onImageSelect(file);
		}
	};

	return (
		<div className={cn("flex flex-col items-center gap-6", className)}>
			<div
				className={cn(
					"relative flex w-full flex-col items-center justify-center gap-4 rounded-xl border h-48 p-8 border-primary/50 transition-colors",
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
			>
				<div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
					<Upload className="size-8 text-primary" />
				</div>

				<div className="text-center">
					<p className="font-medium text-[#5D5D5D] text-[20px]">
						Upload a Clear Front-Facing Photo
					</p>
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileSelect}
				/>
			</div>

			<p className="text-center text-[15px] font-medium italic text-[#929292]">
				Make sure your face is clearly visible for <br/> accurate smile preview.
			</p>
		</div>
	);
}
