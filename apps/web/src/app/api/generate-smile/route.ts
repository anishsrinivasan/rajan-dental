import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";

const STYLE_PROMPTS = {
  "natural-warmth": `Create a detailed close-up photo of a person's smile with Natural Warmth enhancement: teeth with subtle natural whitening that maintains authentic tooth color, natural variations and translucency preserved, healthy well-maintained appearance with warm inviting look. Professional dental photography, realistic, natural lighting, front view. The smile should look natural and approachable.`,

  "hollywood-bright": `Create a detailed close-up photo of a person's smile with Hollywood Bright enhancement: camera-ready brilliant white smile, perfectly aligned uniformly bright teeth, bright luminous white color similar to professional cosmetic dentistry, glamorous red-carpet ready appearance. Professional dental photography, studio lighting, front view. The smile should be dazzling and perfect.`,

  "confident-professional": `Create a detailed close-up photo of a person's smile with Confident Professional enhancement: polished professional appearance, clean bright white teeth that convey trustworthiness and competence, well-maintained crisp clean white color, perfect for business settings. Professional dental photography, clean lighting, front view. The smile should be confident and trustworthy.`,

  "radiant-joy": `Create a detailed close-up photo of a person's smile with Radiant Joy enhancement: vibrant energetic smile, bright lively white teeth that radiate happiness and vitality, fresh youthful brightness with excellent clarity, joyful life-filled appearance. Professional dental photography, bright natural lighting, front view. The smile should be full of energy and joy.`,
};

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, style } = await request.json();

    if (!imageBase64 || !style) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const prompt = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS];
    if (!prompt) {
      return NextResponse.json(
        { error: "Invalid style selected" },
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

    const result = await generateText({
      model: "google/gemini-2.5-flash-image",
      prompt: `${prompt}\n\nBased on the reference image provided, generate an enhanced version of this smile with the specified style improvements while maintaining the person's facial features and natural appearance.`,
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
