
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Book Management API" });
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await mongoose.connection.db
      .collection("books")
      .find({})
      .toArray();

    res.json(books);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

startServer();
