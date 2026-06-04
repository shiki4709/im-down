import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const LUCK_TIERS = [
  { tier: "大吉", english: "Great Blessing", weight: 15 },
  { tier: "吉", english: "Blessing", weight: 25 },
  { tier: "中吉", english: "Middle Blessing", weight: 20 },
  { tier: "小吉", english: "Small Blessing", weight: 20 },
  { tier: "末吉", english: "Ending Blessing", weight: 10 },
  { tier: "凶", english: "Misfortune", weight: 10 },
] as const;

function drawLuck(): (typeof LUCK_TIERS)[number] {
  const total = LUCK_TIERS.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * total;
  for (const tier of LUCK_TIERS) {
    roll -= tier.weight;
    if (roll <= 0) return tier;
  }
  return LUCK_TIERS[1];
}

const SYSTEM_PROMPT = `You are the spirit of a Japanese shrine's omikuji box (おみくじ). You give fortunes in the traditional omikuji format — short, specific, and covering different life areas.

The user has drawn a luck tier. You must write fortunes for each category that match the tier's energy. 大吉 = wonderful news. 凶 = gentle warnings (but never cruel or scary — even 凶 should feel like caring guidance).

Your tone:
- Gentle, slightly formal but warm. Like a kind shrine maiden.
- Short and direct per category. 1 sentence each.
- Mix poetic with practical. "A door opens in the east" + "check your messages today."

Your response format — ALWAYS follow this exact structure. One short sentence per category:

---wish---
General wish/desire fortune

---love---
Romantic or relationship fortune

---health---
Health and wellbeing fortune

---work---
Career or study fortune

---money---
Financial fortune

---travel---
Travel or movement fortune

---advice---
One line of advice for the day. This is the most important line — make it feel personal and actionable.

Important:
- Match the energy of the luck tier. 大吉 = exciting, 凶 = cautious but kind.
- Keep each category to ONE sentence. This is a paper fortune, not an essay.
- Even 凶 fortunes should feel protective, not punishing. Like "be careful" not "bad things will happen."
- Never be generic. Each fortune should feel like it was written for today specifically.`;

export async function POST(): Promise<Response> {
  const luck = drawLuck();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `I drew: ${luck.tier} (${luck.english}). Give me my omikuji fortune.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const categories = ["wish", "love", "health", "work", "money", "travel", "advice"] as const;
  const parsed: Record<string, string> = {};

  for (const cat of categories) {
    const match = text.match(new RegExp(`---${cat}---\\s*([\\s\\S]*?)(?=---\\w|$)`));
    parsed[cat] = match?.[1]?.trim() ?? "";
  }

  return Response.json({
    success: true,
    data: {
      tier: luck.tier,
      english: luck.english,
      ...parsed,
    },
  });
}
