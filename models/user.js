const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Task = require("./task");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    index: true,
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
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

const User = (module.exports = mongoose.model("User", UserSchema));

// Get user by username
module.exports.getUserByUsername = (username, callback) => {
  const query = { username: username };
  User.findOne(query, callback);
};

// Add a new user with proper error handling
module.exports.addUser = (user, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return callback(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return callback(err);
      }
      user.password = hash;
      user.save((err, savedUser) => {
        if (err) {
          return callback(err);
        }
        callback(null, savedUser);
      });
    });
  });
};

// Compare password with hash
module.exports.comparePassword = (userPassword, hash, callback) => {
  bcrypt.compare(userPassword, hash, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Get tasks associated with a user
module.exports.getTasks = (id, callback) => {
  User.findById(id, (err, user) => {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(new Error("User not found"));
    }
    Task.getTasksByIds(user.tasks, (err, tasks) => {
      if (err) {
        return callback(err);
      }
      callback(null, tasks);
    });
  });
};

// Add a task to a user
module.exports.addTask = (id, newTask, callback) => {
  Task.addTask(newTask, (err, task) => {
    if (err) {
      return callback(err);
    }
    User.findById(id, (err, user) => {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(new Error("User not found"));
      }
      user.tasks.push(task._id);
      user.save((err) => {
        if (err) {
          return callback(err);
        }
        callback(null, task);
      });
    });
  });
};

// Delete a task from a user
module.exports.deleteTask = (userId, taskId, callback) => {
  User.findById(userId, (err, user) => {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(new Error("User not found"));
    }
    user.tasks = user.tasks.filter((t) => t.toString() !== taskId);
    user.save((err) => {
      if (err) {
        return callback(err);
      }
      Task.delete(taskId, (err, deleted) => {
        if (err) {
          return callback(err);
        }
        callback(null, deleted);
      });
    });
  });
};
