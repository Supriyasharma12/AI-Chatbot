async function getLlamaReply({ message, memorySummary, tone }) {

    const toneConfig = {
        supportive: "Be empathetic but brief.",
        neutral: "Answer directly in one sentence.",
        professional: "Concise, factual, no emotion."
    };

    const toneInstruction = toneConfig[tone] || toneConfig.neutral;

    const prompt = `
You are a calm, friendly, human-like assistant.

CORE BEHAVIOR:
- Be brief, clear, and natural
- Answer like a real person would in chat
- Stay focused on the user’s question
- Do not volunteer unrelated information

MEMORY RULES (IMPORTANT):
- If the answer exists in memory, use it
- Do not invent or guess facts
- If memory does not contain the answer, say you’re not sure

STYLE GUIDELINES:
- Keep replies under 3 sentences
- No lectures or explanations unless asked
- No motivational speeches
- Use simple, everyday language
- You may acknowledge emotions briefly (once), only if relevant

MEMORY:
${memorySummary || "No stored memory"}

Tone instruction:
${toneInstruction}

User question:
"${message}"

Assistant:
    `;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "mistral",
            prompt,
            stream: false,
            options: {
                temperature: 0.3,   // less creativity
                top_p: 0.85,
                max_tokens: 30,
                num_ctx: 1024
            }     // HARD STOP
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("OLLAMA ERROR:", data);
        throw new Error("Failed to get response from Ollama(Mistral");
    }
    return data.response.trim();
}
module.exports = { getLlamaReply };