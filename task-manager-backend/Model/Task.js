const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    title: { type: String },
    shortDescription: String,
    status: { type: String },
    order: Number,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = { Task };
