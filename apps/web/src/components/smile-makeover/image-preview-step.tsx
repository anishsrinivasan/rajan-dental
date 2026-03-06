"use client";

import Image from "next/image";
import { X, ZoomIn, ZoomOut, Pencil } from "lucide-react";
import { useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Button } from "@base-ui/react/button";

interface ImagePreviewStepProps {
  imageUrl: string;
  onRemove: () => void;
  onConfirm: () => void;
  onImageChange: (file: File) => void;
  className?: string;
}

export function ImagePreviewStep({
  imageUrl,
  onRemove,
  onConfirm,
  onImageChange,
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
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Image Preview with Grid Overlay */}
      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-primary p-4">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-cover transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})` }}
          />
          {/* Grid Overlay */}
          <div className="pointer-events-none absolute inset-0">
            <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="20%"
                  height="20%"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 100 0 L 0 0 0 100"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.9"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Remove Button */}
        <Button
          onClick={onRemove}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background shadow-lg transition-colors hover:bg-muted"
          aria-label="Remove image"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex w-full items-center gap-3">
        <Button
          onClick={() => setZoom(Math.max(50, zoom - 10))}
          className="flex size-10 text-primary border-primary shrink-0 items-center justify-center rounded-full border-2 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="size-5 text-primary" />
        </Button>

        <Slider
          min={50}
          max={200}
          step={5}
          value={zoom}
          onValueChange={setZoom}
          className="flex-1"
        />

        <Button
          onClick={() => setZoom(Math.min(200, zoom + 10))}
          className="flex size-10 text-primary border-primary shrink-0 items-center justify-center rounded-full border-2 transition-colors hover:border-primary hover:text-primary"
          aria-label="Zoom in"
        >
          <ZoomIn className="size-5 text-primary" />
        </Button>
      </div>

      <Button
        onClick={() => fileInputRef.current?.click()}
        className="flex w-62.5 items-center justify-center gap-2 rounded-full border-2 py-3 transition-colors border-primary "
      >
        <Pencil className="size-5 text-primary" />
        <span className="font-semibold text-sm text-[#000000]">
          Change image
        </span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="w-full rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="consent"
            className="cursor-pointer italic text-muted-foreground text-xs leading-relaxed"
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
