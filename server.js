const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();  // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection string stored in the .env file
mongoose.connect(process.env.CLOUD_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Mongoose Schema and Model
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
});

const Student = mongoose.model("Student", studentSchema);

// POST /students - Add a student
app.post("/students", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name || !email || !course || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const newStudent = new Student({ name, email, course });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /students - Get all students
app.get("/students/all", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;  // Allow for dynamic port setting in cloud environments
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
