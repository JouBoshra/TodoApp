const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Task = require('./task');

const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String,
    index: true
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  google: {
    id: String,
    token: String,
  },
  tasks : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Task'
    }
  ]
});

const User = module.exports = mongoose.model("User", UserSchema);

module.exports.getUserByUsername = (username, callback) => {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.addUser = (user, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw err;
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      user.save(callback);
    })
  })
};

module.exports.comparePassword = (userPassword, hash, callback) => {
  bcrypt.compare(userPassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(isMatch);
  });
};

module.exports.getTasks = (id, callback) => {
  User.findById(id, (err, user) => {
    if(err) throw err;
    Task.getTasksByIds(user.tasks, callback);
  })
};

module.exports.addTask = (id, newTask, callback) => {
  Task.addTask(newTask, (err, task) => {
    if (err) throw err;
    User.findById(id, (err, user) => {
      if (err) throw err;
      if (user) {
        user.tasks.push(task._id);
        user.save();
        callback(null, task);
      } else {
        callback(null, false);
      }
    })
  })
}

module.exports.deleteTask = (userId, taskId, callback) => {
  User.findById(userId, (err, user) => {
    if (err) throw err;
    if (user) {
      user.tasks = user.tasks.filter((t) => t !== taskId);
      user.save();
      Task.delete(taskId, callback);
    }
  })
}