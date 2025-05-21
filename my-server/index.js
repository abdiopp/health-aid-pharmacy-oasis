const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const UserModel = require("./models/User");
const ChatModel = require("./models/Chat");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/pharmacyData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = 3003;

// Gemini AI API configuration
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = "YOUR_GEMINI_KEY"; // Replace with your actual API key

// Function to call Gemini AI API
async function callGeminiAI(message, history) {
  try {
    const prompt = `
      You are a pharmacy medical assistant providing information strictly about medicines, treatments, medical conditions, and pharmacy-related advice. 
      
      IMPORTANT INSTRUCTIONS:
      1. Only answer questions related to medicines, medications, health conditions, and medical advice.
      2. If the user asks about non-medical topics, politely redirect them by saying "I'm your medical assistant and can only provide information related to medicines and health. Please ask me about medications, treatments, or health conditions."
      3. Keep responses concise, accurate, and focused on medical information.
      4. Do not provide advice on topics outside healthcare, such as legal advice, financial advice, politics, entertainment, etc.
      5. Use professional medical terminology but explain it in simple terms.
      6. Always append this disclaimer to your response: "This is not professional medical advice. Consult a doctor for medical concerns."
      7. Do answer greetings and pleasantries, but keep them brief.
      8. Do not include any disclaimers or additional information outside the scope of the conversation.
      9. If user says "thank you", respond with "You're welcome! I'm here to help you with your medical questions."
      10. If user says "goodbye", respond with "Goodbye! I'm here if you need any medical information."
      11. If user says "hello", respond with "Hello! How can I assist you with your medical questions today?"
      12. If user says "hi", respond with "Hi! How can I assist you with your medical questions today?"
      13. If user says "thanks", respond with "You're welcome! I'm here to help you with your medical questions."
      
      Previous conversation: ${JSON.stringify(history)}
      User message: ${message}
      
      Provide accurate, focused medical information or advice only.
        Do not include any disclaimers or additional information outside the scope of the conversation.
        Respond in a friendly and professional manner.
        Do not provide any personal opinions or subjective statements.
        Do not and again saying do not answer any questions outside the scope of the conversation.
        if the user asks about non-medical topics, politely redirect them by saying "I'm your medical assistant and can only provide information related to medicines and health. Please ask me about medications, treatments, or health conditions."

    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Extract the AI response from the Gemini API response
    const aiResponse =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";
    return { response: aiResponse };
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return {
      response:
        "Error: Unable to get a response from the AI. Please try again later.",
    };
  }
}

// Middleware to verify user
const authenticateUser = async (req, res, next) => {
  // Handle email from either body (POST) or query parameters (GET)
  const email = req.body.email || req.query.email;

  if (!email) {
    return res.status(401).json({ error: "Email is required" });
  }

  try {
    // For development purposes, always accept a specific test email
    if (email === "abdi@gmail.com") {
      // Check if test user exists, if not create it
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          name: "Abdi Test",
          email: "abdi@gmail.com",
          password: "test123",
        });
        console.log("Created test user:", user.email);
      }
      req.user = user;
      return next();
    }

    // Normal authentication flow
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Authentication error" });
  }
};

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json({ message: "Success", user: user });
        } else {
          res.json({ error: "The Password is not correct!" });
        }
      } else {
        res.json({ error: "No Record Existed!" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Register route
app.post("/register", (req, res) => {
  UserModel.create(req.body)
    .then((user) => res.json({ message: "User registered", user }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Chat route for Gemini AI conversation
app.post("/chat", authenticateUser, async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  try {
    // Fetch user's chat history
    let chatSession = await ChatModel.findOne({ userId });
    if (!chatSession) {
      chatSession = new ChatModel({ userId, messages: [] });
    }

    // Add user message to history
    chatSession.messages.push({
      sender: "user",
      content: message,
      timestamp: new Date(),
    });

    // Get previous messages for context (limit to last 10 for brevity)
    const history = chatSession.messages.slice(-10).map((msg) => ({
      sender: msg.sender,
      content: msg.content,
    }));

    // Call Gemini AI with message and history
    const aiResponse = await callGeminiAI(message, history);

    // Add AI response to history
    chatSession.messages.push({
      sender: "ai",
      content: aiResponse.response,
      timestamp: new Date(),
    });

    // Save updated chat session
    await chatSession.save();

    // Return AI response and recent history
    res.json({
      response: aiResponse.response,
      history: chatSession.messages.slice(-10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chat history route - support both GET and POST methods
app.post("/chat/history", authenticateUser, async (req, res) => {
  const userId = req.user._id;
  try {
    const chatSession = await ChatModel.findOne({ userId });
    if (!chatSession) {
      return res.json({ history: [] });
    }
    res.json({ history: chatSession.messages.slice(-50) }); // Limit to last 50 messages
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Also keep the GET endpoint for compatibility
app.get("/chat/history", authenticateUser, async (req, res) => {
  const userId = req.user._id;
  try {
    const chatSession = await ChatModel.findOne({ userId });
    if (!chatSession) {
      return res.json({ history: [] });
    }
    res.json({ history: chatSession.messages.slice(-50) }); // Limit to last 50 messages
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
