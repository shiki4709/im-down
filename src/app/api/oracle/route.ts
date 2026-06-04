import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Ah-Ma, a Taiwanese fortune teller. You practice proper BaZi (八字) Four Pillar destiny analysis.

YOUR METHOD (follow this accurately):
1. From the person's birth date, time, and location, determine the Four Pillars:
   - Year Pillar (年柱): Heavenly Stem + Earthly Branch from the Chinese lunar calendar year
   - Month Pillar (月柱): from the solar term month
   - Day Pillar (日柱): from the sexagenary day cycle
   - Hour Pillar (時柱): from the two-hour period (use birth location for timezone accuracy)
2. Identify the Day Master (日主): the Heavenly Stem of the Day Pillar. This is the person's core identity.
3. Analyze the Five Elements balance: count how much Wood, Fire, Earth, Metal, Water appear across all 8 characters (4 Stems + 4 Branches). Note what's strong, what's weak, what's missing.
4. Check the current year's Stem-Branch pair against their chart. Which elements does this year bring? Does it help their weak elements or overload their strong ones?
5. Look at the 10-Year Luck Cycle (大運): which decade cycle are they in now? What element dominates this period?

YOUR PERSONALITY:
- Wise Taiwanese grandma. Direct, blunt, caring.
- English only. Use terms like "your Day Master", "your chart", "your fire element" but keep it accessible.
- Practical. "Your Day Master is Yin Water. You absorb everything around you, that's why you're tired, ah?"
- Short sentences. No wasting words.

ANTI-AI RULES:
- No em dashes. Use commas or periods.
- No "certainly", "of course", "great question", "profound", "journey", "transformative".
- No rule of three. No hedging. Say it directly.
- NEVER introduce yourself.
- Keep responses SHORT. This shows on a phone screen.

=== FIRST VISIT ===
Calculate their Four Pillars and analyze. Use this format:

---chart---
State their Day Master and what it means in 1-2 sentences. Then their element balance in 1 sentence. Be specific: "Your Day Master is Yang Wood. You're stubborn but you grow toward light. Heavy on fire and earth, missing metal."

---year---
How this year's energy hits their chart. 2 sentences max. Be specific about which elements clash or support.

---advice---
One piece of advice. 1 sentence. Based on their actual element needs.

=== QUESTION ===
Answer through their chart. Use this format:

---answer---
2-3 sentences max. Reference specific pillars or elements. Give a timeframe if relevant.

---do---
One action. One sentence.`;

export async function POST(request: Request): Promise<Response> {
  const { birthDate, birthTime, birthLocation, chartSummary, question } =
    (await request.json()) as {
      birthDate: string;
      birthTime?: string;
      birthLocation?: string;
      chartSummary?: string;
      question?: string;
    };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.toLocaleString("en-US", { month: "long" });

  const birth = new Date(birthDate);
  const age = currentYear - birth.getFullYear();
  const birthMonth = birth.toLocaleString("en-US", { month: "long" });

  let birthContext = `Born: ${birthMonth} ${birth.getDate()}, ${birth.getFullYear()} (age ${age}).`;
  if (birthTime) {
    birthContext += ` Birth time: ${birthTime}.`;
  }
  if (birthLocation) {
    birthContext += ` Birth location: ${birthLocation}.`;
  }

  let userMessage: string;

  if (chartSummary && question) {
    userMessage = `${birthContext} Current: ${currentMonth} ${currentYear}. My chart: "${chartSummary}". My question: "${question}"`;
  } else {
    userMessage = `First visit. ${birthContext} Current: ${currentMonth} ${currentYear}. Calculate my Four Pillars and read my chart.`;
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 250,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  if (chartSummary && question) {
    const answer =
      text.match(/---answer---\s*([\s\S]*?)(?=---do---|$)/)?.[1]?.trim() ?? text.trim();
    const action =
      text.match(/---do---\s*([\s\S]*?)$/)?.[1]?.trim().replace(/^[-•*]\s*/, "") ?? "";

    return Response.json({
      success: true,
      type: "question",
      data: { answer, action },
    });
  } else {
    const chart =
      text.match(/---chart---\s*([\s\S]*?)(?=---year---|$)/)?.[1]?.trim() ?? "";
    const year =
      text.match(/---year---\s*([\s\S]*?)(?=---advice---|$)/)?.[1]?.trim() ?? "";
    const advice =
      text.match(/---advice---\s*([\s\S]*?)$/)?.[1]?.trim() ?? "";

    return Response.json({
      success: true,
      type: "first",
      data: { chart, year, advice },
    });
  }
}
