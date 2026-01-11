// const express = require("express");
// const router = express.Router();
// const UserMemory = require("../models/UserMemory");
// const { getGeminiReply } = require("../services/geminiService");

// //post chat
// router.post("/", async (req, res) => {
//     try {
//         if (!req.body) {
//             return res.status(400).json({ error: "Request body missing" });
//         }
//         const { userId, message } = req.body;
//         if (!userId || !message) {
//             return res.status(400).json({ error: "userId and message are required" });
//         }

//         //loading or creating user memory
//         let memory = await UserMemory.findOne({ userId });
//         if (!memory) {
//             memory = await UserMemory.create({
//                 userId,
//                 memorySummary: ""
//             });
//         }


//         //temp bot response
//         // const reply = `I received your message: "${message}"`;
//         //adding gemini reply using tones
//         let tone = "casual";
//         if (message.toLowerCase().includes("sad")) {
//             tone = "empathetic";
//         }
//         if (message.toLowerCase().includes("fun")) {
//             tone = "playful";
//         }
//         const reply = await getGeminiReply({
//             message,
//             memorySummary: memory.memorySummary,
//             tone
//         });

//         //update memory timestamp
//         memory.updateAt = new Date();
//         await memory.save();

//         res.json({ reply });

//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const UserMemory = require("../models/UserMemory");
// const { getOpenAIReply } = require("../services/openaiService");
const { getLlamaReply } = require("../services/ollamaService");


router.post("/", async (req, res) => {
  try {
    console.log(" /chat hit");
    console.log(" req.body =", req.body);

    const { userId, message } = req.body || {};

    if (!userId || !message) {
      return res.status(400).json({ error: "userId or message missing" });
    }

    let memory = await UserMemory.findOne({ userId });
    if (!memory) {
      memory = await UserMemory.create({
        userId,
        memorySummary: "",
      });
    }

    const reply = await getLlamaReply({
      message,
      memorySummary: memory.memorySummary,
      tone: "empathetic",
    });

    res.json({ reply });
  } catch (err) {
    //  FORCE PRINT EVERYTHING to check
    console.error(" CHAT ROUTE ERROR ");
    console.error(err);
    console.error(" END ERROR ");

    res.status(500).json({
      error: err.message || "Unknown error",
    });
  }
});

module.exports = router;
