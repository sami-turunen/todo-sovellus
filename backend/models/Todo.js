import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

export default mongoose.model("Todo", todoSchema);
