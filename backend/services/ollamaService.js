async function getLlamaReply({ message, memorySummary, tone }) {
    const toneConfig = {
        supportive: "Be empathetic but brief.",
        neutral: "Answer directly in one sentence.",
        professional: "Concise, factual, no emotion."
    };

    const toneInstruction = toneConfig[tone] || toneConfig.neutral;

    const prompt = `You are helpful AI assistant.

    IMPORTANT MEMORY (USE THIS IF RELEVANT):
${memorySummary || "No known facts yet."}

   STRICT RULES (DO NOT BREAK):
- If the question can be answered using the memory above, answer using it
- Do NOT say you don't know if memory contains the answer
    - Keep response under 3 sentences
    - No explanations unless asked
    - Do not hallucinate facts
    - If unsure, say you don't know
    - No motivational speeches
    - Sound natural and human
    - Ask at most ONE short follow-up question 

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
            model: "llama2:7b",
            prompt,
            stream: false,
            options: {
                temperature: 0.3,   // less creativity
                top_p: 0.85,
                max_tokens: 50
            }     // HARD STOP
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("OLLAMA ERROR:", data);
        throw new Error("Failed to get response from LLaMA-2");
    }
    return data.response.trim();
}
module.exports = { getLlamaReply };