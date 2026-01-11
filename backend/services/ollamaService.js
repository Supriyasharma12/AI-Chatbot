async function getLlamaReply({ message,memorySummary,tone}){
    const prompt = `You are helpful AI assistant.
    Tone : ${tone}
    Known memory about user:
    ${memorySummary || "No prior memory"}

    Rules:
    - Be consise
    - Be empathetic if the user sounds sad
    - Do not hallucinate facts
    - If unsure, say you don't know

    User message: "${message}"
    `;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            model: "llama2:7b",
            prompt,
            stream:false
        })
    });

    const data = await response.json();

    

        if(!response.ok){
            console.error("OLLAMA ERROR:",data);
            throw new Error("Failed to get response from LLaMA-2");
        }
    return data.response;
}
module.exports = {getLlamaReply};