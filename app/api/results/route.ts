import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		const {
			uploadedImage,
			outputImage,
			prompt,
			roomStyle,
			aiStyle,
			userName,
			userImage,
		} = body as {
			uploadedImage: string | null;
			outputImage: string | null;
			prompt: string | null;
			roomStyle?: string | null;
			aiStyle?: string | null;
			userName?: string | null;
			userImage?: string | null;
		};

		// Basic validation
		if (!uploadedImage || !outputImage) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}


		const savedResult = await db.generateRoom.create({
			data: {
				userId,
				userName: userName ?? "Unknown User",
				userImage: userImage ?? "/assets/img/avatar.jpg",
				roomStyle: roomStyle ?? "Default",
				aiStyle: aiStyle ?? "Default",
				prompt: prompt || "Room design enhancement",
				uploadedImage,
				outputImage,
			},
		});


		return NextResponse.json({ success: true, data: savedResult }, { status: 201 });
	} catch (error) {
		console.error("Save API error:", error);
		return NextResponse.json(
			{ error: "Failed to save result" },
			{ status: 500 }
		);
	}
}

