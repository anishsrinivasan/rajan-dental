import { NextRequest, NextResponse } from "next/server";
import { experimental_generateImage as generateImage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const STYLE_PROMPTS = {
	"natural-warmth": `A close-up photo of a person's smile with Natural Warmth enhancement: teeth with subtle natural whitening that maintains authentic tooth color, natural variations and translucency preserved, healthy well-maintained appearance with warm inviting look. Professional dental photography, realistic, natural lighting, front view.`,
	"hollywood-bright": `A close-up photo of a person's smile with Hollywood Bright enhancement: camera-ready brilliant white smile, perfectly aligned uniformly bright teeth, bright luminous white color similar to professional cosmetic dentistry, glamorous red-carpet ready appearance. Professional dental photography, studio lighting, front view.`,
	"confident-professional": `A close-up photo of a person's smile with Confident Professional enhancement: polished professional appearance, clean bright white teeth that convey trustworthiness and competence, well-maintained crisp clean white color, perfect for business settings. Professional dental photography, clean lighting, front view.`,
	"radiant-joy": `A close-up photo of a person's smile with Radiant Joy enhancement: vibrant energetic smile, bright lively white teeth that radiate happiness and vitality, fresh youthful brightness with excellent clarity, joyful life-filled appearance. Professional dental photography, bright natural lighting, front view.`,
};

export async function POST(request: NextRequest) {
	try {
		const { imageBase64, style } = await request.json();

		if (!imageBase64 || !style) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const prompt = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS];
		if (!prompt) {
			return NextResponse.json(
				{ error: "Invalid style selected" },
				{ status: 400 }
			);
		}

		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: "API key not configured" },
				{ status: 500 }
			);
		}

		// Extract base64 data without the data URL prefix
		const base64Data = imageBase64.includes(",")
			? imageBase64.split(",")[1]
			: imageBase64;

		// Create custom provider for Vercel AI Gateway
		const vercel = createOpenAI({
			baseURL: "https://api.vercel.com/v1/ai",
			apiKey: apiKey,
		});

		// Generate enhanced smile image using Vercel AI Gateway
		const { image } = await generateImage({
			model: vercel.image("google/gemini-2.5-flash-image"),
			prompt: `${prompt}\n\nReference image provided. Generate an enhanced version of this exact smile with the specified style improvements while maintaining the person's facial features and natural appearance.`,
			providerOptions: {
				google: {
					referenceImages: [
						{
							bytesBase64Encoded: base64Data,
						},
					],
				},
			},
		});

		// Get the base64 image data
		const imageBase64Result = image.base64;

		return NextResponse.json({
			success: true,
			image: `data:image/png;base64,${imageBase64Result}`,
			message: "Image enhancement completed",
		});
	} catch (error) {
		console.error("Error generating smile:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: String(error) },
			{ status: 500 }
		);
	}
}
