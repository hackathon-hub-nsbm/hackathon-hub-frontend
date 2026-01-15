import { NextRequest, NextResponse } from "next/server";
import { findRelevantChunks } from "@/lib/search";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const chunks = await findRelevantChunks(question);
    const context = chunks.map((c: any) => c.content).join("\n\n");

    const contextInfo =
      process.env.NODE_ENV === "development"
        ? `\n\n[Debug: Found ${chunks.length} relevant chunks]`
        : "";

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for Hackathon Hub at NSBM Green University. 
          
Answer questions about the event using the following information:

${context}

Guidelines:
- Be friendly and helpful
- If the question is not related to Hackathon Hub, politely redirect to Hackathon Hub topics
- Provide specific information when available
- If you don't have specific information, suggest they check the website or contact organizers
- Keep responses concise but informative`,
        },
        { role: "user", content: question },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      answer:
        completion.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response. Please try again.",
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json({
      answer:
        "I'm experiencing some technical difficulties right now. For immediate assistance, please check our website or contact the IEEE NSBM organizers directly. IEEE Day 2025 is happening on October 7st, 2025 at NSBM Green University!",
    });
  }
}
