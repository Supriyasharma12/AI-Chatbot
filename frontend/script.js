const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

const USER_ID = "demo-user-1";

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  try {
    addMessage("Typing...", "bot");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: USER_ID,
        message,
      }),
    });

    const data = await res.json();
    chatBox.lastChild.remove(); // remove "Typing..."
    addMessage(data.reply || "Something went wrong.", "bot");
  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("Server not reachable.", "bot");
  }
}
