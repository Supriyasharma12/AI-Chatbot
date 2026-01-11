// const fetch = require("node-fetch");

// const GEMINI_ENDPOINT =
//   "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

// async function getGeminiReply({ message, memorySummary, tone }) {
//   const prompt = `
// You are a helpful chatbot.

// Tone: ${tone}

// Known memory about the user:
// ${memorySummary || "No prior memory"}

// Rules:
// - Be concise
// - Do not hallucinate facts
// - If unsure, say you don't know

// User message:
// "${message}"
// `;

//   const response = await fetch(
//     `${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: prompt }],
//           },
//         ],
//       }),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     console.error("Gemini API error:", data);
//     throw new Error("Gemini API call failed");
//   }

//   return data.candidates[0].content.parts[0].text;
// }

// module.exports = { getGeminiReply };

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getOpenAIReply({ message, memorySummary, tone }) {
  const systemPrompt = `
You are a helpful chatbot.

Tone: ${tone}
Known memory about the user:
${memorySummary || "No prior memory"}

Rules:
- Be concise
- Be empathetic if the user sounds sad
- Do not hallucinate facts
- If unsure, say you don't know
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini", // low-cost, fast, perfect for demos
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0.6,
  });

  return completion.choices[0].message.content;
}

module.exports = { getOpenAIReply };
