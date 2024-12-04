const mongoose = require("mongoose");
const async = require("async");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    labels: { type: Object },
    status: {
      type: String,
      default: "New",
    },
    dueDate: {
      type: String,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = (module.exports = mongoose.model("Task", taskSchema));

// Get tasks by IDs with proper error handling
module.exports.getTasksByIds = (taskIds, callback) => {
  const query = { _id: { $in: taskIds } };
  Task.find(query, (err, tasks) => {
    if (err) {
      return callback(err);
    }
    callback(null, tasks);
  });
};

// Add a new task with proper error handling
module.exports.addTask = (task, callback) => {
  Task.countDocuments({}, (err, count) => {
    if (err) {
      return callback(err);
    }
    task.order = count + 1;
    task.save((err, savedTask) => {
      if (err) {
        return callback(err);
      }
      callback(null, savedTask);
    });
  });
};

// Update an existing task with proper error handling
module.exports.updateTask = (userTask, callback) => {
  Task.findById(userTask.id, (err, task) => {
    if (err) {
      return callback(err);
    }
    if (!task) {
      return callback(null, false);
    }
    task.title = userTask.title;
    task.description = userTask.description;
    task.status = userTask.status;
    task.labels = userTask.labels;
    task.dueDate = userTask.dueDate;
    task.order = userTask.order;
    task.save((err, updatedTask) => {
      if (err) {
        return callback(err);
      }
      callback(null, updatedTask);
    });
  });
};

// Delete a task with proper error handling
module.exports.delete = (taskId, callback) => {
  Task.findByIdAndRemove(taskId, (err, deletedTask) => {
    if (err) {
      return callback(err);
    }
    callback(null, deletedTask);
  });
};

// Update the status of a task with proper error handling
module.exports.updateStatus = (taskId, newStatus, callback) => {
  Task.findById(taskId, (err, task) => {
    if (err) {
      return callback(err, null);
    }
    if (!task) {
      return callback(null, false);
    }
    task.status = newStatus;
    task.save((err, updatedTask) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, updatedTask);
    });
  });
};

// Archive a task or all completed tasks with proper error handling
module.exports.archiveTask = (taskId, callback) => {
  if (taskId === "all") {
    Task.updateMany(
      { status: "completed" },
      { $set: { archived: true } },
      (err, result) => {
        if (err) {
          return callback(err, false);
        }
        callback(null, result);
      }
    );
  } else {
    Task.findById(taskId, (err, task) => {
      if (err) {
        return callback(err, null);
      }
      if (!task) {
        return callback(null, false);
      }
      task.archived = true;
      task.save((err, archivedTask) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, archivedTask);
      });
    });
  }
};

// Update the order of multiple tasks with proper error handling
module.exports.updateOrder = (taskOrders, callback) => {
  let doneTillNow = [];
  async.each(
    Object.keys(taskOrders),
    (tId, innerCallback) => {
      Task.updateOne(
        { _id: mongoose.Types.ObjectId(tId) },
        { order: taskOrders[tId] },
        (err, res) => {
          if (err || !res) {
            return innerCallback(err || "Could not update order");
          }
          doneTillNow.push(res);
          innerCallback(null);
        }
      );
    },
    (err) => {
      if (err) {
        return callback(err, false);
      }
      if (doneTillNow.length === Object.keys(taskOrders).length) {
        callback(null, true);
      } else {
        callback(new Error("Not all orders were updated"), false);
      }
    }
  );
};
