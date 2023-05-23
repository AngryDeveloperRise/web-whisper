//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = {
  email: String,
  password: String,
};

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
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });

  user
    .save()
    .then(() => res.render("secrets"))
    .catch((err) => console.log(err));
});

app.post("/login", (req, res) => {
  console.log(req.body);
  console.log("login 1");
  User.findOne({ email: req.body.username })
    .then((foundUser) => {
      if (foundUser) {
        console.log("login 2");
        if (foundUser.password === req.body.password) {
          console.log("login 3");
          res.render("secrets");
        } else {
          console.log("login 4");
          res.redirect("/login");
        }
      } else {
        console.log("login 5");
        res.redirect("/register");
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
