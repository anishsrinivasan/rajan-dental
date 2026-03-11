export type Step = "upload" | "preview" | "verify" | "style-selection";

export interface ImageComparisonSliderProps {
	afterImage: string;
	beforeImage: string;
	className?: string;
}

export interface ImagePreviewStepProps {
	className?: string;
	imageUrl: string;
	onConfirm: () => void;
	onConsentChange?: (checked: boolean) => void;
	onImageChange: (file: File) => void;
	onRemove: () => void;
}

export interface SmileStyle {
	description: string;
	id: string;
	name: string;
}

export interface SmileStyleStepProps {
	className?: string;
	imageUrl: string;
	onLoadingChange?: (loading: boolean) => void;
	onStyleSelect: (styleId: string) => void;
}

export interface StepIndicatorProps {
	className?: string;
	currentStep: number;
	totalSteps: number;
}

export interface VerificationStepProps {
	className?: string;
	onGoogleVerify: () => void;
}

export interface VerificationSuccessStepProps {
	className?: string;
}

export interface SmileStyleStepRef {
	download: () => void;
}
