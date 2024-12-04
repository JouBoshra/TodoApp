const path = require("path");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const util = require('./util');

const config = require("./config/app");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const staticRoot = path.join(__dirname, "public");

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("Db connected successfully. " + config.database);
})
mongoose.connection.on("error", (err) => {
  console.log("Db connection error: " + err);
});
mongoose.set('useCreateIndex', true);

// Set up server
const app = express();
const appUrl = process.env.APP_URL || "http://localhost";
const port = process.env.PORT || 3000;

// Register Middlewares
app.use(cors());
app.use(express.json());

// Serve static files


app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api/users", userRoutes);
app.use("/api/tasks", passport.authenticate(["jwt", "passport-google-oauth"], { session: false }), taskRoutes);

app.get('/oauth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/oauth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  res.redirect("/authenticated?token="+req.user.google.id);
});

app.use(function(req, res, next) {
  //if the request is not html then move along
  var accept = req.accepts('html', 'json', 'xml');
  if (accept !== 'html') {
      return next();
  }
  // if the request has a '.' assume that it's for a file, move along
  var ext = path.extname(req.path);
  if (ext !== '') {
      return next();
  }
  fs.createReadStream(staticRoot + '/index.html').pipe(res);

});

app.use(express.static(staticRoot));

app.listen(port, () => {
  console.log(`Server started on ${appUrl}:${port}`);
});