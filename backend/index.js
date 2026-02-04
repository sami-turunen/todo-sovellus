import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import Todo from "./models/Todo.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find({});
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).json({ error: "Todo is required" });
  }
  const newTodo = new Todo({ todo });
  await newTodo.save();
  res.status(201).json(newTodo);
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { isCompleted, todo } = req.body;

  const pickedTodo = await Todo.findById(id);
  if (!pickedTodo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (todo !== undefined) pickedTodo.todo = todo;

  if (isCompleted !== undefined) pickedTodo.isCompleted = isCompleted;

  await pickedTodo.save();
  res.json(pickedTodo);
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json({ message: "Todo deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDb();
});
