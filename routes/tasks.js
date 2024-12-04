const express = require("express");
const router = express.Router();
const passport = require("passport");
// const jwt = require("jsonwebtoken");

const config = require("../config/app");
const User = require("../models/user");
const Task = require("../models/task");

router.get("/", (req, res, next) => {
  User.getTasks(req.user._id, (tasks) => {
    res.send(tasks);
  })
});

router.post("/save", (req, res, next) => {
  if (req.body.id) {
    const updatedTask = {
      id: req.body.id,
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'new',
      labels: req.body.labels || [],
      order: req.body.order || 1,
      dueDate: req.body.dueDate || '',
    };
    Task.updateTask(updatedTask, (err, task) => {
      if (err) throw err;
      if (task) {
        res.json({ success: true, message: "Task updated successfully", task: task.toJSON() });
      } else {
        res.json({ success: false, message: "Failed to update task" });
      }
    })
  } else {
    const userId = req.user._id;
    const task = new Task({
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'new',
      labels: req.body.labels || [],
      dueDate: req.body.dueDate || '',
      user: userId,
    });
    User.addTask(userId, task, (err, task) => {
      if(err) throw err;
      if (task) {
        res.json({ success: true, message: "Task added successfully", task: task.toJSON() });
      } else {
        res.json({ success: false, message: "Failed to add task" });
      }
    });
  }
});

router.delete('/:taskId', (req, res, next) => {
  User.deleteTask(req.user._id, req.params.taskId, (err, deleted) => {
    if (err) throw err;
    if (deleted) {
      res.json({ success: true, message: "Task deleted" });
    } else {
      res.json({ success: false, message: "Failed to delete task" });
    }
  })
});

router.post('/change-status', (req, res, next) => {
  Task.updateStatus(req.body.id, req.body.newStatus, (err, task) => {
    if (err) throw err;
    if (task) {
      res.json({ success: true, message: "Task's status updated", task: task });
    } else {
      res.json({ success: false, message: "Failed to update status" });
    }
  })
});

router.get('/archive/:taskId', (req, res, next) => {
  Task.archiveTask(req.params.taskId, (err, archived) => {
    if (err) throw err;
    if (archived) {
      res.json({ success: true, message: "Task(s) archived" });
    } else {
      res.json({ success: false, message: "Could not archive task(s)" });
    }
  })
})

router.post('/update/order', (req, res, next) => {
  Task.updateOrder(req.body.taskOrders, (err, done) => {
    if (err) console.log(err);
    if (done) {
      res.json({ success: true, message: 'Order updated' });
    } else {
      res.json({ success: false, message: 'Could not update order' });
    }
  })
})

module.exports = router;