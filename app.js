//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// const secret = "Thisisourlittlesecreat.";

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
    const user = new User({
      email: req.body.username,
      password: hash,
    });

    user
      .save()
      .then(() => res.render("secrets"))
      .catch((err) => console.log(err));
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
  console.log("login 1");
  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password).then(function (result) {
          if (result === true) res.render("secrets");
        });
      }
    })
    .catch((err) => console.log(err));
});

// app.get("/", (req, res) => {
//   res.render("home");
// });

app.listen(3000, () => {
  console.log("Server is started on port 3000");
});
