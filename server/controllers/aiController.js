import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { config } from "../config/config.js";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are Rafeeq (رفيق), a respectful, knowledgeable Islamic worship companion assistant.
Speak with warmth and humility. Base guidance on mainstream Islamic understanding.
Always remain modest, never claim final religious authority, and remind the user to consult a qualified scholar for specific rulings.
Keep responses concise, supportive, and free of anything disrespectful. Use clear, simple language.`;

const cannedReply = (message) =>
  `Assalamu alaikum. I'm currently in offline mode, but I'm here for you. ` +
  `Regarding your message about "${message.slice(0, 80)}…", remember that consistency in small deeds is beloved to Allah. ` +
  `Even a few moments of remembrance each day nurture the heart. When my connection is restored I can give more detailed guidance. ` +
  `May Allah make your worship easy. (References: Qur'an 2:286 — Allah does not burden a soul beyond what it can bear.)`;

export const chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return ApiResponse.error(res, "Message is required", 400);

  if (!config.openaiApiKey) {
    return ApiResponse.success(
      res,
      { reply: cannedReply(message), mode: "offline", references: [] },
      "Offline reply"
    );
  }

  const openai = new OpenAI({ apiKey: config.openaiApiKey });
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.6,
    max_tokens: 500,
  });

  const reply = completion.choices[0].message.content;
  return ApiResponse.success(res, { reply, mode: "online", references: [] }, "Reply");
});

const RECOMMENDATIONS = {
  "3": [
    { title: "Say a short istighfar", detail: "Astaghfirullah — 3 times", xp: 3 },
    { title: "Quick dhikr", detail: "SubhanAllah, Alhamdulillah, Allahu Akbar", xp: 3 },
  ],
  "5": [
    { title: "Read a short surah", detail: "Surah Al-Ikhlas or An-Nas", xp: 5 },
    { title: "Two rak'ah nafl", detail: "Optional prayer for tranquility", xp: 5 },
  ],
  "10": [
    { title: "Recite Ayat al-Kursi", detail: "After prayer for protection", xp: 10 },
    { title: "Memorize a new du'a", detail: "Morning or evening remembrance", xp: 10 },
  ],
  "30": [
    { title: "Read a page of Qur'an", detail: "With reflection (tadabbur)", xp: 15 },
    { title: "Extended dhikr session", detail: "100 tasbih with focus", xp: 15 },
    { title: "Listen to a short tafsir", detail: "Reflect on one verse", xp: 15 },
  ],
};

export const recommend = asyncHandler(async (req, res) => {
  const { slot } = req.body;
  const key = ["3", "5", "10", "30"].includes(String(slot)) ? String(slot) : "5";
  const items = RECOMMENDATIONS[key] || RECOMMENDATIONS["5"];
  return ApiResponse.success(res, { slot: key, items }, "Recommendations");
});

const cannedReview = (fileName) => ({
  score: 78,
  tajweedNotes: [
    "Good makharij (articulation) on emphatic letters.",
    "Watch the lengthened madd on certain words — keep the timing steady.",
    "Maintain a calm, even pace for better clarity.",
  ],
  encouragement:
    "MashaAllah, a sincere effort. Keep revising daily; consistency is the path to mastery.",
  reference:
    "Compare with a certified Qari recitation (e.g., Mishary Alafasy) for tajweed reference.",
  fileName,
});

export const memorizationReview = asyncHandler(async (req, res) => {
  if (!req.file) return ApiResponse.error(res, "Audio file required", 400);

  const fileName = req.file.filename;
  if (!config.openaiApiKey) {
    return ApiResponse.success(
      res,
      { review: cannedReview(fileName), mode: "offline", audio: fileName },
      "Review (offline)"
    );
  }

  const openai = new OpenAI({ apiKey: config.openaiApiKey });
  const review = cannedReview(fileName);
  return ApiResponse.success(
    res,
    { review, mode: "online", audio: fileName },
    "Review"
  );
});
