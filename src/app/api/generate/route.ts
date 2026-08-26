import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Gemini ko initialize karein environment variable ke zariye
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, jobRole, skills } = body;

    // Basic Validation
    if (!name || !jobRole || !skills) {
      return NextResponse.json(
        { error: "Please fill in all fields (Name, Role, Skills)" },
        { status: 400 }
      );
    }

    // AI Prompt Setup (You can tweak this later to practice prompt engineering)
    const prompt = `You are an expert career coach. Write a professional, concise, and modern cover letter for ${name}, who is applying for the position of ${jobRole}. Highlight the following key skills: ${skills}. Do not include placeholder brackets like [Company Name] if it's not provided, just write a general but impactful letter.`;

    // 2. Select Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    // 3. Send request to Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    // 4. Send the result back to frontend
    return NextResponse.json({
      success: true,
      data: generatedText,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter with AI." },
      { status: 500 }
    );
  }
}