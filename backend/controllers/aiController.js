const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getTaskSuggestions = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // fast + free
    });

    const prompt = `Task: ${title}


 3 steps, ≤6 words each. Plain text, no symbols, no markdown.

No extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let suggestions = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 3)
      .map((line) => ({
        // Remove leading asterisks, dashes, numbers, and spaces
        title: line.replace(/^[-•*\d.\s]+/, "").trim(),
      }));

    // fallback
    if (suggestions.length === 0) {
      suggestions = [
        { title: "Break task into smaller steps" },
        { title: "Start with the easiest step" },
        { title: "Review and complete task" },
      ];
    }

    res.json(suggestions);
  } catch (error) {
    console.error("Gemini ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }
};
