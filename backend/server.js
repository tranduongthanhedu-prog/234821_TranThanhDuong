
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: String,
  publisher: String,
  publishYear: Number,
  isbn: String,
  quantity: { type: Number, default: 0 },
  description: String
}, { versionKey: false, collection: "books" });

const Book = mongoose.model("Book", bookSchema);

// GET - Danh sach sach
app.get("/api/books", async (req, res) => {
  try {
    res.json(await Book.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Chi tiet sach
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) return res.status(404).json({ error: "Khong tim thay sach" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Them sach
app.post("/api/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - Cap nhat sach
app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { bookId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ error: "Khong tim thay sach" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Xoa sach
app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ bookId: req.params.id });
    if (!book) return res.status(404).json({ error: "Khong tim thay sach" });
    res.json({ message: "Xoa sach thanh cong" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

startServer();
