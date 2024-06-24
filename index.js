const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.get("/", (req, res) => {
    res.sendFile("index.html",{root:'public'});
});

app.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
        });
        const r = await model.generateContent(prompt);
        res.json({ content: r.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port - http://localhost:${PORT}`);
});
