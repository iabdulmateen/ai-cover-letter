import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Frontend se bheja gaya data read karein
    const body = await request.json();
    
    // 2. Terminal mein print karein (taake humein confirm ho backend chal raha hai)
    console.log("Backend received data:", body);

    // 3. (Day 4 mein yahan OpenAI ka code aayega)

    // 4. Frontend ko success message aur mock data wapas bhejein
    return NextResponse.json({
      success: true,
      message: "Backend connected successfully! AI response will appear here tomorrow.",
      receivedData: body
    });

  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}