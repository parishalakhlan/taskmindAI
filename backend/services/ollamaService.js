const axios = require("axios");
const logger = require("../utils/logger");
const NodeCache = require("node-cache");
const crypto = require("crypto");
const { Readable } = require("stream");
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

class OllamaService {
  constructor() {
    this.baseURL = "http://localhost:11434/api";
    this.model = "llama3";
    this.timeout = 120000; // 30 seconds
  }

  // Helper: Generate hash key from prompt
  generateCacheKey(prompt) {
    return crypto.createHash("md5").update(prompt).digest("hex");
  }
  // Helper: Format prompt for consistency
  _formatPrompt(prompt) {
    return prompt.trim();
  }
  // Core AI request
  async generate(prompt, options = {}) {
    const config = {
      timeout: this.timeout,
      headers: { "Content-Type": "application/json" },
    };

    try {
      logger.info(`Sending prompt to Ollama: ${prompt.slice(0, 100)}...`);

      const response = await axios.post(
        `${this.baseURL}/generate`,
        {
          model: this.model,
          prompt: this._formatPrompt(prompt),
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 500,
            ...options,
          },
        },
        config
      );

      const text = response.data.response;
      const jsonMatch = text.match(/{.*}|\[.*\]/s);

      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      logger.info(`AI response: ${JSON.stringify(parsed).slice(0, 100)}...`);
      return parsed;
    } catch (err) {
      logger.error(`Ollama API failed: ${err.message}`);
      throw new Error(`AI service unavailable: ${err.message}`);
    }
  }
  async streamGenerate(prompt, res) {
    try {
      const response = await axios.post(
        `${this.baseURL}/generate`,
        {
          model: this.model,
          prompt: this._formatPrompt(prompt),
          stream: true,
          options: {
            temperature: 0.3,
            num_predict: 500,
          },
        },
        { responseType: "stream" }
      );

      let accumulated = "";

      response.data.on("data", (chunk) => {
        const text = chunk.toString();

        try {
          const parsed = JSON.parse(text);
          if (parsed.response) {
            accumulated += parsed.response;

            // Try to extract a full JSON array if it's complete
            const match = accumulated.match(/\[.*?\]/s);
            if (match) {
              const suggestions = JSON.parse(match[0]);
              for (const item of suggestions) {
                res.write(
                  `data: ${JSON.stringify({ response: item.title })}\n\n`
                );
              }

              res.write("data: end\n\n");
              res.end();
            }
          }
        } catch (err) {
          // Chunk might be incomplete JSON — ignore for now
          console.log("⚠️ Incomplete chunk, skipping:", text);
        }
      });

      response.data.on("end", () => {
        if (!res.writableEnded) {
          res.write("data: end\n\n");
          res.end();
        }
      });

      response.data.on("error", (err) => {
        console.error("Streaming error:", err);
        res.write("data: error\n\n");
        res.end();
      });
    } catch (err) {
      console.error("Streaming Ollama failed:", err);
      res.write("data: error\n\n");
      res.end();
    }
  }

  // Generate with schema enforcement
  async generateJSON(prompt, schema) {
    const strictPrompt = `
[IMPORTANT] Respond ONLY with VALID JSON using this schema:
${JSON.stringify(schema)}

Input: ${prompt}
    `;

    const cacheKey = this.generateCacheKey(strictPrompt);
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.generate(strictPrompt);
    cache.set(cacheKey, result);
    return result;
  }

  // Add this method inside your OllamaService class
  async suggestTasks(titles) {
    const prompt = `
    Based on this task: "${titles[0]}"
   
    Suggest 3 related sub-tasks or improvements as JSON array:
    [{ 
      "title": "...",
      "priority": "low|medium|high",
      "reason": "..."
    }]
  `;

    return await this.generate(prompt);
  }
}

module.exports = new OllamaService();
