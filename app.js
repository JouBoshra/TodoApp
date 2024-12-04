const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const util = require("./util");

const config = require("./config/app");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const staticRoot = path.join(__dirname, "public");

// Connect to MongoDB
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("DB connected successfully. " + config.database);
});
mongoose.connection.on("error", (err) => {
  console.log("DB connection error: " + err);
});
mongoose.set("useCreateIndex", true);

// Set up server
const app = express();
const appUrl = process.env.APP_URL || "http://localhost";
const port = process.env.PORT || 3000;

// Register Middlewares
app.use(cors());
app.use(express.json()); // Ensure JSON parsing before routes

// Initialize Passport
app.use(passport.initialize());
require("./config/passport")(passport);

// Register Routes
app.use("/api/users", userRoutes);
app.use(
  "/api/tasks",
  passport.authenticate(["jwt", "passport-google-oauth"], { session: false }),
  taskRoutes
);

// Google OAuth Routes
app.get(
  "/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/oauth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("/authenticated?token=" + req.user.google.id);
  }
);

// Serve static files and handle client-side routing
app.use(function (req, res, next) {
  // If the request is not HTML, proceed
  const accept = req.accepts("html", "json", "xml");
  if (accept !== "html") {
    return next();
  }
  // If the request has a '.', assume it's a file and proceed
  const ext = path.extname(req.path);
  if (ext !== "") {
    return next();
  }
  // Serve the index.html for client-side routing
  fs.createReadStream(staticRoot + "/index.html").pipe(res);
});

app.use(express.static(staticRoot));

// Start the server
app.listen(port, () => {
  console.log(`Server started on ${appUrl}:${port}`);
});
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({
      success: false,
      message: "An unexpected error occurred.",
      error: err.message,
    });
});
