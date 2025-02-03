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
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    // Convert query parameters to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Initialize search filter as empty object
    let searchFilter = {};

    // If the search term is a number, filter by task number (order + 1)
    if (search) {
      const searchNumber = parseInt(search, 10);
      if (!isNaN(searchNumber)) {
        // If it's a valid number, filter by task order
        searchFilter.$or = [
          { title: { $regex: search, $options: "i" } },
          { shortDescription: { $regex: search, $options: "i" } },
          { order: searchNumber - 1 } // Match task order if search is a number
        ];
      } else {
        // If the search is not a number, search by title and shortDescription
        searchFilter.$or = [
          { title: { $regex: search, $options: "i" } },
          { shortDescription: { $regex: search, $options: "i" } }
        ];
      }
    }

    // Add status filter if a status is provided
    if (status) {
      searchFilter.status = status;
    }

    // Fetch tasks from the database with pagination and filters, sorted by order descending
    const tasks = await Task.find(searchFilter)
      .sort({ order: -1 })  // Sorting tasks by order in descending order (latest first)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Count total tasks matching the filter
    const totalTasks = await Task.countDocuments(searchFilter);

    // Calculate total pages
    const totalPages = Math.ceil(totalTasks / limitNumber);

    // Respond with the data
    res.json({
      tasks,
      totalTasks,
      totalPages,
      page: pageNumber
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
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
