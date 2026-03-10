"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadStepProps {
	className?: string;
	onImageSelect: (file: File) => void;
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
					"relative flex h-64 w-75 flex-col items-center justify-center gap-4 rounded-xl border border-primary/50 p-8 transition-colors"
				)}
				onClick={() => fileInputRef.current?.click()}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<div className="flex size-16 items-center justify-center">
					<Upload className="size-8 text-primary" />
				</div>

				<div className="text-center">
					<p className="font-medium text-[#5D5D5D] text-[20px]">
						Upload a Clear Front- <br /> Facing Photo
					</p>
				</div>

				<input
					accept="image/*"
					className="hidden"
					onChange={handleFileSelect}
					ref={fileInputRef}
					type="file"
				/>
			</div>

			<p className="text-center font-medium text-[#929292] text-[15px] italic">
				Make sure your face is clearly visible for <br /> accurate smile
				preview.
			</p>
		</div>
	);
}
