const mongoose = require('mongoose');
const async = require('async');

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  labels: { type: Object },
  status: {
    type: String,
    default: 'New'
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
    default: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
}, {
  timestamps: true
})

const Task = module.exports = mongoose.model("Task", taskSchema);

module.exports.getTasksByIds = (taskIds, callback) => {
  const query = { _id: { $in: taskIds }};
  Task.find(query, (err, tasks) => {
    if (err) throw err;
    callback(tasks);
  });
}

module.exports.addTask = (task, callback) => {
  Task.count({}, (err, count) => {
    task.order = count + 1;
    task.save(callback);
  });
}

module.exports.updateTask = (userTask, callback) => {
  Task.findById(userTask.id, (err, task) => {
    if (err) throw err;
    if(!task) {
      callback(null, false);
    } else {
      task.title = userTask.title;
      task.description = userTask.description;
      task.status = userTask.status;
      task.labels = userTask.labels;
      task.dueDate = userTask.dueDate;
      task.order = userTask.order;
      task.save(callback);
    }
  })
}

module.exports.delete = (taskId, callback) => {
  Task.findById(taskId).remove(callback);
}

module.exports.updateStatus = (taskId, newStatus, callback) => {
  Task.findById(taskId, (err, task) => {
    if (err) callback(err, null);
    if (task) {
      task.status = newStatus;
      task.save(callback);
    } else {
      callback(null, false);
    }
  })
}

module.exports.archiveTask = (taskId, callback) => {
  if (taskId === 'all') {
    Task.updateMany({ status: "completed" }, { $set: { archived: true }}, callback);
  } else {
    Task.findById(taskId, (err, task) => {
      if (err) callback(err, null);
      if (task) {
        task.archived = true;
        task.save(callback);
      } else {
        callback(null, false);
      }
    });
  }
}

module.exports.updateOrder = (taskOrders, callback) => {
  let doneTillNow = [];
  async.each(Object.keys(taskOrders), (tId, innerCallback) => {
    Task.updateOne({_id: mongoose.Types.ObjectId(tId) }, { order: taskOrders[tId]}, (err, res) => {
      if(err || !res) innerCallback(err || "Could not update order");
      if (res) {
        doneTillNow.push(res);
        innerCallback(null);
      }
    });
  }, (err) => {
    if (err) callback(err, false);
    if (doneTillNow.length === Object.keys(taskOrders).length) {
      callback(null, true);
    }
  })
}