import { GoogleGenAI } from "@google/genai";
import { type NextRequest, NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-image";

export const SMILE_STYLES = [
  {
    id: "natural-warmth",
    name: "Natural Warmth",
    prompt:
      "Edit this image to create a natural, warm smile with visible teeth. IMPORTANT: Fix any broken, missing, or crooked teeth to show a full, healthy, realistic set of teeth. Do not make them overly white, keep them natural looking. Maintain facial structure and lighting.",
    description: "A subtle, friendly enhancement.",
  },
  {
    id: "hollywood-bright",
    name: "Hollywood Bright",
    prompt:
      "Edit this image to create a perfect, bright, wide Hollywood smile. IMPORTANT: Completely reconstruct the teeth to be straight, white, and flawless. Fix any missing teeth or gaps. Ensure the expression reaches the eyes. Maintain high realism.",
    description: "Camera-ready perfection.",
  },
  {
    id: "confident-professional",
    name: "Confident Professional",
    prompt:
      "Edit this image to create a confident, assured smile with visible teeth. IMPORTANT: Ensure a full set of straight, unbroken teeth is visible. Repair any dental imperfections or missing teeth. The expression should be controlled and professional.",
    description: "Assured and trustworthy.",
  },
  {
    id: "radiant-joy",
    name: "Radiant Joy",
    prompt:
      "Edit this image to create a very happy, laughing smile. IMPORTANT: Show a complete, healthy set of teeth with no gaps or damage. Fix any broken teeth. The expression should be candid and joyful. Maintain the person's identity.",
    description: "Full of life and happiness.",
  },
];

const generateSmileMakeover = async (
  ai: GoogleGenAI,
  base64Image: string,
  styleConfig: (typeof SMILE_STYLES)[0],
): Promise<string> => {
  try {
    const cleanBase64 = base64Image.replace(
      /^data:image\/(png|jpeg|jpg|webp);base64,/,
      "",
    );

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: styleConfig.prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const generateAllStyles = async (
  ai: GoogleGenAI,
  base64Image: string,
): Promise<Record<string, string>> => {
  const promises = SMILE_STYLES.map(async (style) => {
    try {
      const result = await generateSmileMakeover(ai, base64Image, style);
      return { id: style.id, image: result };
    } catch (e) {
      console.error(`Failed to generate style ${style.name}`, e);
      return { id: style.id, image: null };
    }
  });

  const results = await Promise.all(promises);
  const resultMap: Record<string, string> = {};
  results.forEach((r) => {
    if (r.image) {
      resultMap[r.id] = r.image;
    }
  });

  return resultMap;
};

const MAX_BASE64_LENGTH = 6 * 1024 * 1024; // ~6MB base64

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, style, generateAll } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 },
      );
    }

    if (
      typeof imageBase64 === "string" &&
      imageBase64.length > MAX_BASE64_LENGTH
    ) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    if (generateAll) {
      const allImages = await generateAllStyles(ai, imageBase64);
      const errors: string[] = [];

      SMILE_STYLES.forEach((style) => {
        if (!allImages[style.id]) {
          errors.push(`Failed to generate ${style.name}`);
        }
      });

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

    const imageDataUrl = await generateSmileMakeover(
      ai,
      imageBase64,
      styleConfig,
    );

    return NextResponse.json({
      success: true,
      image: imageDataUrl,
      message: "Image enhancement completed",
    });
  } catch (error) {
    console.error("Error generating smile:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
