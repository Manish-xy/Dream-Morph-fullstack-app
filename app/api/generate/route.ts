import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

export const POST = async (req: Request) => {
  try {
    const { imageUrl, prompt } = await req.json();

    const imageRes = await fetch(imageUrl);
    const imageBlob = await imageRes.blob();

    const client = await Client.connect("Manishhjj/Dream-Morph");

    const result = await client.predict("/predict", {
      input_image: imageBlob,
      prompt,
    });

    // Type assertion to fix 'unknown' error
    const data = result.data as {
      url: string;
      path: string;
    }[];

    const imgSrc = data?.[0]?.url;

    return NextResponse.json({ image: imgSrc });
  } catch (error) {
    console.error("Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
};
