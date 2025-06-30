import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const token = process.env.SLACK_BOT_TOKEN;
const channel = process.env.CHANNEL_ID;

// ✅ 1. Send a message
app.post("/send", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      { channel, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Send Error:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ 2. Edit a message
app.post("/edit", async (req, res) => {
  const { ts, newText } = req.body;

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.update",
      {
        channel,
        ts,
        text: newText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Edit Error:", err.message);
    res.status(500).json({ error: "Failed to edit message" });
  }
});

// ✅ 3. Delete a message
app.post("/delete", async (req, res) => {
  const { ts } = req.body;

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.delete",
      { channel, ts },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// ✅ 4. Get recent messages
app.get("/messages", async (req, res) => {
  try {
    const response = await axios.get(
      `https://slack.com/api/conversations.history?channel=${channel}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data.messages);
  } catch (err) {
    console.error("Messages Error:", err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ 5. Schedule a message
app.post("/schedule", async (req, res) => {
  const { text, postAt } = req.body;

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.scheduleMessage",
      {
        channel,
        text,
        post_at: postAt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Schedule Error:", err.message);
    res.status(500).json({ error: "Failed to schedule message" });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
