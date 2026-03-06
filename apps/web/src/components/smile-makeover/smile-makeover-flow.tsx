"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import { ImageUploadStep } from "./image-upload-step";
import { ImagePreviewStep } from "./image-preview-step";
import { VerificationStep } from "./verification-step";
import { VerificationSuccessStep } from "./verification-success-step";
import { SmileStyleStep } from "./smile-style-step";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import logo from "../../assets/Logo.png";

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
    <div className="flex min-h-full flex-col bg-background ">
      {/* Main Content */}
      <main className="flex flex-1 flex-col ">
        <div className="mx-auto w-full max-w-md flex-1 px-4 py-6">
          <div>
            <Image src={logo} alt="logo" />
          </div>
          <div className="mt-8 text-center">
            <div className="relative ">
              <h1 className="text-[40px] text-primary font-medium">
                Smile On!
              </h1>
              <p className="mt-1 text-[40px] text-[#0D0D0D] font-medium">
                AI Smile Makeover
              </p>
            </div>
          </div>

          <div className="mb-6 flex-1">
            {currentStep === "upload" && (
              <ImageUploadStep onImageSelect={handleImageSelect} />
            )}

            {currentStep === "preview" && selectedImage && (
              <ImagePreviewStep
                imageUrl={selectedImage}
                onRemove={handleImageRemove}
                onConfirm={handleImageConfirm}
                onImageChange={handleImageChange}
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

          <StepIndicator
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            className="mb-6"
          />

          <div className="mt-24">
            <Button
              onClick={handleNext}
              size="lg"
              className="w-full rounded-full cursor-pointer font-semibold text-[16px] "
            >
              {getButtonText()}
              <MoveRight />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
