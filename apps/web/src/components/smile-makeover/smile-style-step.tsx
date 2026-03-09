"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageComparisonSlider } from "./image-comparison-slider";

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
  const [selectedStyle, setSelectedStyle] = useState<string | null>("natural-warmth");
  const [generatedImages, setGeneratedImages] = useState<
    Record<string, string>
  >({});
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateAllImages();
  }, [imageUrl]);

  useEffect(() => {
    if (!isGenerating && generatedImages["natural-warmth"]) {
      onStyleSelect("natural-warmth");
    }
  }, [isGenerating, generatedImages]);

  const generateAllImages = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

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

      // Single API call to generate all 4 styles
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
    if (!selectedStyle || !generatedImages[selectedStyle]) return;

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

  // Show loading screen while generating
  if (isGenerating) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex min-h-100 w-full flex-col items-center justify-center rounded-2xl bg-muted shadow-inner p-6 border-2 border-red-500">
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
    <div className={cn("flex flex-col gap-2 ", className)}>
      {/* Image Comparison */}
      {currentImage ? (
        <ImageComparisonSlider
          beforeImage={imageUrl}
          afterImage={currentImage}
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-muted/30 shadow-inner">
          <p className="text-center text-muted-foreground text-sm">
            Loading your enhanced smile...
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
            disabled={!generatedImages[style.id]}
            className={cn(
              "w-full rounded-xl p-4 text-left transition-all",
              selectedStyle === style.id
                ? "bg-primary/10 border-primary border"
                : "bg-background",
              !generatedImages[style.id] && "cursor-not-allowed opacity-50",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-base">
                  {style.name}
                </h4>
                <p className="mt-1 text-muted-foreground text-sm">
                  {style.description}
                </p>
              </div>
              <div
                className={cn(
                  "ml-3 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  selectedStyle === style.id
                    ? "border-primary bg-primary scale-110"
                    : "border-primary",
                )}
              >
                {selectedStyle === style.id && (
                  <svg
                    className="size-4 text-primary-foreground"
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

      {/* Save Image Button */}
      <button
        onClick={handleDownload}
        disabled={!selectedStyle || !generatedImages[selectedStyle]}
        className={cn(
          "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl p-4 ",
        )}
      >
        <ArrowDown className="size-5" />
        <span className="font-bold text-sm">Save image</span>
      </button>
    </div>
  );
}
