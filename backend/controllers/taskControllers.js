const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ tasks, status: true, msg: "Tasks found successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found." });
    }
    res.status(200).json({ task, status: true, msg: "Task found successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

exports.postTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, category } = req.body;

    if (!title || !description || !dueDate || !priority || !status || !category) {
      return res.status(400).json({ status: false, msg: "All fields are required" });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      dueDate,
      priority,
      status,
      category,
    });

    res.status(201).json({ task, status: true, msg: "Task created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

exports.putTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, category } = req.body;

    if (!title || !description || !dueDate || !priority || !status || !category) {
      return res.status(400).json({ status: false, msg: "All fields are required" });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given ID not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't update another user's task" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, dueDate, priority, status, category },
      { new: true }
    );

    res.status(200).json({ task, status: true, msg: "Task updated successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given ID not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't delete another user's task" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
