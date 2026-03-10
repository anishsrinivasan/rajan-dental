"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "../../assets/Logo.png";
import { ImagePreviewStep } from "./image-preview-step";
import { ImageUploadStep } from "./image-upload-step";
import { SmileStyleStep } from "./smile-style-step";
import { StepIndicator } from "./step-indicator";
import { VerificationStep } from "./verification-step";
import { VerificationSuccessStep } from "./verification-success-step";

type Step =
  | "upload"
  | "preview"
  | "verify"
  | "verify-success"
  | "style-selection";

export function SmileMakeoverFlow() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const steps: Step[] = [
    "upload",
    "preview",
    "verify",
    "verify-success",
    "style-selection",
  ];
  const currentStepIndex = steps.indexOf(currentStep);

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
    setCurrentStep("verify-success");
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
      case "verify-success":
        setCurrentStep("style-selection");
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
          <div className="shrink-0 px-4 pt-4 pb-2">
            <div className="mb-3">
              <Image alt="logo" className="h-8 w-auto" src={logo} />
            </div>
            <div className="pt-12 text-center">
              <h1 className="font-medium text-3xl text-primary leading-tight">
                Smile On!
              </h1>
              <p className="font-medium text-3xl text-[#0D0D0D] leading-tight">
                AI Smile Makeover
              </p>
            </div>
          </div>

          {/* Component Area */}
          <div className="flex flex-1 items-center justify-center px-4 py-4">
            <div className="w-full">
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
              {currentStep === "verify-success" && <VerificationSuccessStep />}
              {currentStep === "style-selection" && selectedImage && (
                <SmileStyleStep
                  imageUrl={selectedImage}
                  onStyleSelect={handleStyleSelect}
                />
              )}
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="sticky bottom-0 shrink-0 bg-background px-4 py-4">
            <div className="flex flex-col gap-y-4">
              <StepIndicator
                currentStep={currentStepIndex}
                totalSteps={steps.length}
              />
              <Button
                className="w-full cursor-pointer rounded-full bg-primary font-semibold text-[16px]"
                disabled={currentStep === "upload" && !selectedImage}
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
