const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const util = require("../util");

const config = require("../config/app");
const User = require("../models/user");

// Register a new user
router.post("/register", (req, res, next) => {
  const errors = validateRegisterRequest(req.body);
  if (errors.length) {
    return res.status(400).json({ status: "failure", errors: errors });
  }

  User.getUserByUsername(req.body.username, (err, existingUser) => {
    if (err) {
      console.error("Error fetching user by username:", err);
      return res
        .status(500)
        .json({
          status: "failure",
          message: "Server error",
          error: err.message,
        });
    }
    if (existingUser) {
      return res
        .status(400)
        .json({
          status: "failure",
          message:
            "User already exists with this username. Please choose a unique username",
        });
    }
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    User.addUser(newUser, (err, user) => {
      if (err) {
        console.error("Error adding user:", err);
        return res
          .status(500)
          .json({
            status: "failure",
            message: "Failed to add user",
            error: err.message,
          });
      }
      res.json({ status: "success", message: "User added successfully" });
    });
  });
});

// Login a user
router.post("/login", (req, res, next) => {
  User.getUserByUsername(req.body.username, (err, user) => {
    if (err) {
      console.error("Error fetching user by username:", err);
      return res
        .status(500)
        .json({
          status: "failure",
          message: "Server error",
          error: err.message,
        });
    }
    if (!user) {
      return res
        .status(400)
        .json({ status: "failure", message: "Invalid credentials" });
    }
    User.comparePassword(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res
          .status(500)
          .json({
            status: "failure",
            message: "Error comparing passwords",
            error: err.message,
          });
      }
      if (!isMatch) {
        return res
          .status(400)
          .json({ status: "failure", message: "Invalid credentials" });
      }
      res.json(util.getJwtToken(user));
    });
  });
});

// Login with Google
router.post("/login-with-google", (req, res, next) => {
  User.findOne({ "google.id": req.body.id }, (err, user) => {
    if (err) {
      console.error("Error finding user with Google ID:", err);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json(util.getJwtToken(user));
  });
});

// Logout a user
router.get("/logout", (req, res) => {
  req.logout();
  res.send({ success: true });
});

// Access dashboard (protected route)
router.get(
  "/dashboard",
  passport.authenticate(["jwt", "passport-google-oauth"], { session: false }),
  (req, res, next) => {
    res.send("DASHBOARD");
  }
);

// Validate registration request
const validateRegisterRequest = (details) => {
  const errors = [];
  if (!details.username) {
    errors.push("Username is required");
  }
  if (!details.email) {
    errors.push("Email is required");
  }
  if (!details.password) {
    errors.push("Password is required");
  }
  return errors;
};

module.exports = router;
