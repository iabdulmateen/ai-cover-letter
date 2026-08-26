import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, jobRole, skills, jobDescription, tone, length } = body;

    if (!name || !jobRole) {
      return NextResponse.json(
        { success: false, error: "Name and Job Role are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    // Tone aur Length ki instructions
    const toneInstruction = 
      tone === "Casual" ? "Use a friendly, approachable, and relaxed tone while maintaining professionalism." :
      tone === "Enthusiastic" ? "Use a high-energy, passionate, and deeply motivated tone expressing immense excitement." :
      "Use a formal, highly professional, corporate, and polished tone.";

    const lengthInstruction =
      length === "Short" ? "Keep it concise and brief (around 150 words)." :
      length === "Detailed" ? "Make it comprehensive and detailed (around 400 words)." :
      "Keep it standard length (around 250 words).";

    // --- STEP 1: Draft Generation with Job Description Context ---
    const step1Prompt = `
      You are an expert career writer. Write a first-draft cover letter for:
      - Name: ${name}
      - Role: ${jobRole}
      - Skills: ${skills || "Not specified"}
      - Target Job Description/Posting: ${jobDescription || "None provided"}
      - Tone: ${toneInstruction}
      - Length: ${lengthInstruction}

      Instruction: If a Target Job Description is provided above, carefully analyze it, extract key requirements, and weave its specific keywords and company context naturally into the cover letter.
    `;
    const result1 = await model.generateContent(step1Prompt);
    const draft1 = result1.response.text();

    // --- STEP 2: Review and Improve (Pass 2) ---
    const step2Prompt = `
      Review the following cover letter draft. Ensure it deeply aligns with the Target Job Description provided earlier (${jobDescription ? "Job description was provided" : "No job description"}). Improve its professional impact and flow:
      
      DRAFT:
      ${draft1}
    `;
    const result2 = await model.generateContent(step2Prompt);
    const draft2 = result2.response.text();

    // --- STEP 3: Final Polish (Pass 3) ---
    const step3Prompt = `
      Perform a final polish on this cover letter. Ensure absolute grammatical perfection, strong closing hooks, and strict adherence to the requested tone (${tone}) and length (${length}). Return ONLY the final polished letter text without meta-commentary:
      
      CURRENT DRAFT:
      ${draft2}
    `;
    const result3 = await model.generateContent(step3Prompt);
    const finalLetter = result3.response.text();

    return NextResponse.json({ success: true, data: finalLetter });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate cover letter.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}