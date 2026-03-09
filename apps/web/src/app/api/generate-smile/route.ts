import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";

const MODEL_NAME = "google/gemini-2.5-flash-image";

export const SMILE_STYLES = [
  {
    id: "natural-warmth",
    name: "Natural Warmth",
    prompt:
      "CRITICAL: Use ONLY the exact person and face from the input image. Do NOT generate a new face. Transform ONLY the teeth. Preserve the exact same person, facial features, skin tone, lighting, background. Only the teeth should change. Edit this image to create a natural, warm smile with visible teeth. IMPORTANT: Fix any broken, missing, or crooked teeth to show a full, healthy, realistic set of teeth. Do not make them overly white, keep them natural looking. Maintain facial structure and lighting.",
    description: "A subtle, friendly enhancement.",
  },
  {
    id: "hollywood-bright",
    name: "Hollywood Bright",
    prompt:
      "CRITICAL: Use ONLY the exact person and face from the input image. Do NOT generate a new face. Transform ONLY the teeth. Preserve the exact same person, facial features, skin tone, lighting, background. Only the teeth should change. Edit this image to create a perfect, bright, wide Hollywood smile. IMPORTANT: Completely reconstruct the teeth to be straight, white, and flawless. Fix any missing teeth or gaps. Ensure the expression reaches the eyes. Maintain high realism.",
    description: "Camera-ready perfection.",
  },
  {
    id: "confident-professional",
    name: "Confident Professional",
    prompt:
      "CRITICAL: Use ONLY the exact person and face from the input image. Do NOT generate a new face. Transform ONLY the teeth. Preserve the exact same person, facial features, skin tone, lighting, background. Only the teeth should change. Edit this image to create a confident, assured smile with visible teeth. IMPORTANT: Ensure a full set of straight, unbroken teeth is visible. Repair any dental imperfections or missing teeth. The expression should be controlled and professional.",
    description: "Assured and trustworthy.",
  },
  {
    id: "radiant-joy",
    name: "Radiant Joy",
    prompt:
      "CRITICAL: Use ONLY the exact person and face from the input image. Do NOT generate a new face. Transform ONLY the teeth. Preserve the exact same person, facial features, skin tone, lighting, background. Only the teeth should change. Edit this image to create a very happy, laughing smile. IMPORTANT: Show a complete, healthy set of teeth with no gaps or damage. Fix any broken teeth. The expression should be candid and joyful. Maintain the person's identity.",
    description: "Full of life and happiness.",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, style, generateAll } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 },
      );
    }

    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const base64Data = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    if (generateAll) {
      const allImages: Record<string, string> = {};
      const errors: string[] = [];

      for (const styleConfig of SMILE_STYLES) {
        try {
          const result = await generateText({
            model: MODEL_NAME,
            prompt: styleConfig.prompt,
            providerOptions: {
              google: {
                referenceImages: [
                  {
                    bytesBase64Encoded: base64Data,
                  },
                ],
              },
            },
          } as any);

          if (result.text) {
            console.log(`${styleConfig.name} response:`, result.text);
          }

          if (result.files && result.files.length > 0) {
            const generatedImage = result.files[0];
            const mimeType = (generatedImage as any).mimeType || "image/png";
            const imageDataUrl = `data:${mimeType};base64,${generatedImage.base64}`;
            allImages[styleConfig.id] = imageDataUrl;
            console.log(`Generated ${styleConfig.name} successfully`);
          } else {
            errors.push(`Failed to generate ${styleConfig.name}`);
          }
        } catch (error) {
          console.error(`Error generating ${styleConfig.name}:`, error);
          errors.push(`Error with ${styleConfig.name}: ${String(error)}`);
        }
      }

      return NextResponse.json({
        success: true,
        images: allImages,
        errors: errors.length > 0 ? errors : undefined,
        message: `Generated ${Object.keys(allImages).length} out of ${SMILE_STYLES.length} images`,
      });
    }

    if (!style) {
      return NextResponse.json(
        { error: "Missing style parameter" },
        { status: 400 },
      );
    }

    const styleConfig = SMILE_STYLES.find((s) => s.id === style);
    if (!styleConfig) {
      return NextResponse.json(
        { error: "Invalid style selected" },
        { status: 400 },
      );
    }

    const result = await generateText({
      model: MODEL_NAME,
      prompt: styleConfig.prompt,
      providerOptions: {
        google: {
          referenceImages: [
            {
              bytesBase64Encoded: base64Data,
            },
          ],
        },
      },
    } as any);

    if (result.text) {
      console.log("Model response:", result.text);
    }

    if (!result.files || result.files.length === 0) {
      return NextResponse.json(
        { error: "No image generated", details: result.text },
        { status: 500 },
      );
    }

    console.log(`Generated ${result.files.length} image(s)`);
    console.log("Usage:", JSON.stringify(result.usage, null, 2));

    const generatedImage = result.files[0];
    const mimeType = (generatedImage as any).mimeType || "image/png";
    const imageDataUrl = `data:${mimeType};base64,${generatedImage.base64}`;

    return NextResponse.json({
      success: true,
      image: imageDataUrl,
      message: "Image enhancement completed",
      usage: result.usage,
    });
  } catch (error) {
    console.error("Error generating smile:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
