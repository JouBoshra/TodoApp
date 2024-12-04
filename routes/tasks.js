const express = require("express");
const router = express.Router();
const passport = require("passport");
// const jwt = require("jsonwebtoken");

const config = require("../config/app");
const User = require("../models/user");
const Task = require("../models/task");

// Get all tasks for the authenticated user
router.get("/", (req, res, next) => {
  User.getTasks(req.user._id, (err, tasks) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to fetch tasks",
          error: err.message,
        });
    }
    res.json(tasks);
  });
});

// Save (add or update) a task
router.post("/save", (req, res, next) => {
  if (req.body.id) {
    const updatedTask = {
      id: req.body.id,
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "new",
      labels: req.body.labels || [],
      order: req.body.order || 1,
      dueDate: req.body.dueDate || "",
    };
    Task.updateTask(updatedTask, (err, task) => {
      if (err) {
        console.error("Error updating task:", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to update task",
            error: err.message,
          });
      }
      if (task) {
        res.json({
          success: true,
          message: "Task updated successfully",
          task: task.toJSON(),
        });
      } else {
        res.status(404).json({ success: false, message: "Task not found" });
      }
    });
  } else {
    const userId = req.user._id;
    const task = new Task({
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "new",
      labels: req.body.labels || [],
      dueDate: req.body.dueDate || "",
      user: userId,
    });
    User.addTask(userId, task, (err, task) => {
      if (err) {
        console.error("Error adding task:", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to add task",
            error: err.message,
          });
      }
      if (task) {
        res.json({
          success: true,
          message: "Task added successfully",
          task: task.toJSON(),
        });
      } else {
        res.status(500).json({ success: false, message: "Failed to add task" });
      }
    });
  }
});

// Delete a task
router.delete("/:taskId", (req, res, next) => {
  User.deleteTask(req.user._id, req.params.taskId, (err, deleted) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to delete task",
          error: err.message,
        });
    }
    if (deleted) {
      res.json({ success: true, message: "Task deleted" });
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: "Task not found or could not be deleted",
        });
    }
  });
});

// Change the status of a task
router.post("/change-status", (req, res, next) => {
  Task.updateStatus(req.body.id, req.body.newStatus, (err, task) => {
    if (err) {
      console.error("Error updating task status:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to update task status",
          error: err.message,
        });
    }
    if (task) {
      res.json({ success: true, message: "Task's status updated", task: task });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  });
});

// Archive a task or all completed tasks
router.get("/archive/:taskId", (req, res, next) => {
  Task.archiveTask(req.params.taskId, (err, archived) => {
    if (err) {
      console.error("Error archiving task(s):", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Could not archive task(s)",
          error: err.message,
        });
    }
    if (archived) {
      res.json({ success: true, message: "Task(s) archived" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Could not archive task(s)" });
    }
  });
});

// Update the order of tasks
router.post("/update/order", (req, res, next) => {
  Task.updateOrder(req.body.taskOrders, (err, done) => {
    if (err) {
      console.error("Error updating task order:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Could not update order",
          error: err.message,
        });
    }
    if (done) {
      res.json({ success: true, message: "Order updated" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Could not update order" });
    }
  });
});

module.exports = router;
