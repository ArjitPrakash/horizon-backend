const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    res.json({ text });

  } catch (error) {
    console.log(error);
    res.json({ text: "Server error occurred." });
  }
});

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "No response from AI.";

    res.json({ text: text || "No response from AI." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
