import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobTitle, company, hiringManager, jobDescription, applicantName, email, yearsExp, background, skills, tone, length, opening } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "GEMINI_API_KEY is missing in environment variables." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = "gemini-3.6-flash";

    const prompt = `
You are an elite executive career strategist and master copywriter. Execute a rigorous 3-stage internal refinement process to produce an exceptional, hyper-targeted cover letter for ${company}.

STAGE 1 (Drafting): Establish a robust formal structure for the role of ${jobTitle}, incorporating applicant background (${background}) and key skills (${skills}).
STAGE 2 (Targeting): Refine the content to strictly adhere to a "${tone}" tone, a "${length}" length, and the "${opening}" opening style, ensuring deep alignment with ${company} using this job description: ${jobDescription || "Standard requirements"}.
STAGE 3 (Polishing): Eliminate all robotic clichés, corporate fluff, and grammatical awkwardness. Ensure it reads as if written by a top-tier human professional.

CRITICAL: Return ONLY the final polished cover letter text. No introductory remarks, no stage breakdowns, no markdown wrapping other than the letter itself.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const finalLetter = response.text || "";

    return NextResponse.json({ success: true, data: finalLetter });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate cover letter.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}