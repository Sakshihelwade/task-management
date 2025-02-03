const express = require("express");
const TaskRouter = express.Router();
const { Task } = require("../Model/Task");
const { authentication } = require("../Middlewares/Authentication");
const { authrised } = require("../Middlewares/authrise");

// CREATE a new task
TaskRouter.post("/add/task", async (req, res) => {
  try {
    const { title, shortDescription, status } = req.body;

    // Find the task with the highest order number
    const lastTask = await Task.findOne().sort({ order: -1 });

    // Set the next order number
    const nextOrder = lastTask ? lastTask.order + 1 : 1;

    const newTask = new Task({
      title,
      shortDescription,
      status,
      order: nextOrder,
    });
    await newTask.save();

    res
      .status(201)
      .json({ message: "Task added successfully!", task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

TaskRouter.post("/add/tasks", async (req, res) => {
  try {
    const tasks = req.body; // Assuming the request body is an array of tasks
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "Provide an array of tasks." });
    }

    const newTasks = await Task.insertMany(tasks);
    res.status(201).json({
      message: "Tasks added successfully!",
      tasks: newTasks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all tasks with optional filtering by title or description
TaskRouter.get("/get/tasks", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Convert query parameters to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build the search filter
    const searchFilter = {
      $or: [
        { title: { $regex: search, $options: "i" } },         // Case-insensitive match for title
        { description: { $regex: search, $options: "i" } }    // Case-insensitive match for description
      ]
    };

    // Fetch tasks with pagination and search filter
    const tasks = await Task.find(search ? searchFilter : {})
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ order: 1 });

    // Total count for pagination info
    const totalTasks = await Task.countDocuments(search ? searchFilter : {});

    res.status(200).json({
      totalTasks,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalTasks / limitNumber),
      tasks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE a task by ID
TaskRouter.put("/update/task/:id", async (req, res) => {
  try {
    const { title, shortDescription, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, shortDescription, status },
      { new: true, runValidators: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

TaskRouter.put("/update/tasks/order", async (req, res) => {
  try {
    const tasks = req.body.tasks;

    // Update each task with its new order in the database
    for (let i = 0; i < tasks.length; i++) {
      await Task.findByIdAndUpdate(tasks[i]._id, { order: i });
    }

    res.status(200).json({ message: "Task order updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a task by ID
TaskRouter.delete("/delete/task/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  TaskRouter,
};
