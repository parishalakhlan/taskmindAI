const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getTaskSuggestions = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // fast + free
    });

    const prompt = `Task: ${title}

Return EXACTLY 3 bullet points.

Each bullet:
- max 8 words
- actionable step

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
        title: line.replace(/^[-•\d.\s]+/, ""),
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
