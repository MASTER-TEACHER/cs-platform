import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { TutorResponse, TutorStudentContext } from "@/types/studentTutor";

type Body = {
  studentId: string;
  message: string;
  history: { role: "student" | "assistant"; content: string }[];
  context: TutorStudentContext;
};
const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");
function demo(body: Body, warning?: string): TutorResponse {
  const c = body.context;
  const first = c.name.split(" ")[0] || "Student";
  const topic =
    c.priorityTopics[0]?.topic ||
    c.recommendedActions[0]?.topic ||
    "Computer Science";
  const m = body.message.toLowerCase();
  let reply = "";
  if (/^(hi|hello|hey)/.test(m))
    reply = `Hi ${first}. Your combined average is ${c.combinedAverage}% and your predicted grade is ${c.predictedGrade}. ${c.priorityTopics.length ? `Your main priority is ${topic}.` : "You have no high-priority topic currently."} What would you like help with?`;
  else if (/revision plan|study plan|what should i revise/.test(m))
    reply = `Here is a focused plan for ${topic}:

1. Review the core lesson for 10 minutes.
2. Write three facts from memory.
3. Complete a short retrieval quiz.
4. Attempt one exam-style question.
5. Compare your answer with the mark scheme.

Aim for 25-30 minutes.`;
  else if (/predicted grade|what grade/.test(m))
    reply = `Your current platform estimate is grade ${c.currentGrade}, with a predicted grade of ${c.predictedGrade}. This is not an official or guaranteed exam-board prediction.`;
  else
    reply = `Let us work through that, ${first}. Start by telling me what you already know or the exact step that is confusing. Use this structure: definition -> process -> example -> exam wording. Your current priority topic is ${topic}, so I will connect the explanation to it when relevant.`;
  return {
    reply,
    mode: "demo",
    suggestedPrompts: [
      `Explain ${topic} simply`,
      `Quiz me on ${topic}`,
      "Create a 25-minute revision plan",
      "How can I reach the next grade?",
    ],
    recommendations: c.recommendedActions.slice(0, 3).map((a) => ({
      title: a.title,
      description: a.description,
      href: a.href,
      type: a.type,
    })),
    warning,
  };
}
function prompt(body: Body) {
  return `You are CS Master, a supportive UK secondary Computer Science tutor.
Student context:
${JSON.stringify(body.context, null, 2)}
Recent conversation:
${JSON.stringify(body.history.slice(-8), null, 2)}
Student message:
${body.message}
Use clear UK English. Teach through explanation and checking questions. Do not give unexplained answers to assessed work. Never claim predicted grades are official. Keep under 350 words. Return JSON only: {"reply":"string","suggestedPrompts":["string"],"recommendations":[{"title":"string","description":"string","href":"string","type":"lesson|quiz|exam"}]}`;
}
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body?.studentId || !clean(body.message) || !body.context)
      return NextResponse.json(
        { error: "A valid tutor request is required." },
        { status: 400 },
      );
    if (process.env.AI_STUDENT_TUTOR_DEMO_MODE === "true")
      return NextResponse.json(demo(body, "Demo tutor mode is enabled."));
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        {
          error:
            "AI Tutor is temporarily unavailable because live AI is not configured.",
        },
        { status: 503 },
      );
    }
    try {
      const client = new OpenAI({ apiKey: key });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_STUDENT_TUTOR_MODEL || "gpt-4.1-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a careful UK secondary Computer Science tutor. Return valid JSON only.",
          },
          { role: "user", content: prompt(body) },
        ],
      });
      const text = completion.choices[0]?.message.content;
      if (!text) throw new Error("No tutor response.");
      const p = JSON.parse(text);
      return NextResponse.json({
        reply: clean(p.reply),
        mode: "live",
        suggestedPrompts: Array.isArray(p.suggestedPrompts)
          ? p.suggestedPrompts.slice(0, 4)
          : [],
        recommendations: Array.isArray(p.recommendations)
          ? p.recommendations.slice(0, 3)
          : [],
      });
    } catch (e) {
      console.error("Live tutor unavailable:", e);
      return NextResponse.json(
        {
          error:
            "AI Tutor is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }
  } catch (e) {
    console.error("Tutor route error:", e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "The tutor could not respond.",
      },
      { status: 500 },
    );
  }
}
