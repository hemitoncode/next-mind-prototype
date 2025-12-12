import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/core-objective
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { context, meta } = body;

    if (!context || typeof context !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'context' field." },
        { status: 400 }
      );
    }

    // SYSTEM INSTRUCTIONS — locked to OBJECTIVE ONLY
    const systemPrompt = `
You are an AI that produces ONLY objective, non-interpretive, non-personal factual summaries.

Rules:
- No opinions
- No advice
- No reflection
- No evaluation
- No next steps
- No embellishment
- No emotional tone
- Do NOT reference the user
- Do NOT speak in first person
- Keep it concise, factual, and neutral
- Focus *strictly* on the context provided

Output must be plain text only.
    `;

    const userPrompt = `
Context from user:

"${context}"

Produce OBJECTIVE-ONLY information derived from this context — concise, factual bullet points are preferred.
    `;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini", // or use "gpt-4.1" / "gpt-5.1" if you want higher quality
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_output_tokens: 300,
    });

    const output =
      completion.output_text ||
      "No objective information could be generated.";

    return NextResponse.json({ output });
  } catch (err) {
    console.error("CORE Objective API error:", err);
    return NextResponse.json(
      { error: "Server error while generating objective output." },
      { status: 500 }
    );
  }
}

