"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { SmileStyleStepRef, Step } from "@/lib/types";
import { cn } from "@/lib/utils";
import logo from "../../assets/Logo.png";
import { ImagePreviewStep } from "./image-preview-step";
import { ImageUploadStep } from "./image-upload-step";
import { SmileStyleStep } from "./smile-style-step";
import { StepIndicator } from "./step-indicator";
import { VerificationStep } from "./verification-step";

export function SmileMakeoverFlow() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isStyleStepLoading, setIsStyleStepLoading] = useState<boolean>(true);
  const smileStyleStepRef = useRef<SmileStyleStepRef>(null);

  const steps: Step[] = ["upload", "preview", "verify", "style-selection"];
  const currentStepIndex = steps.indexOf(currentStep);

  useEffect(() => {
    if (currentStep !== "style-selection") {
      setIsStyleStepLoading(false);
    }
  }, [currentStep]);

  const handleImageSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    setCurrentStep("preview");
  };

  const handleImageRemove = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setCurrentStep("upload");
  };

  const handleImageChange = (file: File) => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
  };

  const handleImageConfirm = () => {
    setCurrentStep("verify");
  };

  const handleGoogleVerify = () => {
    setIsStyleStepLoading(true);
    setCurrentStep("style-selection");
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleBookConsultation = () => {
    console.log("Booking consultation with style:", selectedStyle);
  };

  const handleNext = () => {
    switch (currentStep) {
      case "preview":
        handleImageConfirm();
        break;
      case "style-selection":
        handleBookConsultation();
        break;
      case "verify":
        handleGoogleVerify();
        break;
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case "preview":
        return "Next";
      case "style-selection":
        return "Book a consultation";
      default:
        return "Next";
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-y-auto bg-background">
      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
          {/* Header */}
          <div className="shrink-0 px-4 pt-3 pb-1">
            <div className="mb-1">
              <Image alt="logo" className="h-8 w-auto" src={logo} />
            </div>
            <div className="pt-5 text-center">
              <h1 className="font-medium text-3xl text-primary leading-tight">
                Smile On!
              </h1>
              <p className="font-medium text-3xl text-[#0D0D0D] leading-tight">
                AI Smile Makeover
              </p>
            </div>
          </div>

          {/* Component Area - items-start on style-selection to reduce vertical space on mobile */}
          <div
            className={cn(
              "flex flex-1 px-4 py-2",
              currentStep === "style-selection" && !isStyleStepLoading
                ? "min-h-0 items-start justify-center"
                : "items-center justify-center",
            )}
          >
            <div className="w-full min-w-0">
              {currentStep === "upload" && (
                <ImageUploadStep onImageSelect={handleImageSelect} />
              )}
              {currentStep === "preview" && selectedImage && (
                <ImagePreviewStep
                  imageUrl={selectedImage}
                  onConfirm={handleImageConfirm}
                  onImageChange={handleImageChange}
                  onRemove={handleImageRemove}
                />
              )}
              {currentStep === "verify" && (
                <VerificationStep onGoogleVerify={handleGoogleVerify} />
              )}
              {currentStep === "style-selection" && selectedImage && (
                <SmileStyleStep
                  imageUrl={selectedImage}
                  onLoadingChange={setIsStyleStepLoading}
                  onStyleSelect={handleStyleSelect}
                  ref={smileStyleStepRef}
                />
              )}
            </div>
          </div>

          {/* Sticky bottom: Save image (style step only), stepper, CTA */}
          <div className="sticky bottom-0 shrink-0 bg-background px-4 py-2">
            <div className="flex flex-col gap-y-2">
              {currentStep === "style-selection" && !isStyleStepLoading && (
                <Button
                  className="w-full cursor-pointer justify-center gap-2 rounded-none border-0 bg-transparent p-0 py-1 font-bold text-foreground text-sm shadow-none hover:bg-transparent hover:opacity-80"
                  onClick={() => smileStyleStepRef.current?.download()}
                  variant="ghost"
                >
                  <ArrowDown className="size-5" />
                  <span>Save image</span>
                </Button>
              )}
              <StepIndicator
                currentStep={currentStepIndex}
                totalSteps={steps.length}
              />
              <Button
                className="w-full cursor-pointer rounded-full bg-primary font-semibold text-[16px]"
                disabled={
                  (currentStep === "upload" && !selectedImage) ||
                  (currentStep === "style-selection" && isStyleStepLoading)
                }
                onClick={handleNext}
                size="lg"
              >
                {getButtonText()}
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
